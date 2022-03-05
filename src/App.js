// eslint-disable-next-line
import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

// import NotFound from './components/pages/NotFound/NotFound';
//import ProductDetails from './components/pages/Marketplace/ProductDetails';
import Connect from "./components/pages/BotChallenge/Connect";

// import Loader from "./components/pages/Loader/Loader";

export default function App() {


    return (
        <Router>
            <div style={{minHeight: '100vh'}}>
                <Switch>
                    <Route path="/" exact component={Connect} />
                    <Redirect to="/404" />
                </Switch>
            </div>
        </Router>

    );
}
