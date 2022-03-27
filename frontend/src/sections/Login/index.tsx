import { Card, Layout, Typography } from 'antd';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';

type Props = {};

const { Content } = Layout;
const { Text, Title } = Typography;

const Login = (props: Props) => {
  return (
    <Content className="log-in">
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave"></span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to Rentiny
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
        </div>
        <div className="log-in-card__button">
          <FcGoogle className="log-in-card__google-button-logo" />
          <button className="log-in-card__google-button">
            <span className="log-in-card__google-button-text">
              Sign in with Google
            </span>
          </button>
          <Text type="secondary">
            Note: by signing in, you'll be redirected to the Google consent form
            to sign in with your Google account.
          </Text>
        </div>
      </Card>
    </Content>
  );
};

export default Login;
