import React from 'react';
import { Card, Col, Input, Row, Typography } from 'antd';

import torontoImage from '../../assets/toronto.jpg';
import dubaiImage from '../../assets/dubai.jpg';
import losAngelesImage from '../../assets/los-angeles.jpg';
import londonImage from '../../assets/london.jpg';
import { NavLink } from 'react-router-dom';

interface Props {
  onSearch: (value: string) => void;
};

const { Title } = Typography;
const { Search } = Input;

const HomeHero = ({ onSearch }: Props) => {
  return (
    <div className="home-hero">
      <div className="home-hero__search">
        <Title className="home-hero__title">
          Find a place you'll love to stay at
        </Title>
        <Search
          placeholder="Search city"
          enterButton
          size="large"
          className="home-hero__search-input"
          onSearch={onSearch}
        />
      </div>
      <Row gutter={12} className="home-hero__cards">
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <NavLink to="/listings/toronto">
            <Card cover={<img alt="Toronto" src={torontoImage} />}>
              Toronto
            </Card>
          </NavLink>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <NavLink to="/listings/dubai">
            <Card cover={<img alt="Dubai" src={dubaiImage} />}>Dubai</Card>
          </NavLink>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <NavLink to="/listings/los%20angeles">
            <Card cover={<img alt="Los Angeles" src={losAngelesImage} />}>
              Los Angeles
            </Card>
          </NavLink>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <NavLink to="/listings/london">
            <Card cover={<img alt="London" src={londonImage} />}>London</Card>
          </NavLink>
        </Col>
      </Row>
    </div>
  );
};

export default HomeHero;
