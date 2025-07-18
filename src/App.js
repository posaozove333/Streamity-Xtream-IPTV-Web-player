import React, {useState} from "react"
import {HashRouter as Router, Route,Switch} from "react-router-dom"
import {PrivateRoute,ProvideAuth} from "./other/auth"
import "./App.css"

import NavBar from "./components/NavBar"
import MainMenu from "./components/MainMenu/MainMenu"
import AccountInfo from "./components/AccountInfo"
import Login from "./components/Login"

import LateralBar from "./components/LateralBar/LateralBar"

import MainLive from "./components/Live/MainLive"
import Groups from "./components/Group/Groups"
import Search from "./components/Search/Search"
import EpgFullListing from "./components/Epg-Fullscreen/EpgFullListing"

import MainVod from "./components/Vod/MainVod"

import {useDispatch} from "react-redux"
import {setTimer60} from "./actions/timer60"
import {setTimer5} from "./actions/timer5"


function App() {
  const dispatch = useDispatch()
  
  // Only set up timers once
  React.useEffect(() => {
    const timer60 = setInterval(() => dispatch(setTimer60()), 50000);
    const timer5 = setInterval(() => dispatch(setTimer5()), 5000);
    
    return () => {
      clearInterval(timer60);
      clearInterval(timer5);
    };
  }, [dispatch]);


  if(window.location.protocol !== 'https:' && window.https===true)
    window.location = window.location.href.replace("http","https");
  else if(window.location.protocol === 'https:'  && window.https===false)
    window.location = window.location.href.replace("https","http");

  let url = window.location.hash.replace("#","");

  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <Route>
            <Route path="/:playingMode/">
              <NavBar />
              <LateralBar/>
            </Route>
            <PrivateRoute exact path = "/">
              <MainMenu/>
            </PrivateRoute>

            <Switch>
              <Route exact path="/:playingMode/category/"><Groups/></Route>
              <Route exact path="/:playingMode/category/:category/"></Route>
            </Switch>

            <Switch>
              <Route exact path="/:playingMode/category/:category/search/"><Search/></Route>
              <Route exact path="/:playingMode/search/"><Search/></Route>
            </Switch>
            <Switch>
              <Route exact path="/live/category/:category/tvguide/"><EpgFullListing/></Route>
              <Route exact path="/live/category/:category/tvguide/:date"><EpgFullListing/></Route>
            </Switch>

            <Switch>
              <Route path="/login/"><Login url={url}/></Route>
              <Route exact path = "/"><MainMenu/></Route>
              <Route path = "/live/category/:category"><MainLive/></Route>
              <Route path = "/live/"><MainLive/></Route>
              <Route path = "/:playingMode/category/:category"><MainVod/></Route>
              <Route path = "/:playingMode/"><MainVod/></Route>
            </Switch>
          </Route>
        </Switch>
      </Router>
    </ProvideAuth>
  );
}

export default App;


