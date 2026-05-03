// HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  return (
    <div className="container text-center py-5">
      <h1 className="display-4 text-primary mb-4">Welcome to SAFENET 🛡️</h1>
      <p className="lead mb-5">
        A real-time dashboard for monitoring alerts, safety events, and hotspot intelligence.
      </p>

      <div className="d-flex justify-content-center flex-wrap gap-3">
        <Link to="/live" className="btn btn-primary btn-lg shadow">
          🚨 Live Alerts
        </Link>
        <Link to="/map" className="btn btn-success btn-lg shadow">
          🗺️ Hotspot Map
        </Link>
        <Link to="/alerts" className="btn btn-warning btn-lg text-white shadow">
          📜 Alert History
        </Link>
      </div>

      <footer className="mt-5 text-muted">
        <small>Powered by SAFENET | Stay Safe, Stay Aware</small>
      </footer>
    </div>
  );
};

export default HomePage;
