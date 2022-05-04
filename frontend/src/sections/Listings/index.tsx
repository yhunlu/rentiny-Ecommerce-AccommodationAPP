import { useQuery } from '@apollo/client'
import { Layout, List } from 'antd'
import { ListingCard } from '../../lib/components'
import { ListingsFilter } from '../../lib/graphql/globalTypes';
import { LISTINGS } from '../../lib/graphql/queries'
import { Listings as ListingsData, ListingsVariables } from './../../lib/graphql/queries/Listings/__generated__/Listings';

interface Props {

}

const { Content } = Layout;

const PAGE_LIMIT = 8;

const Listings = (props: Props) => {
  const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
    variables: {
      filter: ListingsFilter.PRICE_LOW_TO_HIGH,
      limit: PAGE_LIMIT,
      page: 1,
    },
  });

  const listings = data ? data.listings : null;

  const listingSectionElement = listings ? (
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
  ) : null;

  return (
    <Content className="listings">{listingSectionElement}</Content>
  )
}

export default Listings