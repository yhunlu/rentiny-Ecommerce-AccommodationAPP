import React from 'react';
import { useQuery } from '@apollo/client';
import { USER } from '../../lib/graphql/queries';
import {
  User as UserData,
  UserVariables,
} from './../../lib/graphql/queries/User/__generated__/User';
import { useParams } from 'react-router';
import { Viewer } from './../../lib/types';
import { Col, Layout, Row } from 'antd';
import { UserProfile } from './components';
interface UserProps {
  viewer: Viewer;
}

const { Content } = Layout;

const User = ({ viewer }: UserProps) => {
  const { userId } = useParams();
  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: {
      id: userId ?? '',
    },
  });

  const user = data ? data.user : null;
  const viewerIsUser = viewer.id === userId;
  const userProfileElement = user ? (
    <UserProfile user={user} viewerIsUser={viewerIsUser} />
  ) : null;

  return (
    <Content className="user">
      <Row gutter={12} justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
      </Row>
    </Content>
  );
};

export default User;
