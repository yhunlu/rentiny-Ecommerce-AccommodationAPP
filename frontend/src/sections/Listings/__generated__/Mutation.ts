/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Mutation
// ====================================================

export interface Mutation_deleteListing {
  __typename: "Listing";
  id: string;
}

export interface Mutation {
  deleteListing: Mutation_deleteListing;
}

export interface DeleteListingVariables {
  id: string;
}
