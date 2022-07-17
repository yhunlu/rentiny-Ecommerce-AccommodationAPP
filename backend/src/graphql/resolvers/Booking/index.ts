import { IResolvers } from '@graphql-tools/utils';
import { Database, Booking, Listing } from './../../../lib/types';

export const bookingResolvers: IResolvers = {
  Mutation: {
    createBooking: () => {
      return 'Mutation.createBooking';
    },
  },
  Booking: {
    id: (booking: Booking): string => {
      return booking._id.toString();
    },
    listing: (
      booking: Booking,
      _args: unknown,
      { db }: { db: Database }
    ): Promise<Listing | null> => {
      return db.listings.findOne({ _id: booking.listing });
    },
  },
};
