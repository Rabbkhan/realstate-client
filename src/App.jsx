import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin'
import About from './pages/About';
import Profile from './pages/Profile'
import Signup from './pages/Signup'
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import Emailveriy from './pages/EmailVerify';
const App = () => {

 

  return (
    <Router>
            <Toaster />
      <Header/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/about' element={<About />} />
        <Route path='/listing/:listingId' element={<Listing />} />
        <Route path='/search' element={<Search />} />
        <Route path='emailverify' element={<Emailveriy/>}/>

        <Route element={<PrivateRoute />} >
        <Route path='/profile' element={<Profile />} />
        <Route path='/create-listing' element={<CreateListing />} />
        <Route path='/update-listing/:listingId' element={<UpdateListing />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;
