import { useLocation } from "react-router-dom";

function AlertDetails() {

  const { state } = useLocation();

  if (!state) {

    return (
      <h1>
        Alert Not Found
      </h1>
    );
  }

  return (

    <div className="alert-details">

      <h1>
        🚨 Alert Details
      </h1>

      <div className="details-card">

        <p>
          <strong>ID:</strong>
          {" "}
          {state.id}
        </p>

        <p>
          <strong>Type:</strong>
          {" "}
          {state.type}
        </p>

        <p>
          <strong>Severity:</strong>
          {" "}
          {state.severity}
        </p>

        <p>
          <strong>Status:</strong>
          {" "}
          {state.status}
        </p>

        <p>
          <strong>Time:</strong>
          {" "}
          {state.time}
        </p>

        <p>
          <strong>Latitude:</strong>
          {" "}
          {state.location.latitude}
        </p>

        <p>
          <strong>Longitude:</strong>
          {" "}
          {state.location.longitude}
        </p>

        <a
          href={`https://maps.google.com/?q=${state.location.latitude},${state.location.longitude}`}
          target="_blank"
          rel="noreferrer"
        >
          📍 Open in Google Maps
        </a>

      </div>

    </div>

  );
}

export default AlertDetails;