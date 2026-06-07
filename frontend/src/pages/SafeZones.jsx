import { useEffect, useState } from "react";

function SafeZones() {

  const [zones, setZones] =
    useState([]);

  const [name, setName] =
    useState("");

  const [type, setType] =
    useState("");

  const [latitude, setLatitude] =
    useState("");

  const [longitude, setLongitude] =
    useState("");

  const loadZones = () => {

    fetch(
      "http://10.232.31.135:8000/safezones"
    )
      .then((res) =>
        res.json()
      )
      .then((data) => {

        setZones(data);

      })
      .catch((err) => {

        console.log(err);

      });

  };

  useEffect(() => {

    loadZones();

  }, []);

  const addZone = async () => {

    try {

      const response =
        await fetch(
          "http://10.232.31.135:8000/safezones",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name,
              type,
              latitude:
                parseFloat(latitude),
              longitude:
                parseFloat(longitude),
            }),
          }
        );

      const data =
        await response.json();

      console.log(data);

      setName("");
      setType("");
      setLatitude("");
      setLongitude("");

      loadZones();

    } catch (error) {

      console.log(error);

    }

  };

  const deleteZone =
    async (id) => {

      try {

        await fetch(
          `http://10.232.31.135:8000/safezones/${id}`,
          {
            method:
              "DELETE",
          }
        );

        loadZones();

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <div className="safezones-page">

      <h1>
        Safe Zones
      </h1>

      <div className="safezone-form">

        <input
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <input
          placeholder="Type"
          value={type}
          onChange={(e) =>
            setType(
              e.target.value
            )
          }
        />

        <input
          placeholder="Latitude"
          value={latitude}
          onChange={(e) =>
            setLatitude(
              e.target.value
            )
          }
        />

        <input
          placeholder="Longitude"
          value={longitude}
          onChange={(e) =>
            setLongitude(
              e.target.value
            )
          }
        />

        <button
          onClick={addZone}
        >
          Add Zone
        </button>

      </div>

      <table
        className="incident-table"
      >

        <thead>

          <tr>

            <th>Name</th>

            <th>Type</th>

            <th>Latitude</th>

            <th>Longitude</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {zones.map(
            (zone) => (

              <tr
                key={zone.id}
              >

                <td>
                  {zone.name}
                </td>

                <td>
                  {zone.type}
                </td>

                <td>
                  {zone.latitude}
                </td>

                <td>
                  {zone.longitude}
                </td>

                <td>

                  <button
                    onClick={() =>
                      deleteZone(
                        zone.id
                      )
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  );
}

export default SafeZones;