import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Loader from '../pages/Loader/Loader';
import Login from '../pages/FanProfile/NotLoggedIn';

const PrivateRoute = ({ component: Component, ...rest }) => {
    console.log()
    return (
        <Fragment>
            {isLoading ? <Loader /> : (
                <Route
                    {...rest} render={props => !signedIn && !isLoading ? (
                        // <Login />
                        <Redirect to='/login' />
                    ) : (
                        <Component {...props} />
                    )}
                />
            )
            }
        </Fragment>
    );
}

export default PrivateRoute;
