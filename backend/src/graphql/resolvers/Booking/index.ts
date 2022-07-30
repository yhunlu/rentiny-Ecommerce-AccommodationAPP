import { IResolvers } from '@graphql-tools/utils';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { Stripe } from '../../../lib/api';
import { authorize } from '../../../lib/utils';
import {
  Database,
  Booking,
  Listing,
  BookingsIndex,
} from './../../../lib/types';
import { CreateBookingArgs } from './types';

const millisecondsPerDay = 86400000;

const resolveBookingsIndex = (
  bookingsIndex: BookingsIndex,
  checkInDate: string,
  checkOutDate: string
): BookingsIndex => {
  let dateCursor = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const newBookingsIndex: BookingsIndex = { ...bookingsIndex };

  while (dateCursor <= checkOut) {
    const year = dateCursor.getUTCFullYear(); // 2020
    const month = dateCursor.getUTCMonth(); // 0-11
    const day = dateCursor.getUTCDate(); // 1-31

    if (!newBookingsIndex[year]) {
      newBookingsIndex[year] = {};
    }

    if (!newBookingsIndex[year][month]) {
      newBookingsIndex[year][month] = {};
    }

    if (!newBookingsIndex[year][month][day]) {
      newBookingsIndex[year][month][day] = true;
    } else {
      throw new Error(
        'selected dates cannot overlap dates that have already been booked.'
      );
    }

    dateCursor = new Date(dateCursor.getTime() + millisecondsPerDay);
  }

  return newBookingsIndex;
};

export const bookingResolvers: IResolvers = {
  Mutation: {
    createBooking: async (
      _root: undefined,
      { input }: CreateBookingArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Booking> => {
      try {
        const { id, source, checkIn, checkOut } = input;

        // verified user can make a request
        const viewer = await authorize(db, req);
        if (!viewer) {
          throw new Error('viewer cannot be found');
        }

        // finding listing document that is being booked
        const listing = await db.listings.findOne({ _id: new ObjectId(id) });

        if (!listing) {
          throw new Error('listing cannot be found');
        }

        // check that viewer is NOT booking their own listing
        if (listing.host === viewer._id) {
          throw new Error('viewer cannot book own listing');
        }

        // check that checkOut is NOT before checkIn
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkOutDate < checkInDate) {
          throw new Error('check-out-date must be after check-in-date');
        }

        // create a new bookingsIndex for listing being booked
        const bookingsIndex = resolveBookingsIndex(
          listing.bookingsIndex,
          checkIn,
          checkOut
        );

        // get total price to charge
        const totalPrice = Math.round(
          listing.price *
            ((checkOutDate.getTime() - checkInDate.getTime()) /
              (millisecondsPerDay + 1))
        );

        // get user document of host of listing
        const host = await db.users.findOne({ _id: listing.host });

        if (!host || !host.walletId) {
          throw new Error(
            "The host either can't be found or is not connected with Stripe."
          );
        }

        // create Stripe charge on behalf of host
        await Stripe.charge(totalPrice, source, host.walletId);

        // insert a new booking document to booking collection
        const booking: Booking = {
          _id: new ObjectId(),
          listing: listing._id,
          tenant: viewer._id,
          checkIn,
          checkOut,
        };

        db.bookings.insertOne(booking);

        // update user document of host to increment income
        await db.users.updateOne(
          { _id: host._id },
          { $inc: { income: (totalPrice - (totalPrice * 0.05)) } }
        );

        // update bookings field of tenant
        await db.users.updateOne(
          { _id: viewer._id },
          { $push: { bookings: booking._id } }
        );

        // update bookings field of listing document
        await db.listings.updateOne(
          { _id: listing._id },
          {
            $set: { bookingsIndex },
            $push: { bookings: booking._id },
          }
        );

        // return the new booking document
        return booking;
      } catch (error) {
        throw new Error(
          'Failure to create booking. Please try again later: ' + error
        );
      }
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
    tenant: (booking: Booking, _args: unknown, { db }: { db: Database }) => {
      return db.users.findOne({ _id: booking.tenant });
    },
  },
};
