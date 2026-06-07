import {
  useEffect,
  useState
} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    require(
      "leaflet/dist/images/marker-icon-2x.png"
    ),

  iconUrl:
    require(
      "leaflet/dist/images/marker-icon.png"
    ),

  shadowUrl:
    require(
      "leaflet/dist/images/marker-shadow.png"
    )

});

function LiveTracking() {

  const [users,
    setUsers] =
    useState([]);

  useEffect(() => {

    fetch(
      "http://16.171.152.82:8000/latest-tracking"
    )
      .then((res) =>
        res.json()
      )
      .then((data) => {

        setUsers(data);

      })
      .catch((err) => {

        console.log(
          "TRACKING ERROR:",
          err
        );

      });

    const ws =
      new WebSocket(
        "ws://16.171.152.82:8000/ws/location"
      );

    ws.onopen = () => {

      console.log(
        "WS OPEN"
      );

    };

    ws.onmessage =
      (event) => {

        console.log(
          "LOCATION UPDATE:",
          event.data
        );

        const data =
          JSON.parse(
            event.data
          );

        setUsers(
          (prevUsers) => {

            const updatedUsers =
              [...prevUsers];

            const index =
              updatedUsers.findIndex(
                (user) =>
                  user.user_id ===
                  data.user_id
              );

            if (
              index !== -1
            ) {

              updatedUsers[index] = {

                ...updatedUsers[index],

                latitude:
                  data.latitude,

                longitude:
                  data.longitude,

                timestamp:
                  data.timestamp

              };

            } else {

              updatedUsers.push({

                user_id:
                  data.user_id,

                latitude:
                  data.latitude,

                longitude:
                  data.longitude,

                timestamp:
                  data.timestamp

              });

            }

            return updatedUsers;

          }
        );

      };

    ws.onerror =
      (error) => {

        console.log(
          "WS ERROR:",
          error
        );

      };

    ws.onclose = () => {

      console.log(
        "WS CLOSED"
      );

    };

    return () => {

      ws.close();

    };

  }, []);

  return (

    <div
      style={{
        height: "100vh",
        width: "100%"
      }}
    >

      <MapContainer
        center={[
          13.0827,
          80.2707
        ]}
        zoom={13}
        style={{
          height: "100%",
          width: "100%"
        }}
      >

        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {users.map(
          (user) => (

            <Marker
              key={
                user.user_id
              }
              position={[
                user.latitude,
                user.longitude
              ]}
            >

              <Popup>

                <div>

                  <h3>
                    User {
                      user.user_id
                    }
                  </h3>

                  <p>
                    Latitude:
                    {" "}
                    {
                      user.latitude
                    }
                  </p>

                  <p>
                    Longitude:
                    {" "}
                    {
                      user.longitude
                    }
                  </p>

                  <p>
                    Updated:
                    {" "}
                    {
                      user.timestamp
                    }
                  </p>

                </div>

              </Popup>

            </Marker>

          )
        )}

      </MapContainer>

    </div>

  );

}

export default LiveTracking;