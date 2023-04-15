import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login';

import Header from './components/Header';
import Home from './components/Home';
import { connect } from "react-redux";
import { getUserAuth } from "./redux/actions";
import { useEffect } from 'react';
import RequiredAuth from './components/RequiredAuth';


const App = (props) => {
  
  useEffect(() => {
    props.getUserAuth();
  }, []);

  return (

    <div className='app'>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/home' element={
            <RequiredAuth>
            <Header/>
            <Home />
            </RequiredAuth>

          } />

        </Routes>
      </Router>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (disptach) => {
  return {
    getUserAuth: () => disptach(getUserAuth()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);


{/* <Route path='home' element={<RequiredAuth/>}>
<Route path='/home' element={
  <>
  <Header/>
  <Home />
  </>
} />
</Route> */}