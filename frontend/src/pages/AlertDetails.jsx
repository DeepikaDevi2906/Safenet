import { useLocation } from "react-router-dom";
import { useState } from "react";

function AlertDetails() {

  const { state } = useLocation();

  const [status, setStatus] = useState(
    state?.status || "Active"
  );

  if (!state) {

    return (
      <div className="page-container">
        <h1>🚨 Alert Not Found</h1>
      </div>
    );
  }

  const latitude =
    state.location?.latitude ||
    state.latitude ||
    "N/A";

  const longitude =
    state.location?.longitude ||
    state.longitude ||
    "N/A";

  const updateStatus = async (
    newStatus
  ) => {

    try {

      await fetch(
        `http://16.171.152.82:8000/alerts/${state.id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      setStatus(newStatus);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="alert-details-page">

      <h1 className="alert-title">
        🚨 Alert Details
      </h1>

      <div className="alert-card">

        <div className="detail-row">
          <span>ID</span>
          <span>{state.id}</span>
        </div>

        <div className="detail-row">
          <span>User ID</span>
          <span>{state.user_id}</span>
        </div>

        <div className="detail-row">
          <span>Type</span>
          <span>{state.type}</span>
        </div>

        <div className="detail-row">
          <span>Severity</span>
          <span className="severity-badge">
            {state.severity}
          </span>
        </div>

        <div className="detail-row">
          <span>Status</span>
          <span className="status-badge">
            {status}
          </span>
        </div>

        <div className="detail-row">
          <span>Time</span>
          <span>
            {state.time ||
             state.created_at ||
             "N/A"}
          </span>
        </div>

        <div className="detail-row">
          <span>Latitude</span>
          <span>{latitude}</span>
        </div>

        <div className="detail-row">
          <span>Longitude</span>
          <span>{longitude}</span>
        </div>

        <a
          className="map-btn"
          href={`https://maps.google.com/?q=${latitude},${longitude}`}
          target="_blank"
          rel="noreferrer"
        >
          📍 Open in Google Maps
        </a>

        <div className="action-buttons">

          <button
            className="investigate-btn"
            onClick={() =>
              updateStatus(
                "Investigating"
              )
            }
          >
            Investigating
          </button>

          <button
            className="resolve-btn"
            onClick={() =>
              updateStatus(
                "Resolved"
              )
            }
          >
            Resolved
          </button>

        </div>

      </div>

    </div>

  );
}

export default AlertDetails;