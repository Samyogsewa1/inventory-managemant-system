
import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
 const [formData, setFormData] = useState({
   name: "",
   email: "",
    password: "",
    address: "",
    role: "user",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
 

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

        const response = await axios.post(
          "http://localhost:3000/api/users/add",
           formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );

        if (response.data.success) {
          alert("User added successfully");
          setFormData({
            name: "",
            email: "",
            password: "",
            address: "",
            role: "user"
          });
        fetchUsers();
        } else {
          console.error("Failed to add user", response.data); // ✅ fixed
          alert("Failed to add user. Please try again.");
        }
    
    }  

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData,
         [name]: value
         }));
    }

  

//   const handleEdit = (category) => {
//     setEditCategory(category._id);
//     setCategoryName(category.categoryName);
//     setCategoryDescription(category.categoryDescription);
//   };

//   const handleCancel = () => {
//     setEditCategory(null);
//     setCategoryName("");
//     setCategoryDescription("");
//   };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
      if (response.data.success) {
        alert("User deleted successfully");
        fetchUsers();
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user", error);
      alert("Error deleting user");
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="p-4">

      <h1 className="text-2xl font-bold mb-8">Users Management</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Add/Edit User Form */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-center text-xl font-bold mb-4">
                Add New User
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="|Enter User Name"
                  className="border w-full p-2 rounded-md"
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter User Email"
                  className="border w-full p-2 rounded-md"
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter User Password"
                  className="border w-full p-2 rounded-md"
                  onChange={handleChange}
                />
              </div>
              
               <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter User Address"
                  className="border w-full p-2 rounded-md"
                  onChange={handleChange}
                />
              </div>
              <div>
                <select
                  name="role"
                  className="border w-full p-2 rounded-md"
                  onChange={handleChange}> 
                  <option value=" ">Select Role</option>
                  <option value="admin">Admin</option>
                   <option value="customer">Customer</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600 transition duration-200"
                >
                 Add User
                </button>
            
              </div>
            </form>
          </div>
        </div>

          
        <div className="lg:w-2/3">
        <input
          type="text"
          placeholder="Search users..."
          className="border w-full p-2 mb-4 rounded-md"
        /> 
          <div className="bg-white shadow-md rounded-lg p-4">
            <table className="w-full border-collapse border border-gray-200 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-2">S.No</th>
                  <th className="border border-gray-200 p-2">Name</th>
                  <th className="border border-gray-200 p-2">Email</th>
                  <th className="border border-gray-200 p-2">Address</th>
                  <th className="border border-gray-200 p-2">Role</th>
                  <th className="border border-gray-200 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(users) &&
                  users.map((user, index) => (
                    <tr key={user._id}>
                      <td className="border border-gray-200 p-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-200 p-2">
                        {user.name}
                      </td>
                      <td className="border border-gray-200 p-2">
                        {user.email}
                      </td>
                      <td className="border border-gray-200 p-2">
                        {user.address}
                      </td>
                      <td className="border border-gray-200 p-2">
                        {user.role}
                      </td>
                      <td className="border border-gray-200 p-2">
                       
                        <button
                          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200 ml-2"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
