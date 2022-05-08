import { IResolvers } from '@graphql-tools/utils';
import { Listing, Database, User } from './../../../lib/types';
import { ObjectId } from 'mongodb';
import { authorize } from '../../../lib/utils';
import { Request } from 'express';
import { calculateSkip } from './../utils';
import {
  ListingArgs,
  ListingBookingsArgs,
  ListingBookingsData,
  ListingsArgs,
  ListingsData,
  ListingsFilter,
  ListingsQuery,
} from './types';
import { Google } from '../../../lib/api';

export const listingResolvers: IResolvers = {
  Query: {
    listing: listingQuery,
    listings: listingsQuery,
  },
  Listing: {
    id: getListingId,
    host: getListingHost,
    bookingsIndex: getListingBookingsIndex,
    bookings: getListingBookings,
  },
};

async function listingQuery(
  _root: undefined,
  { id }: ListingArgs,
  { db, req }: { db: Database; req: Request }
): Promise<Listing | null> {
  try {
    const listing = await db.listings.findOne({
      _id: new ObjectId(id),
    });

    if (!listing) {
      throw new Error("Listing can't be found");
    }

    const viewer = await authorize(db, req);
    if (viewer && viewer._id === listing.host) {
      listing.authorized = true;
    }

    return listing;
  } catch (error) {
    throw new Error(`Failed to get listing: ${error}`);
  }
}

async function listingsQuery(
  _root: undefined,
  { location, filter, limit, page }: ListingsArgs,
  { db }: { db: Database }
): Promise<ListingsData> {
  try {
    const query: ListingsQuery = {};

    const data: ListingsData = {
      region: null,
      total: 0,
      result: [],
    };

    if (location) {
      const { country, admin, city } = await Google.geocode(location);

      if (city) query.city = city;
      if (admin) query.admin = admin;
      if (country) {
        query.country = country;
      } else {
        throw new Error('No country found');
      }

      const cityText = city ? `${city}, ` : '';
      const adminText = admin ? `${admin}, ` : '';
      data.region = `${cityText}${adminText}${country}`;
    }

    let cursor = await db.listings.find(query);
    if (filter && filter === ListingsFilter.PRICE_LOW_TO_HIGH) {
      cursor = cursor.sort({
        price: 1,
      });
    }
    if (filter && filter === ListingsFilter.PRICE_HIGH_TO_LOW) {
      cursor = cursor.sort({
        price: -1,
      });
    }

    data.total = await cursor.count();
    cursor = cursor.limit(limit).skip(calculateSkip(page, limit));
    data.result = await cursor.toArray();
    

    return data;
  } catch (error) {
    throw new Error(`Failed to query listings: ${error}`);
  }
}

function getListingId(listing: Listing): string {
  return listing._id.toString();
}

async function getListingHost(
  listing: Listing,
  _args: undefined,
  { db }: { db: Database }
): Promise<User> {
  const host = await db.users.findOne({
    _id: listing.host,
  });

  if (!host) {
    throw new Error("Host can't be found");
  }

  return host;
}

function getListingBookingsIndex(listing: Listing): string {
  return JSON.stringify(listing.bookingsIndex);
}

async function getListingBookings(
  listing: Listing,
  { limit, page }: ListingBookingsArgs,
  { db }: { db: Database }
): Promise<ListingBookingsData | null> {
  try {
    if (!listing.authorized) {
      return null;
    }

    const data: ListingBookingsData = {
      total: 0,
      result: [],
    };

    let cursor = await db.bookings.find({
      _id: { $in: listing.bookings },
    });

    cursor = cursor.skip(calculateSkip(page, limit));
    cursor = cursor.limit(limit);

    data.total = await cursor.count();
    data.result = await cursor.toArray();

    return data;
  } catch (error) {
    throw new Error(`Failed to query listing bookings: ${error}`);
  }
}
