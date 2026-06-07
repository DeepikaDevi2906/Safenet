import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

function Analytics() {

  const [analytics,
    setAnalytics] =
    useState(null);

  useEffect(() => {

    fetch(
      "http://16.171.152.82:8000/analytics"
    )
      .then((res) =>
        res.json()
      )
      .then((data) => {

        setAnalytics(data);

      })
      .catch((err) => {

        console.log(err);

      });

  }, []);

  if (!analytics) {

    return (
      <h2>
        Loading Analytics...
      </h2>
    );
  }

  const pieData = [

    {
      name: "Active",
      value:
        analytics.active_alerts
    },

    {
      name:
        "Investigating",

      value:
        analytics.investigating_alerts
    },

    {
      name:
        "Resolved",

      value:
        analytics.resolved_alerts
    }

  ];

  const COLORS = [

    "#ef4444",
    "#facc15",
    "#22c55e"

  ];

  const barData = [

    {
      name:
        "Alerts",

      value:
        analytics.total_alerts
    },

    {
      name:
        "Safe Zones",

      value:
        analytics.safe_zones
    },

    {
      name:
        "Tracking",

      value:
        analytics.tracked_locations
    }

  ];

  return (

    <div
      className="analytics-page"
    >

      <h1>
        Analytics Dashboard
      </h1>

      <div
        className="analytics-cards"
      >

        <div
          className="analytics-card"
        >
          <h3>
            Total Alerts
          </h3>

          <h1>
            {
              analytics.total_alerts
            }
          </h1>
        </div>

        <div
          className="analytics-card"
        >
          <h3>
            Active
          </h3>

          <h1>
            {
              analytics.active_alerts
            }
          </h1>
        </div>

        <div
          className="analytics-card"
        >
          <h3>
            Resolved
          </h3>

          <h1>
            {
              analytics.resolved_alerts
            }
          </h1>
        </div>

        <div
          className="analytics-card"
        >
          <h3>
            Safe Zones
          </h3>

          <h1>
            {
              analytics.safe_zones
            }
          </h1>
        </div>

      </div>

      <div
        className="chart-container"
      >

        <div
          className="chart-card"
        >

          <h2>
            Alert Status
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
              >

                {
                  pieData.map(
                    (
                      entry,
                      index
                    ) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index
                          ]
                        }
                      />

                    )
                  )
                }

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        <div
          className="chart-card"
        >

          <h2>
            System Data
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={barData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#3b82f6"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );
}

export default Analytics;