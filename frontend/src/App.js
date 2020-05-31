import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import './App.css';

import AuthPage from './pages/Auth'
import EventPage from './pages/Events'
import BookingPage from './pages/Bookings'
import MainNavigation from './components/Navigation/MainNavigation'

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <MainNavigation/>
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={AuthPage} />
            <Route path="/events" component={EventPage} />
            <Route path="/bookings" component={BookingPage} />
          </Switch>
        </main>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
