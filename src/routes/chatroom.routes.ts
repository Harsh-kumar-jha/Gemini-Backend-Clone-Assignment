import { Router } from 'express';
import { createChatroom, listChatrooms, getChatroomById } from '../controllers/chatroom.controller.js';
import { sendMessageToChatroom, getMessagesInChatroom } from '../controllers/message.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, createChatroom);
router.get('/', authMiddleware, listChatrooms);
router.get('/:id', authMiddleware, getChatroomById);
router.post('/:id/message', authMiddleware, sendMessageToChatroom);
router.get('/:id/messages', authMiddleware, getMessagesInChatroom);

export default router; 