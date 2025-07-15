import { connectRabbitMQ } from '../utils/rabbitmq.util.js';
import { MessageService } from '../services/message.service.js';
import { generateGeminiText } from '../services/gemini.service.js';
import logger from '../utils/logger.util.js';

// Log environment variables for debugging
logger.info('[GeminiWorker] ENV RABBITMQ_URL:', process.env.RABBITMQ_URL);
logger.info('[GeminiWorker] ENV GEMINI_API_KEY:', process.env.GEMINI_API_KEY);

const QUEUE_NAME = 'gemini-message-queue';

async function handleMessage(channel: any, msg: any) {
  try {
    const content = msg.content.toString();
    const { userId, chatroomId, content: userMessage } = JSON.parse(content);
    logger.info('[GeminiWorker] Processing message for chatroom:', chatroomId, 'user:', userId);
    logger.info('[GeminiWorker] Calling Gemini API with:', userMessage);
    const geminiResponse = await generateGeminiText(userMessage);
    logger.info('[GeminiWorker] Gemini API response:', JSON.stringify(geminiResponse));
    await MessageService.storeMessage(chatroomId, 'gemini', geminiResponse);
    logger.info('[GeminiWorker] Gemini response stored for chatroom:', chatroomId);
    channel.ack(msg);
  } catch (err: any) {
    logger.error('[GeminiWorker] Error processing message:', err?.message || err);
    channel.nack(msg, false, false);
  }
}

async function startWorker() {
  logger.info('[GeminiWorker] Starting Gemini message worker...');
  const channel = await connectRabbitMQ();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  channel.consume(QUEUE_NAME, async (msg: any) => {
    if (!msg) return;
    await handleMessage(channel, msg);
  }, { noAck: false });
}

startWorker().catch((err) => logger.error('[GeminiWorker] Worker failed to start:', err));

// Graceful shutdown and error handling for production
process.on('SIGINT', () => {
  logger.info('[GeminiWorker] Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});
process.on('SIGTERM', () => {
  logger.info('[GeminiWorker] Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});
process.on('unhandledRejection', (reason, promise) => {
  logger.error('[GeminiWorker] Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  logger.error('[GeminiWorker] Uncaught Exception thrown:', err);
  process.exit(1);
}); 