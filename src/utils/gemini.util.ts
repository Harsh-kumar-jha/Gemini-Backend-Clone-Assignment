import { GoogleGenAI } from '@google/genai';
import { env } from '../configs/env.js';

export const gemini = new GoogleGenAI({}); 