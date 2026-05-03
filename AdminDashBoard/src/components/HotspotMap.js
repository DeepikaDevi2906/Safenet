import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import HeatmapLayer from "react-leaflet-heatmap-layer";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

export default function HotspotMap() {
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/hotspots") // Flask API
      .then((res) => res.json())
      .then((data) => setHotspots(data))
      .catch((err) => console.error(err));
  }, []);

  // Convert hotspot data to [lat, lng, intensity]
  const points = hotspots.map((spot, idx) => {
    // In real data, use actual lat/lng from DB
    // Here I’m just offsetting Chennai coords for demo
    return [12.9165 + idx * 0.01, 80.2270 + idx * 0.01, spot.count];
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Safety Hotspots</h2>

      <MapContainer
        center={[12.9165, 80.2270]} // Default Chennai
        zoom={12}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatmapLayer
          fitBoundsOnLoad
          fitBoundsOnUpdate
          points={points}
          longitudeExtractor={(m) => m[1]}
          latitudeExtractor={(m) => m[0]}
          intensityExtractor={(m) => m[2]}
          radius={30} // adjust for density
          blur={20}
          max={10} // normalize intensity
        />
      </MapContainer>

      <Link to="/" className="btn btn-outline-primary mt-3">
        ⬅ Back to Home
      </Link>
    </div>
  );
}
