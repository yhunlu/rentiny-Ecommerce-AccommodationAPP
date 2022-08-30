import dotenv from 'dotenv';

dotenv.config();

import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import express, { Application } from 'express';
import { connectDatabase } from './database';
import { resolvers, typeDefs } from './graphql';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

const PORT = process.env.PORT || 5000;

const mount = async (app: Application) => {
  try {
    const db = await connectDatabase();

    app.use(bodyParser.json({ limit: '2mb' }));
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use((_req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      next();
    });

    app.use(cors());

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req, res }) => ({ db, req, res }),
    });
    await server.start();
    server.applyMiddleware({ app, path: '/api' });

    const __dirname = path.resolve();
    if (process.env.NODE_ENV === 'production') {
      // go to find static files from frontend
      app.use(express.static(path.join(__dirname, '/frontend/build')));

      app.get('/', (_req, res) => {
        res.sendFile(
          path.resolve(__dirname, 'frontend', 'build', 'index.html')
        );
      });
    }

    app.listen(PORT, () => console.log(`[app]: http://localhost:${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

mount(express());
