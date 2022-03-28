import { useApolloClient, useMutation } from '@apollo/client';
import { Card, Layout, Spin, Typography } from 'antd';
import React, { useEffect, useRef } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Viewer } from '../../lib/types';

import { AUTH_URL } from '../../lib/graphql/queries/AuthUrl';
import { AuthUrl as AuthUrlData } from './../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl';
import { LOG_IN, LOG_OUT } from '../../lib/graphql/mutations';
import {
  LogIn as LogInData,
  LogInVariables,
} from './../../lib/graphql/mutations/LogIn/__generated__/LogIn';
import { ErrorBanner } from '../../lib/components';
import {
  displayErrorMessage,
  displaySuccessNotification,
} from '../../lib/utils';
import { Navigate } from 'react-router-dom';


const { Content } = Layout;
const { Text, Title } = Typography;
interface Props {
  setViewer: (viewer: Viewer) => void;
}

const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();
  const [logIn, { data: logInData, loading: logInLoading, error: logInError }] =
    useMutation<LogInData, LogInVariables>(LOG_IN, {
      onCompleted: (data) => {
        if (data && data.logIn) {
          setViewer(data.logIn);
          displaySuccessNotification("You're now logged in!");
          if (data.logIn.token) {
            sessionStorage.setItem('token', data.logIn.token);
          }
        }
      },
    });

  const logInRef = useRef(logIn);
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL,
      });

      window.location.href = data.authUrl;
    } catch (error) {
      displayErrorMessage(
        "Sorry! We weren't able to log you in. Please try again later."
      );
    }
  };

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..." />
      </Content>
    );
  }

  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;
    // replace: avoid extra redirects after the user click back.
    return <Navigate to={`/user/${viewerId}`} replace />
  }

  const LogInErrorBannerElement = logInError ? (
    <ErrorBanner description="Sorry! We weren't able to log you in. Please try again later." />
  ) : null;

  return (
    <Content className="log-in">
      {LogInErrorBannerElement}
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
          <button
            className="log-in-card__google-button"
            onClick={handleAuthorize}
          >
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
