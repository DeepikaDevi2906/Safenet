import { useEffect, useState } from "react";

import StatCard from "../components/StatCard";
import AlertPanel from "../components/AlertPanel";
import IncidentTable from "../components/IncidentTable";

function Dashboard() {

  const [alerts, setAlerts] = useState([]);

  const [incidents, setIncidents] = useState([]);

  useEffect(() => {

    fetch(
      "http://13.48.182.195:8000/alerts"
    )
      .then((res) => {

        console.log(
          "STATUS:",
          res.status
        );

        return res.json();

      })
      .then((data) => {

        console.log(
          "ALERT DATA:",
          data
        );

        const sosIncidents =
          data.map((alert) => ({

            id: alert.id,

            user_id:
              alert.user_id,

            type: "SOS",

            location: {
              latitude:
                alert.latitude,

              longitude:
                alert.longitude,
            },

            severity:
              "High",

            status:
              alert.status,

            time:
              alert.created_at,

          }));

        console.log(
          "SOS INCIDENTS:",
          sosIncidents
        );

        setIncidents(
          sosIncidents
        );

        const dashboardAlerts =
          data.map((alert) => ({

            type: "SOS",

            message:
              `SOS Alert - User ${alert.user_id}`,

            time:
              alert.created_at,

          }));

        setAlerts(
          dashboardAlerts
        );

      })
      .catch((err) => {

        console.log(
          "FETCH ERROR:",
          err
        );

      });

  }, []);

  const violenceCount =
    incidents.filter(
      (i) => i.type === "Violence"
    ).length;

  const fireCount =
    incidents.filter(
      (i) => i.type === "Fire"
    ).length;

  const screamCount =
    incidents.filter(
      (i) => i.type === "Screaming"
    ).length;

  const crowdCount =
    incidents.filter(
      (i) => i.type === "Crowd"
    ).length;

  const sosCount =
    incidents.filter(
      (i) => i.type === "SOS"
    ).length;

  const activeIncidents =
    incidents.filter(
      (i) => i.status === "Active"
    ).length;

  return (

    <div className="dashboard">

      <h1 className="dashboard-title">
        SAFE NET Dashboard-CI/CD test
      </h1>

      <div className="cards-grid">

        <StatCard
          title="Violence Alerts"
          value={violenceCount}
          color="red"
        />

        <StatCard
          title="Fire Alerts"
          value={fireCount}
          color="orange"
        />

        <StatCard
          title="Scream Alerts"
          value={screamCount}
          color="purple"
        />

        <StatCard
          title="Crowd Alerts"
          value={crowdCount}
          color="yellow"
        />

        <StatCard
          title="SOS Alerts"
          value={sosCount}
          color="pink"
        />

      </div>

      <AlertPanel
        alerts={alerts}
      />

      <div className="system-status">

        <h2 className="system-status-title">
          System Status
        </h2>

        <div className="status-grid">

          <div className="status-item">
            🚨 Violence Detection
            <span className="status-online">
              Online
            </span>
          </div>

          <div className="status-item">
            🔥 Fire Detection
            <span className="status-online">
              Online
            </span>
          </div>

          <div className="status-item">
            🎤 Audio Detection
            <span className="status-online">
              Online
            </span>
          </div>

          <div className="status-item">
            👥 Crowd Detection
            <span className="status-online">
              Online
            </span>
          </div>

        </div>

      </div>

      <div className="active-incidents">

        <h2 className="active-title">
          Active Incidents
        </h2>

        <div className="active-count">
          {activeIncidents}
        </div>

      </div>

      <IncidentTable
        incidents={incidents}
      />

    </div>

  );
}

export default Dashboard;