import { Request, Response } from 'express';
import { ChatroomService } from '../services/chatroom.service.js';
import logger from '../utils/logger.util.js';

export async function createChatroom(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user?.id;
  const { name } = req.body;
  logger.info('[ChatroomController] Create chatroom called by user:', userId, 'name:', name);
  if (!name) {
    logger.error('[ChatroomController] Chatroom name is required');
    return res.status(400).json({ success: false, message: 'Chatroom name is required' });
  }
  try {
    const chatroom = await ChatroomService.create(userId, name);
    logger.info('[ChatroomController] Chatroom created:', chatroom.id);
    return res.status(201).json({ success: true, chatroom });
  } catch (err: any) {
    logger.error('[ChatroomController] Error creating chatroom:', err?.message || err);
    return res.status(500).json({ success: false, message: 'Failed to create chatroom', error: err?.message || err });
  }
}

export async function listChatrooms(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user?.id;
  logger.info('[ChatroomController] List chatrooms called by user:', userId);
  try {
    const chatrooms = await ChatroomService.list(userId);
    return res.status(200).json({ success: true, chatrooms });
  } catch (err: any) {
    logger.error('[ChatroomController] Error listing chatrooms:', err?.message || err);
    return res.status(500).json({ success: false, message: 'Failed to list chatrooms', error: err?.message || err });
  }
}

export async function getChatroomById(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user?.id;
  const chatroomId = parseInt(req.params.id, 10);
  logger.info('[ChatroomController] Get chatroom detail called by user:', userId, 'chatroom:', chatroomId);
  if (isNaN(chatroomId)) {
    logger.error('[ChatroomController] Invalid chatroom id');
    return res.status(400).json({ success: false, message: 'Invalid chatroom id' });
  }
  try {
    const chatroom = await ChatroomService.getById(userId, chatroomId);
    if (!chatroom) {
      logger.warn('[ChatroomController] Chatroom not found:', chatroomId);
      return res.status(404).json({ success: false, message: 'Chatroom not found' });
    }
    return res.status(200).json({ success: true, chatroom });
  } catch (err: any) {
    logger.error('[ChatroomController] Error getting chatroom:', err?.message || err);
    return res.status(500).json({ success: false, message: 'Failed to get chatroom', error: err?.message || err });
  }
} 