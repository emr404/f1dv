import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
/* import Home from "./components/Home"; */
import Nav from "./components/Navigation";
import Drivers from "./components/Drivers";
import Result from "./components/Result";
import Standings from "./components/Standings";
import Schedule from "./components/Schedule";
const App = () => {
  return (
    <div>
      <Router>
          <Nav />
          <Switch>
          <Route path='/' exact component={Result} />
            {/* <Route path='/' exact component={Home} /> */}
            <Route path='/Drivers' component={Drivers} />
            
            <Route path='/Standings' component={Standings} />
            <Route path='/Schedule' component={Schedule} />
          </Switch>
      </Router>
    </div>
  )
}

export default App

