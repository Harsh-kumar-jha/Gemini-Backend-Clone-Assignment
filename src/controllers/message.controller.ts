import { Request, Response } from 'express';
import { MessageService } from '../services/message.service.js';
import logger from '../utils/logger.util.js';

export async function sendMessageToChatroom(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user?.id;
  const chatroomId = parseInt(req.params.id, 10);
  const { content } = req.body;
  logger.info('[MessageController] sendMessageToChatroom called by user:', userId, 'chatroom:', chatroomId, 'content:', content);
  if (isNaN(chatroomId) || !content) {
    logger.error('[MessageController] Invalid chatroom id or missing content');
    return res.status(400).json({ success: false, message: 'Invalid chatroom id or missing content' });
  }
  try {
    await MessageService.storeMessage(chatroomId, 'user', content);
    await MessageService.sendMessage(userId, chatroomId, content);
    logger.info('[MessageController] Message enqueued for chatroom:', chatroomId);
    return res.status(202).json({ success: true, message: 'Message enqueued for processing' });
  } catch (err: any) {
    logger.error('[MessageController] Error sending message:', err?.message || err);
    return res.status(500).json({ success: false, message: 'Failed to send message', error: err?.message || err });
  }
}

export async function getMessagesInChatroom(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user?.id;
  const chatroomId = parseInt(req.params.id, 10);
  logger.info('[MessageController] getMessagesInChatroom called by user:', userId, 'chatroom:', chatroomId);
  if (isNaN(chatroomId)) {
    logger.error('[MessageController] Invalid chatroom id');
    return res.status(400).json({ success: false, message: 'Invalid chatroom id' });
  }
  try {
    const messages = await MessageService.getMessages(chatroomId);
    return res.status(200).json({ success: true, messages });
  } catch (err: any) {
    logger.error('[MessageController] Error fetching messages:', err?.message || err);
    return res.status(500).json({ success: false, message: 'Failed to fetch messages', error: err?.message || err });
  }
}

// Debug endpoint to check system status
export async function debugStatus(req: Request, res: Response) {
  const status = {
    timestamp: new Date().toISOString(),
    environment: {
      RABBITMQ_URL: !!process.env.RABBITMQ_URL,
      GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
      DATABASE_URL: !!process.env.DATABASE_URL,
    },
    message: 'System status check'
  };
  
  logger.info('[MessageController] Debug status requested:', status);
  return res.status(200).json({ success: true, status });
} 