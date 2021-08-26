import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { tokenContext } from '../../App';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { token } = useContext(tokenContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        token ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
      }
    ></Route>
  );
};

export default ProtectedRoute;
