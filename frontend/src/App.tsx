import { Affix, Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Host, Listing, Listings, NotFound, User, Login, AppHeader } from './sections';
import { Viewer } from './lib/types';
import { useState } from 'react';

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false
}

type Props = {}

const App = (props: Props) => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  
  return (
    <Router>
      <Layout id="app" />
      <Affix offsetTop={0} className="app__affix-header">
        <AppHeader viewer={viewer} setViewer={setViewer} />
      </Affix>
      <Routes>
        <Route path="/login" element={<Login {...props} setViewer={setViewer} />} />
        <Route path="/" element={<Home />} />
        <Route path="/host" element={<Host />} />
        <Route path="/listing/:id" element={<Listing />} />
        <Route path="/listings/:location" element={<Listings />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/not-found" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;