import React, { Component } from 'react'
import { Router, Route, browserHistory } from 'react-router'

export default class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/' component={Home} />
        <Route path='/address' component={Address} />
      </Router>
    )
  }
}

const Home = () => <h1>Hello from Home!</h1>
const Address = () => <h1>We are located at 555 Jackson St.</h1>