import React from 'react';
import { useQuery } from '@apollo/client';
import { USER } from '../../lib/graphql/queries';
import {
  User as UserData,
  UserVariables,
} from './../../lib/graphql/queries/User/__generated__/User';
import { useParams } from 'react-router';
import { Viewer } from './../../lib/types';

interface UserProps {
  viewer: Viewer;
}

const User = ({ viewer }: UserProps) => {
  const { userId } = useParams();
  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: {
      id: userId ?? '',
    },
  });

  return <div>User</div>;
};

export default User;
