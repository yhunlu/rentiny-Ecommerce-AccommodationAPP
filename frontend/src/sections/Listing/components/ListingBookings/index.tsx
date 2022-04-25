import { Avatar, Divider, List, Typography } from 'antd';
import React from 'react';
import { Listing } from './../../../../lib/graphql/queries/Listing/__generated__/Listing';

interface Props {
    listingBookings: Listing['listing']['bookings'];
    page: number;
    limit: number;
    setBookingsPage: (page: number) => void;
}

const { Text, Title } = Typography;

const ListingBookings = ({
    listingBookings,
    page,
    limit,
    setBookingsPage,
}: Props) => {
    const total = listingBookings ? listingBookings.total : null;
    const result = listingBookings ? listingBookings.result : null;

    const listingBookingsList =
        listingBookings ? (
            <List
                grid={{
                    gutter: 8,
                    xs: 1,
                    sm: 2,
                    lg: 3,
                }}
                dataSource={result ? result : undefined}
                locale={{ emptyText: "No bookings have been made yet!" }}
                pagination={{
                    current: page,
                    total: total ? total : undefined,
                    defaultPageSize: limit,
                    hideOnSinglePage: true,
                    showLessItems: true,
                    onChange: (page: number) => setBookingsPage(page),
                }}
                renderItem={(listingBooking) => {
                    const bookingHistory = (
                        <div className="listing-bookings__history">
                            <div>
                                Check in: <Text strong>{listingBooking.checkIn}</Text>
                            </div>
                            <div>
                                Check out: <Text strong>{listingBooking.checkOut}</Text>
                            </div>
                        </div>
                    );
                    return (
                        <List.Item className="listing-bookings__item">
                            {bookingHistory}
                            <Avatar src={listingBooking.tenant.avatar} size={64} shape="square" />
                        </List.Item>
                    );
                }}
            />
        ) : null;

    const listingBookingsElement = listingBookingsList ? (
        <div className="listing-bookings">
            <Divider />
            <div className="listing-bookings__section">
                <Title level={4}>
                    Bookings
                </Title>
            </div>
            {listingBookingsList}
        </div>
    ) : null;

    return listingBookingsElement;
};

export default ListingBookings;
