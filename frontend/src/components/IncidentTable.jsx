import { Link } from "react-router-dom";

function IncidentTable({ incidents }) {

  return (

    <div className="incident-table-container">

      <h1 className="table-title">
        Incident History
      </h1>

      <table className="incident-table">

        <thead>

          <tr>

            <th>Type</th>

            <th>Location</th>

            <th>Severity</th>

            <th>Status</th>

            <th>Time</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {

            incidents.map(
              (incident, index) => (

                <tr key={index}>

                  <td>
                    {incident.type}
                  </td>

                  <td>

                    {
                      typeof incident.location === "object"

                        ? `${incident.location.latitude},
                           ${incident.location.longitude}`

                        : incident.location
                    }

                  </td>

                  <td>

                    <span
                      className={`severity ${incident.severity.toLowerCase()}`}
                    >
                      {incident.severity}
                    </span>

                  </td>

                  <td>
                    {incident.status}
                  </td>

                  <td>
                    {incident.time}
                  </td>

                  <td>

                    <Link
                      to={`/alert/${incident.id}`}
                      state={incident}
                      className="details-btn"
                    >
                      View Details
                    </Link>

                  </td>

                </tr>

              )
            )

          }

        </tbody>

      </table>

    </div>

  );
}

export default IncidentTable;