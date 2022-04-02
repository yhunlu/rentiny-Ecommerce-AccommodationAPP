import { IResolvers } from '@graphql-tools/utils';

// create userResolvers
export const userResolvers: IResolvers = {
  Query: {
    user: () => {
      return 'Query.user';
    },
  },
};
