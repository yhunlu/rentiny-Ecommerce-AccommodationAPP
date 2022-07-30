import { IResolvers } from '@graphql-tools/utils';
import { Listing, Database, User, ListingType } from './../../../lib/types';
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
  HostListingInput,
  HostListingArgs,
} from './types';
import { Cloudinary, Google } from '../../../lib/api';

const verifyHostListingInput = ({
  title,
  description,
  type,
  price,
}: HostListingInput) => {
  if (title.length > 100) {
    throw new Error('Listing title must be under 100 characters');
  }

  if (description.length > 5000) {
    throw new Error('Listing description must be under 5000 characters');
  }

  if (type !== ListingType.Apartment && type !== ListingType.House) {
    throw new Error('Listing type must be either an apartment or house');
  }

  if (price < 0) {
    throw new Error('Price must be greater than 0');
  }
};

export const listingResolvers: IResolvers = {
  Query: {
    listing: listingQuery,
    listings: listingsQuery,
  },
  Mutation: {
    hostListing: async (
      _root: undefined,
      { input }: HostListingArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Listing> => {
      verifyHostListingInput(input);

      const viewer = await authorize(db, req);
      if (!viewer) {
        throw new Error('viewer cannot be found');
      }

      const { country, admin, city } = await Google.geocode(input.address);
      if (!country || !admin || !city) {
        throw new Error('invalid address input');
      }

      const imageUrl = await Cloudinary.upload(input.image);

      const listing: Listing = {
        _id: new ObjectId(),
        ...input,
        image: imageUrl,
        bookings: [],
        bookingsIndex: {},
        country,
        admin,
        city,
        host: viewer._id,
      };

      await db.listings.insertOne(listing);

      await db.users.updateOne(
        {
          _id: viewer._id,
        },
        {
          $push: {
            listings: listing._id,
          },
        }
      );

      return listing;
    },
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

    data.total = await cursor.count();
    cursor = cursor.limit(limit).skip(calculateSkip(page, limit));
    data.result = await cursor.toArray();

    return data;
  } catch (error) {
    throw new Error(`Failed to query listing bookings: ${error}`);
  }
}
