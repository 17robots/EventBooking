import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import AuthContext from './context/auth-context'

import './App.css';

import AuthPage from './pages/Auth'
import EventPage from './pages/Events'
import BookingPage from './pages/Bookings'
import MainNavigation from './components/Navigation/MainNavigation'

class App extends React.Component {

  state = {
    token: null,
    userId: null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({token: token, userId: userId})
  }

  logout = () => {}

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{token: this.state.token, userId: this.state.userId, login: this.login, logout: this.logout}}>
            <MainNavigation/>
            <main className="main-content">
              <Switch>
                <Redirect from="/" to="/auth" exact />
                <Route path="/auth" component={AuthPage} />
                <Route path="/events" component={EventPage} />
                <Route path="/bookings" component={BookingPage} />
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
