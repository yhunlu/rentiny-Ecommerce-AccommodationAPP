/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { HostListingInput, ListingType } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: HostListing
// ====================================================

export interface HostListing_hostListing {
  __typename: "Listing";
  id: string;
  title: string;
  description: string;
  image: string;
  type: ListingType;
  address: string;
  price: number;
  numOfGuests: number;
}

export interface HostListing {
  hostListing: HostListing_hostListing;
}

export interface HostListingVariables {
  input: HostListingInput;
}
