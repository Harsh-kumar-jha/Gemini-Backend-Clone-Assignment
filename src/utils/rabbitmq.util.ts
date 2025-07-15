import amqp, { ConsumeMessage } from 'amqplib';
import logger from './logger.util.js';
import { env } from '../configs/env.js';

const RABBITMQ_URL = env.RABBITMQ_URL;

export async function connectRabbitMQ() {
  logger.info('[RabbitMQ] Connecting to', RABBITMQ_URL);
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  logger.info('[RabbitMQ] Connected');
  return channel;
}

export async function publishToQueue(queue: string, message: any) {
  const ch = await connectRabbitMQ();
  await ch.assertQueue(queue, { durable: true });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  logger.info('[RabbitMQ] Published message to queue:', queue, message);
}

export async function consumeQueue(queue: string, onMessage: (msg: ConsumeMessage | null) => void) {
  const ch = await connectRabbitMQ();
  await ch.assertQueue(queue, { durable: true });
  ch.consume(queue, onMessage, { noAck: false });
  logger.info('[RabbitMQ] Consuming queue:', queue);
} 