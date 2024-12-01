import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import db from './config/database';
import swaggerSpec from './config/swagger';
import { logger } from './config/observability';
import { metricsMiddleware } from './middlewares/metrics';
import { errorHandler } from './middlewares/errorMiddleware';
import authRoutes from './routes/auth';
import urlRoutes from './routes/urls';
import UrlController from './controllers/urlController';
import { authenticate } from './middlewares/authMiddleware';
import { optionalAuthenticate } from './middlewares/optionalAuth';

dotenv.config();

const app = express();

app.use(express.json());
app.use(metricsMiddleware);

app.get('/health', async (req, res) => {
    try {
        await db.authenticate();
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        res.status(503).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas públicas
app.get('/:shortCode', UrlController.redirect);
app.use('/auth', authRoutes);

// Rota com autenticação opcional
app.post('/urls/shorten', optionalAuthenticate, UrlController.create);

// Rotas protegidas
app.use('/urls', authenticate, urlRoutes);

// Rota raiz
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

// Tratamento de erros global
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const startServer = async (): Promise<void> => {
  try {
    await db.sync();
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

// limpar na saída
process.on('SIGTERM', () => {
  logger.info('Recebido sinal SIGTERM. Encerrando...');
  process.exit(0);
});

export default app;