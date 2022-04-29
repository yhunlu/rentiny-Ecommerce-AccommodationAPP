import React from 'react'
import { Layout, Typography } from 'antd'
import { HomeHero } from './components'
import mapBackground from "./assets/map-background.jpg";
import { useNavigate } from 'react-router-dom';
import { displayErrorMessage } from '../../lib/utils';
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { Paragraph, Title } = Typography;

const Home = () => {
  const navigate = useNavigate();

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      navigate(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage("Please enter a valid search term");
    }
  }

  return (
    <Content className="home" style={{ backgroundImage: `url(${mapBackground})` }}>
      <HomeHero onSearch={onSearch} />

      <div className="home__cta-section">
        <Title level={2} className="home__cta-section-title">
          Your guide for all things rental
        </Title>
        <Paragraph>
          Helping you make the best decisions in renting your last minute locations.
        </Paragraph>
        <Link to="/listings/united%20states" className="ant-btn ant-btn-primary ant-btn-lg home__cta-section-button">
          Popular listings in United States
        </Link>
      </div>
    </Content>
  )
}

export default Home