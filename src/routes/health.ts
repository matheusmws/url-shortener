import { Router } from 'express';
import sequelize from '../config/database';

const router = Router();

router.get('/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        res.status(503).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message as string,
            timestamp: new Date().toISOString()
        });
    }
});

export default router; 