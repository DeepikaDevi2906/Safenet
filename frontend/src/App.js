import { BrowserRouter,
         Routes,
         Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import "./main.css";
import Dashboard from "./pages/Dashboard";
import SafeZones from "./pages/SafeZones";
import AlertDetails from "./pages/AlertDetails";
import LiveTracking from "./pages/LiveTracking";
import Heatmap from "./pages/Heatmap";
import Analytics from "./pages/Analytics";

function App() {

  return (

    <BrowserRouter>

      <MainLayout>

        <Routes>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/safezones"
            element={<SafeZones />}
          />

          <Route
            path="/alert/:id"
            element={<AlertDetails />}
          />

          <Route
            path="/tracking"
            element={
              <LiveTracking />
            }
          />
           <Route
            path="/heatmap"
            element={<Heatmap />}
          />

          <Route
           path="/analytics"
           element={<Analytics />}
          />

        </Routes>

      </MainLayout>

    </BrowserRouter>

  );
}

export default App;