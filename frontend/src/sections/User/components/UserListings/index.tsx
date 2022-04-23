import { List, Typography } from 'antd';
import React from 'react';
import { ListingCard } from '../../../../lib/components';
import { User_user_listings } from './../../../../lib/graphql/queries/User/__generated__/User';

interface Props {
  userListings: User_user_listings;
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
  const { total, result } = userListings;

  const userListingsList = (
    <List
      grid={{
        gutter: 8,
        xs: 1,
        sm: 2,
        lg: 4,
      }}
      dataSource={result}
      locale={{ emptyText: "User doesn't have any listings yet!" }}
      pagination={{
        position: 'top',
        current: page,
        total,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page: number) => setListingsPage(page),
      }}
      renderItem={(userlisting) => (
        <List.Item>
          <ListingCard listing={userlisting} />
        </List.Item>
      )}
    />
  );

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
