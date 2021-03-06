import React from 'react';
import { Col, Layout, Row, Typography } from 'antd';
import { HomeHero, HomeListings, HomeListingsSkeleton } from './components';
import { useNavigate } from 'react-router-dom';
import { displayErrorMessage } from '../../lib/utils';
import { Link } from 'react-router-dom';

import mapBackground from './assets/map-background.jpg';
import sanFransiscoImage from './assets/san-fransisco.jpg';
import cancunImage from './assets/cancun.jpg';

import { useQuery } from '@apollo/client';
import {
  Listings as ListingsData,
  ListingsVariables,
} from './../../lib/graphql/queries/Listings/__generated__/Listings';
import { ListingsFilter } from '../../lib/graphql/globalTypes';
import { LISTINGS } from '../../lib/graphql/queries';

const { Content } = Layout;
const { Paragraph, Title } = Typography;

const PAGE_LIMIT = 8;
const PAGE_NUMBER = 1;

const Home = () => {
  const { loading, data } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      variables: {
        filter: ListingsFilter.PRICE_HIGH_TO_LOW,
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
      },
    }
  );

  const navigate = useNavigate();

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      navigate(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage('Please enter a valid search term');
    }
  };

  const renderListingsSection = () => {
    if (loading) {
      return <HomeListingsSkeleton />;
    }

    if (data) {
      return (
        <HomeListings
          title="Premium Listings"
          listings={data.listings.result}
        />
      );
    }

    return null;
  };

  return (
    <Content
      className="home"
      style={{ backgroundImage: `url(${mapBackground})` }}
    >
      <HomeHero onSearch={onSearch} />

      <div className="home__cta-section">
        <Title level={2} className="home__cta-section-title">
          Your guide for all things rental
        </Title>
        <Paragraph>
          Helping you make the best decisions in renting your last minute
          locations.
        </Paragraph>
        <Link
          to="/listings/united%20states"
          className="ant-btn ant-btn-primary ant-btn-lg home__cta-section-button"
        >
          Popular listings in United States
        </Link>
      </div>

      {renderListingsSection()}

      <div className="home__listings">
        <Title level={4} className="home__listings-title">
          Listings in any kind
        </Title>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Link to="/listings/san%20fransisco">
              <div className="home__listings-img-cover">
                <img
                  alt="San Francisco"
                  src={sanFransiscoImage}
                  className="home__listings-img"
                />
              </div>
            </Link>
          </Col>
          <Col xs={24} sm={12}>
            <Link to="/listings/cancun">
              <div className="home__listings-img-cover">
                <img
                  alt="Cancun"
                  src={cancunImage}
                  className="home__listings-img"
                />
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </Content>
  );
};

export default Home;
