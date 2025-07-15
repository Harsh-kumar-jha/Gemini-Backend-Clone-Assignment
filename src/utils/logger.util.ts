import chalk from 'chalk';

function timestamp() {
  return chalk.gray(new Date().toISOString());
}

const logger = {
  info: (...args: any[]) => console.log(timestamp(), chalk.blue('[INFO]'), ...args),
  error: (...args: any[]) => console.error(timestamp(), chalk.red('[ERROR]'), ...args),
  warn: (...args: any[]) => console.warn(timestamp(), chalk.yellow('[WARN]'), ...args),
  success: (...args: any[]) => console.log(timestamp(), chalk.green('[SUCCESS]'), ...args),
  stream: {
    write: (message: string) => console.log(timestamp(), chalk.cyan('[HTTP]'), message.trim()),
  },
  banner: (services: Record<string, boolean | string>) => {
    console.log(chalk.bold.bgBlue.white(' Gemini Backend Assignment '));
    Object.entries(services).forEach(([name, status]) => {
      if (status === true) {
        console.log(chalk.green(`✔ ${name} connected`));
      } else if (status === false) {
        console.log(chalk.red(`✖ ${name} not connected`));
      } else {
        console.log(chalk.yellow(`ℹ ${name}: ${status}`));
      }
    });
    console.log();
  }
};

export default logger; 