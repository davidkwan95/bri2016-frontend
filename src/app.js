import React, { Component } from 'react'
import { Router, Route, browserHistory } from 'react-router'
import Transaksi from './Transaksi'

export default class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/' component={Home} />
        <Route path='/transaksi' component={Transaksi} />
      </Router>
    )
  }
}

const Home = () => <h1>Hello from Home!</h1>
