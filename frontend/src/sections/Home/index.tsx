import React from 'react'
import { Layout } from 'antd'
import { HomeHero } from './components'
import mapBackground from "./assets/map-background.jpg";

type Props = {}

const { Content } = Layout;

const Home = (props: Props) => {
  return (
    <Content className="home" style={{ backgroundImage: `url(${mapBackground})`}}>
      <HomeHero />
    </Content>
  )
}

export default Home