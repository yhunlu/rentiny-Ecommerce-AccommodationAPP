import React from 'react';
import { server } from '../../lib/api';
import {
  DeleteListingData,
  DeleteListingVariables,
  ListingsData,
} from './types';

const LISTINGS = `
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

const DELETE_LISTING = `
  mutation Mutation($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

type Props = {
  title: string;
};

const Listings = ({ title }: Props) => {
  const fetchListings = async () => {
    console.log('Here!');
    const { data } = await server.fetch<ListingsData>({ query: LISTINGS });
    console.log(data.listings);
  };

  const deleteListing = async () => {
    const { data } = await server.fetch<
      DeleteListingData,
      DeleteListingVariables
    >({
      query: DELETE_LISTING,
      variables: {
        id: '622fb90cbc145a9e06d8f3e4',
      },
    });
    console.log(data);
  };

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={fetchListings}>Get Listings</button>
      <button onClick={deleteListing}>Delete Listing</button>
    </div>
  );
};

export default Listings;
