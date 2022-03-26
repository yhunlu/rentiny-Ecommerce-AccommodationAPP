import { MongoClient } from 'mongodb';
import { Database, User, Listing, Booking } from '../lib/types';

const url = `${process.env.MONGO_DB_URL}`;

export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(url);

  const db = client.db('main');

  return {
    bookings: db.collection<Booking>('bookings'),
    listings: db.collection<Listing>('listings'),
    users: db.collection<User>('users'),
  };
};
