import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { app } from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
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

    const unexpectedErrorHandler = (error: Error) => {
      console.error('Unexpected error occurred:', error);
      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      if (server) {
        server.close();
      }
    });
  })
  .catch((err: Error) => {
    console.error('MongoDB connection failed: ', err);
    process.exit(1);
  });
