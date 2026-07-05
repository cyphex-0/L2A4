import app from './app';
import config from './config';

const PORT = config.port || 5000;

async function bootstrap() {
  try {
    const server = app.listen(PORT, () => {
      console.log(`RentNest Backend Server is running on port ${PORT}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log('Server closed');
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error: unknown) => {
      console.error(error);
      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
      console.log('SIGTERM received');
      if (server) {
        server.close();
      }
    });
  } catch (err) {
    console.error('Failed to start server', err);
  }
}

bootstrap();
