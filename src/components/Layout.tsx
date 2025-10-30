import React from "react";
import graduation from "../assets/images/froggygraduation.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/layout.css";

const Layout = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      {/* Navbar */}
      <header>
        <nav className="navbar navbar-expand-lg  navbar-dark px-5 py-3">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <img src={graduation} width={80} height={80} alt="Logo" />
            <span className="extraBold font-size-30">NoteZilla</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/summery">
                      Your Summaries
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <ul className="navbar-nav">
              {isAuthenticated ? (
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item me-2">
                    <Link
                      className="btn button-auth primary-bck bold py-2 px-4"
                      to="/login"
                    >
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="btn button-auth dark-bck color-primary bold py-2 px-4"
                      to="/register"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="container cont">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-center py-4 border-top">
      </footer>
    </div>
  );
};

export default Layout;
