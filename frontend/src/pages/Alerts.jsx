import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Alerts() {

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {

    try {

      const response = await fetch(
        "http://16.171.152.82:8000/alerts"
      );

      const data = await response.json();

      console.log("ALERT DATA:", data);

      setAlerts(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const getSeverityClass = (severity) => {

    if (!severity)
      return "severity-low";

    severity = severity.toLowerCase();

    if (severity === "high")
      return "severity-high";

    if (severity === "medium")
      return "severity-medium";

    return "severity-low";
  };

  if (loading) {

    return (
      <div className="page-container">
        <h2>Loading Alerts...</h2>
      </div>
    );
  }

  return (

    <div className="page-container">

      <div className="page-header">

        <h1>
          🚨 Alert Management
        </h1>

        <p>
          Monitor and respond to incidents
        </p>

      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <h2>{alerts.length}</h2>
          <p>Total Alerts</p>
        </div>

        <div className="stat-card">
          <h2>
            {
              alerts.filter(
                a =>
                  a.status === "Active"
              ).length
            }
          </h2>
          <p>Active Alerts</p>
        </div>

        <div className="stat-card">
          <h2>
            {
              alerts.filter(
                a =>
                  a.severity === "High"
              ).length
            }
          </h2>
          <p>High Severity</p>
        </div>

      </div>

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>ID</th>
              <th>User</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {
              alerts.map(
                (alert) => (

                  <tr
                    key={alert.id}
                  >

                    <td>
                      {alert.id}
                    </td>

                    <td>
                      {alert.user_id}
                    </td>

                    <td>
                      {alert.type}
                    </td>

                    <td>

                      <span
                        className={
                          getSeverityClass(
                            alert.severity
                          )
                        }
                      >
                        {
                          alert.severity
                        }
                      </span>

                    </td>

                    <td>
                      {
                        alert.status
                      }
                    </td>

                    <td>

                      <button
                        className="view-btn"
                        onClick={() =>
                          navigate(
                            `/alert/${alert.id}`,
                            {
                              state: alert
                            }
                          )
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>

                )
              )
            }

          </tbody>

        </table>

      </div>

    </div>

  );
}

export default Alerts;