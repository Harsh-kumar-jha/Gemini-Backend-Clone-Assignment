import { gemini } from '../utils/gemini.util.js';
import logger from '../utils/logger.util.js';

export async function generateGeminiText(prompt: string): Promise<string> {
  logger.info('[Gemini] Generating text for prompt:', prompt);
  const response = await gemini.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  logger.info('[Gemini] Response text:', response.text);
  return response.text ?? '';
} 