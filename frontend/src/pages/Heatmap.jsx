import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup
} from "react-leaflet";

function Heatmap() {

  const [points, setPoints] =
    useState([]);

  useEffect(() => {

    fetch(
      "http://16.171.152.82:8000/heatmap"
    )
      .then((res) =>
        res.json()
      )
      .then((data) => {

        console.log(
          "HEATMAP DATA:",
          data
        );

        setPoints(data);

      })
      .catch((err) => {

        console.log(
          "Heatmap Error:",
          err
        );

      });

  }, []);

  return (

    <div
      style={{
        padding: "30px"
      }}
    >

      <h1
        style={{
          marginBottom: "20px"
        }}
      >
        🔥 SAFENET Heatmap
      </h1>

      <MapContainer
        center={[
          points[0]?.latitude || 13.0326,
          points[0]?.longitude || 80.1546
        ]}
        zoom={13}
        style={{
          height: "700px",
          width: "100%",
          borderRadius: "20px"
        }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {

          points.map(
            (
              point,
              index
            ) => (

              <CircleMarker
                key={index}
                center={[
                  Number(
                    point.latitude
                  ),
                  Number(
                    point.longitude
                  )
                ]}
                radius={12}
                pathOptions={{
                  color: "red",
                  fillColor: "red",
                  fillOpacity: 0.7
                }}
              >

                <Popup>

                  <div>

                    <h3>
                      🚨 Alert Location
                    </h3>

                    <p>
                      Latitude:
                      {" "}
                      {
                        point.latitude
                      }
                    </p>

                    <p>
                      Longitude:
                      {" "}
                      {
                        point.longitude
                      }
                    </p>

                  </div>

                </Popup>

              </CircleMarker>

            )
          )

        }

      </MapContainer>

    </div>

  );
}

export default Heatmap;