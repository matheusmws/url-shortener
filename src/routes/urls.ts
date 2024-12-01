import { Router } from 'express';
import { UrlController } from '../controllers/urlController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /urls/shorten:
 *   post:
 *     tags:
 *       - URLs
 *     summary: Cria uma URL curta (endpoint público)
 *     description: Cria uma URL curta. Se um token for fornecido, a URL será vinculada ao usuário.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUrlDto'
 *     responses:
 *       201:
 *         description: URL encurtada criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UrlResponseDto'
 *       400:
 *         description: Dados inválidos
 */
router.post('/shorten', UrlController.create);

/**
 * @swagger
 * /urls/my-urls:
 *   get:
 *     summary: Lista todas as URLs do usuário
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UrlResponseDto'
 */
router.get('/my-urls', requireAuth, UrlController.getUserUrls);

/**
 * @swagger
 * /urls/{shortCode}:
 *   put:
 *     summary: Atualiza uma URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UrlResponseDto'
 */
router.put('/:shortCode', requireAuth, UrlController.update);

/**
 * @swagger
 * /urls/{shortCode}:
 *   delete:
 *     summary: Remove uma URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: URL removida com sucesso
 */
router.delete('/:shortCode', requireAuth, UrlController.delete);

export default router; 