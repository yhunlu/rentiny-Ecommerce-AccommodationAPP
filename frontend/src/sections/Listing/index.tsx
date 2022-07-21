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
  
  // const listingBookings = {
  //   total: 4,
  //   result: [
  //     {
  //       id: '5daa530eefc64b001767247c',
  //       tenant: {
  //         id: '117422637055829818290',
  //         name: 'User X',
  //         avatar:
  //           'https://lh3.googleusercontent.com/a-/AAuE7mBL9NpzsFA6mGSC8xIIJfeK4oTeOJpYvL-gAyaB=s100',
  //         __typename: 'User',
  //       },
  //       checkIn: '2019-10-29',
  //       checkOut: '2019-10-31',
  //       __typename: 'Booking',
  //     },
  //     {
  //       id: '5daa530eefc64b001767247d',
  //       tenant: {
  //         id: '117422637055829818290',
  //         name: 'User X',
  //         avatar:
  //           'https://lh3.googleusercontent.com/a-/AAuE7mBL9NpzsFA6mGSC8xIIJfeK4oTeOJpYvL-gAyaB=s100',
  //         __typename: 'User',
  //       },
  //       checkIn: '2019-11-01',
  //       checkOut: '2019-11-03',
  //       __typename: 'Booking',
  //     },
  //     {
  //       id: '5daa530eefc64b001767247g',
  //       tenant: {
  //         id: '117422637055829818290',
  //         name: 'User X',
  //         avatar:
  //           'https://lh3.googleusercontent.com/a-/AAuE7mBL9NpzsFA6mGSC8xIIJfeK4oTeOJpYvL-gAyaB=s100',
  //         __typename: 'User',
  //       },
  //       checkIn: '2019-11-05',
  //       checkOut: '2019-11-09',
  //       __typename: 'Booking',
  //     },
  //     {
  //       id: '5daa530eefc64b001767247f',
  //       tenant: {
  //         id: '117422637055829818290',
  //         name: 'User X',
  //         avatar:
  //           'https://lh3.googleusercontent.com/a-/AAuE7mBL9NpzsFA6mGSC8xIIJfeK4oTeOJpYvL-gAyaB=s100',
  //         __typename: 'User',
  //       },
  //       checkIn: '2019-11-10',
  //       checkOut: '2019-11-11',
  //       __typename: 'Booking',
  //     },
  //   ],
  // } as any;

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
      price={listing.price}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      setCheckInDate={setCheckInDate}
      setCheckOutDate={setCheckOutDate}
    />
  ) : null;

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
    </Content>
  );
};

export default Listing;
