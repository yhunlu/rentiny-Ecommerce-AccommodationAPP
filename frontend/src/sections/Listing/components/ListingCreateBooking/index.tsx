import { Button, Card, DatePicker, Divider, Typography } from 'antd';
import React from 'react';
import { displayErrorMessage, formatListingPrice } from '../../../../lib/utils';
import moment, { Moment } from 'moment';
import { Viewer } from './../../../../lib/types';
interface Props {
  viewer: Viewer;
  price: number;
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setCheckOutDate: (checkOutDate: Moment | null) => void;
}

const { Paragraph, Title, Text } = Typography;

const ListingCreateBooking = ({
  viewer,
  price,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
}: Props) => {
  const disabledDate = (currentDate?: Moment) => {
    if (currentDate) {
      const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf('day'));
      return dateIsBeforeEndOfDay;
    } else {
      return false;
    }
  };

  const verifyAndSetCheckOutDate = (selectedCheckOutDate: Moment | null) => {
    if (checkInDate && selectedCheckOutDate) {
      if (moment(selectedCheckOutDate).isBefore(checkInDate, 'days')) {
        return displayErrorMessage(
          'Check-out date must be after check-in date'
        );
      }
    }

    setCheckOutDate(selectedCheckOutDate);
  };

  const checkInInputDisabled = !viewer.id;
  const checkOutInputDisabled = checkInInputDisabled || !checkInDate;
  const buttonDisabled = checkOutInputDisabled || !checkInDate || !checkOutDate;

  let buttonMessage = "You won't be charged yet.";
  if (!viewer.id) {
    buttonMessage = "You have to be signed in to book a listing!";
  }

  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">
        <div>
          <Paragraph>
            <Title level={2} className="listing-booking__card-title">
              {formatListingPrice(price)}
              <span>/day</span>
            </Title>
          </Paragraph>
          <Divider />
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check In</Paragraph>
            <DatePicker
              value={checkInDate ? checkInDate : undefined}
              format={'YYYY/MM/DD'}
              showToday={false}
              disabled={checkInInputDisabled}
              disabledDate={disabledDate}
              onChange={dataValue => setCheckInDate(dataValue)}
              onOpenChange={() => setCheckOutDate(null)}
            />
          </div>
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check Out</Paragraph>
            <DatePicker
              value={checkOutDate ? checkOutDate : undefined}
              format={'YYYY/MM/DD'}
              showToday={false}
              disabled={checkOutInputDisabled}
              disabledDate={disabledDate}
              onChange={dataValue => verifyAndSetCheckOutDate(dataValue)}
            />
          </div>
        </div>
        <Divider />
        <Button
          disabled={buttonDisabled}
          size="large"
          type="primary"
          className="listing-booking__card-cta"
        >
          Request to book!
        </Button>
        <Text type="secondary" mark>{buttonMessage}</Text>
      </Card>
    </div>
  );
};

export default ListingCreateBooking;
