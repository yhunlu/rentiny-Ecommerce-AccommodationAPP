import React from 'react'
import { List, Typography } from 'antd'
import { ListingCard } from '../../../../lib/components'
import { Listings } from './../../../../lib/graphql/queries/Listings/__generated__/Listings';

interface Props {
    listings: Listings['listings']['result'];
    title: string;
}

const { Title } = Typography;

const HomeListings = ({ title, listings }: Props) => {
  return (
    <div>
        <Title level={4} className="home-listings__title">
            {title}
        </Title>
        <List
            grid={{
                gutter: 8,
                xs: 1,
                sm: 2,
                lg: 4,
            }}
            dataSource={listings}
            renderItem={(listing) => (
                <List.Item>
                    <ListingCard listing={listing} />
                </List.Item>
            )}
        />
    </div>
  )
}

export default HomeListings