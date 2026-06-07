import { useEffect, useState } from "react";

function Users() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {

    try {

      const response = await fetch(
        "http://16.171.152.82:8000/users"
      );

      const data = await response.json();

      console.log("USERS DATA:", data);

      // Handle different response formats
      if (Array.isArray(data)) {

        setUsers(data);

      } else if (Array.isArray(data.users)) {

        setUsers(data.users);

      } else {

        setUsers([]);

      }

    } catch (error) {

      console.log(error);
      setUsers([]);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (
      <div className="users-page">
        <h2>Loading Users...</h2>
      </div>
    );

  }

  return (

    <div className="users-page">

      <div className="users-header">

        <h1>
          👥 Users Management
        </h1>

        <p>
          Total Users: {users.length}
        </p>

      </div>

      <div className="users-table-container">

        <table className="users-table">

          <thead>

            <tr>

              <th>ID</th>
              <th>Name</th>
              <th>Email</th>

            </tr>

          </thead>

          <tbody>

            {

              users.length > 0 ?

              users.map((user) => (

                <tr key={user.id}>

                  <td>{user.id}</td>

                  <td>
                    {
                      user.username ||
                      user.name ||
                      "N/A"
                    }
                  </td>

                  <td>
                    {
                      user.email ||
                      "N/A"
                    }
                  </td>

                </tr>

              ))

              :

              <tr>

                <td
                  colSpan="3"
                  style={{
                    textAlign: "center"
                  }}
                >
                  No Users Found
                </td>

              </tr>

            }

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default Users;