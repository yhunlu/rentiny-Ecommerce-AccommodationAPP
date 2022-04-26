import { List, Typography } from 'antd';
import React from 'react';
import { ListingCard } from '../../../../lib/components';
import { User } from './../../../../lib/graphql/queries/User/__generated__/User';

interface Props {
  userListings: User['user']['listings'];
  page: number;
  limit: number;
  setListingsPage: (page: number) => void;
}

const { Paragraph, Title } = Typography;

const UserListings = ({
  userListings,
  page,
  limit,
  setListingsPage,
}: Props) => {
  const total = userListings ? userListings.total : null;
  const result = userListings ? userListings.result : null;

  const userListingsList = userListings ? (
    <List
      grid={{
        gutter: 8,
        xs: 1,
        sm: 2,
        lg: 3,
      }}
      dataSource={result ? result : undefined}
      locale={{ emptyText: "User doesn't have any listings yet!" }}
      pagination={{
        position: 'top',
        current: page,
        total: total ? total : undefined,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page: number) => setListingsPage(page),
      }}
      renderItem={(userListing) => (
        <List.Item>
          <ListingCard listing={userListing} />
        </List.Item>
      )}
    />
  ) : null;

  return (
    <div className="user-listings">
      <Title level={4} className="user-listings__title">
        Listings
      </Title>
      <Paragraph className="user-listings__description">
        This section highlights the listings this user currently hosts and has
        made available for bookings.
      </Paragraph>
      {userListingsList}
    </div>
  );
};

export default UserListings;
