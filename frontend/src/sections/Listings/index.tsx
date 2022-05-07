import { useQuery } from '@apollo/client';
import { Layout, List, Typography } from 'antd';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ListingCard } from '../../lib/components';
import { ListingsFilter } from '../../lib/graphql/globalTypes';
import { LISTINGS } from '../../lib/graphql/queries';
import {
  Listings as ListingsData,
  ListingsVariables,
} from './../../lib/graphql/queries/Listings/__generated__/Listings';
import { ListingsFilters } from './components';

interface Props {
  title: string;
}

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const PAGE_LIMIT = 8;

const Listings = ({ title }: Props) => {
  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(1);

  const { location } = useParams();
  const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      variables: {
        location: location ?? null,
        filter,
        limit: PAGE_LIMIT,
        page,
      },
    }
  );

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const listingSectionElement =
    listings && listings.result.length ? (
      <div>
        <ListingsFilters filter={filter} setFilter={setFilter} />
        <List
          grid={{
            gutter: 8,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
          }}
          dataSource={listings.result}
          renderItem={(listing) => (
            <List.Item>
              <ListingCard listing={listing} />
            </List.Item>
          )}
        />
      </div>
    ) : (
      <div>
        <Paragraph>
          It appears that no listings have been created in this area{' '}
          <Text mark>"{listingsRegion}"</Text> yet.
        </Paragraph>
        <Paragraph>
          Be the first person to create a{' '}
          <Link to="/host">listing in this area</Link>!
        </Paragraph>
      </div>
    );

  const listingsRegionElement = listingsRegion ? (
    <Title level={3} className="listings__title">
      Results for "{listingsRegion}"
    </Title>
  ) : null;

  return (
    <Content className="listings">
      {listingsRegionElement}
      {listingSectionElement}
    </Content>
  );
};

export default Listings;
