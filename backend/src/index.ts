import 'dotenv/config';

import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import express, { Application } from 'express';
import { connectDatabase } from './database';
import { resolvers, typeDefs } from './graphql';
import cors from 'cors';
import bodyParser from 'body-parser';

const PORT = process.env.PORT || 5000;

const mount = async (app: Application) => {
  try {
    const db = await connectDatabase();

    app.use(bodyParser.json({ limit: '2mb' }));
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use((req, res, next) => {
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

    app.listen(PORT, () => console.log(`[app]: http://localhost:${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

mount(express());
