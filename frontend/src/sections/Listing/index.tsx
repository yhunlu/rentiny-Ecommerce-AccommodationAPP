import React, { useState } from 'react';
import { Moment } from 'moment';
import { LISTING } from '../../lib/graphql/queries';
import { useQuery } from '@apollo/client';
import {
  Listing as ListingData,
  ListingVariables,
} from './../../lib/graphql/queries/Listing/__generated__/Listing';
import { useParams } from 'react-router';
import { Col, Layout, Row } from 'antd';
import { ErrorBanner, PageSkeleton } from '../../lib/components';
import {
  ListingBookings,
  ListingCreateBooking,
  ListingCreateBookingModal,
  ListingDetails,
} from './components';
import { Viewer } from '../../lib/types';

const PAGE_LIMIT = 3;
const { Content } = Layout;

interface Props {
  viewer: Viewer;
}

const Listing = ({ viewer }: Props) => {
  const [bookingPage, setBookingPage] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const listingBookingsElement = listingBookings ? (
    <ListingBookings
      listingBookings={listingBookings}
      page={bookingPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingPage}
    />
  ) : null;

  const listingCreateBookingElement = listing ? (
    <ListingCreateBooking
      viewer={viewer}
      host={listing.host}
      bookingsIndex={listing.bookingsIndex}
      price={listing.price}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      setCheckInDate={setCheckInDate}
      setCheckOutDate={setCheckOutDate}
      setModalVisible={setModalVisible}
    />
  ) : null;

  const listingCreateBookingModalElement = (
    <ListingCreateBookingModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
    />
  );

  return (
    <Content className="listing">
      <Row gutter={24} justify="space-between">
        <Col xs={24} lg={14}>
          {listingDetailsElement}
          {listingBookingsElement}
        </Col>
        <Col xs={24} lg={10}>
          {listingCreateBookingElement}
        </Col>
      </Row>
      {listingCreateBookingModalElement}
    </Content>
  );
};

export default Listing;
