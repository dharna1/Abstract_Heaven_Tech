import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h1 className="display-1">404</h1>
          <h2>Oops! Page not found</h2>
          <p className="text-muted">
            {error?.statusText || error?.message || "The page you're looking for doesn't exist."}
          </p>
          <Link to="/" className="btn btn-primary">
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
