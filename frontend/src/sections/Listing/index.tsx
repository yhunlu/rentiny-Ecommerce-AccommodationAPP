import React, { useState } from 'react';
import { LISTING } from '../../lib/graphql/queries';
import { useQuery } from '@apollo/client';
import {
  Listing as ListingData,
  ListingVariables,
} from './../../lib/graphql/queries/Listing/__generated__/Listing';
import { useParams } from 'react-router';
import { Col, Layout, Row } from 'antd';
import { ErrorBanner, PageSkeleton } from '../../lib/components';
import { ListingDetails } from './components';

const PAGE_LIMIT = 3;
const { Content } = Layout;

const Listing = () => {
  const [bookingPage, setBookingPage] = useState(1);
  const { listingId } = useParams();
  const { data, loading, error } = useQuery<ListingData, ListingVariables>(
    LISTING,
    {
      variables: {
        id: listingId ?? '',
        bookingsPage: bookingPage,
        limit: PAGE_LIMIT,
      },
    }
  );

  if (loading) {
    return (
      <Content className="listing">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listing">
        <ErrorBanner description="This listing may not exist or we've encountered an error. Please try again soon." />
        <PageSkeleton />
      </Content>
    );
  }

  const listing = data ? data.listing : null;
  const listingBookings = listing ? listing.bookings : null;

  const listingDetailsElement = listing ? (
    <ListingDetails listing={listing} />
  ) : null;

  return (
    <Content className="listing">
      <Row gutter={24} justify="space-between">
        <Col xs={24} md={14}>
          {listingDetailsElement}
        </Col>
      </Row>
    </Content>
  );
};

export default Listing;
