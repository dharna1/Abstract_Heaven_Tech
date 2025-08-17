import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Header */}
      <header style={{ backgroundColor: '#0d6efd', color: 'white', padding: '1rem 0' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="h4 mb-0">
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                  Team Collaboration Tool
                </Link>
              </h1>
            </div>
            <div className="col-md-6 text-end">
              {user ? (
                <div className="d-flex align-items-center justify-content-end gap-3">
                  <span>Welcome, {user.name}</span>
                  <Link to="/dashboard" className="btn btn-outline-light btn-sm">
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-outline-light btn-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-outline-light btn-sm">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-light btn-sm">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ minHeight: 'calc(100vh - 120px)' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#f8f9fa', padding: '2rem 0', marginTop: 'auto' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>Team Collaboration Tool</h5>
              <p className="text-muted">
                Manage tasks, collaborate with your team, and stay organized.
              </p>
            </div>
            <div className="col-md-3">
              <h6>Quick Links</h6>
              <ul className="list-unstyled">
                <li><Link to="/dashboard" className="text-decoration-none">Dashboard</Link></li>
                <li><Link to="/login" className="text-decoration-none">Login</Link></li>
                <li><Link to="/register" className="text-decoration-none">Register</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6>Support</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-decoration-none">Help Center</a></li>
                <li><a href="#" className="text-decoration-none">Contact Us</a></li>
                <li><a href="#" className="text-decoration-none">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12 text-center">
              <p className="text-muted mb-0">
                © 2025 Team Collaboration Tool. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AppLayout;
