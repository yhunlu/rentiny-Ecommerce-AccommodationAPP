import { Affix, Layout, Spin } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Home,
  Host,
  Listing,
  Listings,
  NotFound,
  User,
  Login,
  AppHeader,
  Stripe,
} from './sections';
import { Viewer } from './lib/types';
import { useEffect, useRef, useState } from 'react';
import { LOG_IN } from './lib/graphql/mutations';
import {
  LogIn as LogInData,
  LogInVariables,
} from './lib/graphql/mutations/LogIn/__generated__/LogIn';
import { useMutation } from '@apollo/client';
import { AppHeaderSkeleton, ErrorBanner } from './lib/components';

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);
        if (data.logIn.token) {
          sessionStorage.setItem('token', data.logIn.token);
        } else {
          sessionStorage.removeItem('token');
        }
      }
    },
  });

  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching Rentiny..." />
        </div>
      </Layout>
    );
  }

  const logInErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later." />
  ) : null;

  return (
    <Router>
      <Layout id="app">
        {logInErrorBannerElement}
        <Affix offsetTop={0} className="app__affix-header">
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Routes>
          <Route path="/login" element={<Login setViewer={setViewer} />} />
          <Route
            path="/stripe"
            element={<Stripe viewer={viewer} setViewer={setViewer} />}
          />
          <Route path="/" element={<Home />} />
          <Route path="/host" element={<Host viewer={viewer} />} />
          <Route path="/listing/:listingId" element={<Listing viewer={viewer} />} />
          <Route
            path="/listings"
            element={<Listings title="Rentiny Listings" />}
          >
            <Route
              path="/listings/:location"
              element={<Listings title="Rentiny Listings" />}
            />
          </Route>
          <Route path="/user/:userId" element={<User viewer={viewer} setViewer={setViewer} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
