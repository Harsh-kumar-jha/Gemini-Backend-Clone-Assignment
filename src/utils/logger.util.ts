const logger = {
  info: (...args: any[]) => console.log('[INFO]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
  stream: {
    write: (message: string) => console.log('[HTTP]', message.trim()),
  },
};

export default logger; 