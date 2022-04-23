import { Card, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React from 'react';
import { formatListingPrice, iconColor } from '../../utils';
import { Link } from 'react-router-dom';

interface Props {
  listing: {
    id: string;
    title: string;
    image: string;
    address: string;
    price: number;
    numOfGuests: number;
  };
}

const { Text, Title } = Typography;

const ListingCard = ({ listing }: Props) => {
  const { id, title, image, address, price, numOfGuests } = listing;

  return (
    <Link to={`/listing/${id}`}>
      <Card
        hoverable
        cover={
          <div
            className="listing-card__cover-img"
            style={{ backgroundImage: `url(${image})` }}
          />
        }
      >
        <div className="listing-card__details">
          <div className="listing-card__description">
            <Title level={3} className="listing-card__price">
              {formatListingPrice(price)}
              <span>/day</span>
            </Title>
            <Text strong ellipsis className="listing-card__title">
              {title}
            </Text>
            <Text ellipsis className="listing-card__address">
              {address}
            </Text>
          </div>
          <div className="listing-card__dimensions listing-card__dimensions--guests">
            <UserOutlined style={{ color: iconColor }} />
            <Text>{numOfGuests} guests</Text>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ListingCard;
