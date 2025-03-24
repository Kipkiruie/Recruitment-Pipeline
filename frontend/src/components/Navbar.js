import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onLogout, authToken }) => {
  return (
    <nav className="navbar">
      <div className="navbar-title">Recruitment Pipeline</div>
      <ul className="navbar-links">
        {authToken ? (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/analytics">Analytics</Link>
            </li>
            <li>
              <Link to="/notifications">Notifications</Link>
            </li>
            <li>
              <Link to="/user-management">User Management</Link>
            </li>
          </>
        ) : null}
      </ul>
      <div className="navbar-actions">
        {authToken ? (
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
