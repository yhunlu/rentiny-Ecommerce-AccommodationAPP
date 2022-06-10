import { Layout, Typography } from 'antd'
import React from 'react'

const { Content } = Layout;
const { Title, Text } = Typography;

type Props = {}

const Host = (props: Props) => {
  return (
    <Content className="host-content">
      <div className="host__form-header">
        <Title level={3} className="host__form-title">
          Hi! Let's get started listing your place.
        </Title>
        <Text type="secondary">
          In this form, we'll collect some basic and additionl information about your listing.
        </Text>
      </div>
    </Content>
  )
}

export default Host