import React from 'react'
import { Layout } from 'antd'
import { HomeHero } from './components'
import mapBackground from "./assets/map-background.jpg";
import { useNavigate } from 'react-router-dom';
import { displayErrorMessage } from '../../lib/utils';

const { Content } = Layout;

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
    <Content className="home" style={{ backgroundImage: `url(${mapBackground})`}}>
      <HomeHero onSearch={onSearch} />
    </Content>
  )
}

export default Home