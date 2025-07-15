import { Request, Response } from 'express';
import { generateGeminiText } from '../services/gemini.service.js';
import logger from '../utils/logger.util.js';

export async function generateTextController(req: Request, res: Response) {
  const { prompt } = req.body;
  logger.info('[Gemini Route] /gemini/generate called with prompt:', prompt);
  if (!prompt) {
    logger.error('[Gemini Route] Missing prompt');
    return res.status(400).json({ success: false, message: 'Prompt is required' });
  }
  try {
    const text = await generateGeminiText(prompt);
    logger.info('[Gemini Route] Responding with text:', text);
    return res.status(200).json({ success: true, text });
  } catch (err: any) {
    logger.error('[Gemini Route] Gemini API error:', err?.message || err);
    return res.status(500).json({ success: false, message: 'Gemini API error', error: err?.message || err });
  }
} 