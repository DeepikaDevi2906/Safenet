import {
  FaHome,
  FaVideo,
  FaExclamationTriangle,
  FaChartBar,
  FaUsers,
  FaMapMarkerAlt,
  FaLocationArrow,
  FaFire
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Sidebar() {

  const menuItems = [

    {
      icon: <FaHome />,
      label: "Dashboard",
      path: "/"
    },

    {
      icon: <FaMapMarkerAlt />,
      label: "Safe Zones",
      path: "/safezones"
    },

    {
      icon: <FaFire />,
      label: "Heatmap",
      path: "/heatmap"
    },

    {
      icon: <FaLocationArrow />,
      label: "Live Tracking",
      path: "/tracking"
    },

    {
      icon: <FaVideo />,
      label: "Surveillance",
      path: "/surveillance"
    },

    {
      icon: <FaExclamationTriangle />,
      label: "Alerts",
      path: "/alerts"
    },

    {
      icon: <FaChartBar />,
      label: "Analytics",
      path: "/analytics"
    },

    {
      icon: <FaUsers />,
      label: "Users",
      path: "/users"
    }

  ];

  return (

    <div className="sidebar">

      <h1 className="logo">
        SAFENET
      </h1>

      {

        menuItems.map(
          (item, index) => (

            <Link
              key={index}
              to={item.path}
              className="menu-link"
              style={{
                textDecoration: "none"
              }}
            >

              <div className="menu-item">

                <div className="menu-icon">
                  {item.icon}
                </div>

                <div className="menu-label">
                  {item.label}
                </div>

              </div>

            </Link>

          )
        )

      }

    </div>

  );
}

export default Sidebar;