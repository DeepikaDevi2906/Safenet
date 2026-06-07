import { useEffect, useState } from "react";

function Users() {

  const [users, setUsers] =
    useState([]);

  useEffect(() => {

    fetchUsers();

  }, []);

  const fetchUsers = async () => {

    try {

      const response =
        await fetch(
          "http://16.171.152.82:8000/users"
        );

      const data =
        await response.json();

      setUsers(data);

    } catch (error) {

      console.log(error);

    }

  };
return (

  <div className="users-page">

    <div className="users-header">
      <h1>👥 Users Management</h1>
      <p>View all registered users</p>
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

          {users.map((user) => (

            <tr key={user.id}>

              <td>
                <span className="user-badge">
                  #{user.id}
                </span>
              </td>

              <td>
                {user.username || user.name}
              </td>

              <td>
                {user.email}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>

);
}

export default Users;