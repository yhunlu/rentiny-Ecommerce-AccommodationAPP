import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Host, Listing, Listings, NotFound, User } from './sections';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/host' element={<Host/>} />
        <Route path='/listing/:id' element={<Listing/>} />
        <Route path='/listings/:location' element={<Listings title="rentiny"/>} />
        <Route path='/user/:id' element={<User/>} />
        <Route path='/not-found' element={<NotFound/>} />
      </Routes>
    </Router>
  );
}

export default App;
