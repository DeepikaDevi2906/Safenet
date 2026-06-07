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
import Alerts from "./pages/Alerts";
import Users from "./pages/Users";

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

          <Route
           path="/alerts"
           element={<Alerts />}
          />

          <Route
  path="/users"
  element={<Users />}
/>

        </Routes>

      </MainLayout>

    </BrowserRouter>

  );
}

export default App;