import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { USER } from '../../lib/graphql/queries';
import {
  User as UserData,
  UserVariables,
} from './../../lib/graphql/queries/User/__generated__/User';
import { useParams } from 'react-router';
import { Viewer } from './../../lib/types';
import { Col, Layout, Row } from 'antd';
import { UserBookings, UserListings, UserProfile } from './components';
import { ErrorBanner, PageSkeleton } from '../../lib/components';
interface UserProps {
  viewer: Viewer;
}

const { Content } = Layout;
const PAGE_LIMIT = 4;

const User = ({ viewer }: UserProps) => {
  const [listingsPage, setListingsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);
  const { userId } = useParams();
  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: {
      id: userId ?? '',
      bookingsPage,
      listingsPage,
      limit: PAGE_LIMIT,
    },
  });

  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="user">
        <ErrorBanner description="This user may not exist or we've encountered an error. Please try again soon." />
        <PageSkeleton />
      </Content>
    );
  }

  const user = data ? data.user : null;
  const viewerIsUser = viewer.id === userId;

  const userListings = user ? user.listings : null;
  const userBookings = user ? user.bookings : null;

  const userProfileElement = user ? (
    <UserProfile user={user} viewerIsUser={viewerIsUser} />
  ) : null;

  const userListingsElement = userListings ? (
    <UserListings
      userListings={userListings}
      listingsPage={listingsPage}
      setListingsPage={setListingsPage}
      limit={PAGE_LIMIT}
    />
  ) : null;

  const userBookingsElement = userBookings ? (
    <UserBookings
      userBookings={userBookings}
      bookingsPage={bookingsPage}
      setBookingsPage={setBookingsPage}
      limit={PAGE_LIMIT}
    />
  ) : null;

  return (
    <Content className="user">
      <Row gutter={12} justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
        <Col xs={24}>
          {userListingsElement}
        </Col>
        <Col xs={24}>
          {userBookingsElement}
        </Col>
      </Row>
    </Content>
  );
};

export default User;
