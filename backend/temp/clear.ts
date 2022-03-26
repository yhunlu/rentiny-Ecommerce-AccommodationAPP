import 'dotenv/config';
import { connectDatabase } from '../src/database';

const clear = async () => {
  try {
    console.log('[clear]: running...');

    const db = await connectDatabase();

    const bookings = await db.bookings.find({}).toArray();
    const listings = await db.listings.find({}).toArray();
    const users = await db.users.find({}).toArray();

    if (bookings.length > 0) {
      await db.bookings.drop();
      console.log('[clear]: bookings deleted');
    }

    if (listings.length > 0) {
      await db.listings.drop();
      console.log('[clear]: listings deleted');
    }

    if (users.length > 0) {
      await db.users.drop();
      console.log('[clear]: users deleted');
    }

    console.log('[clear]: successfull to clear database...');
  } catch (error) {
    throw new Error('failed to clear database !!!');
  }
};

clear();
