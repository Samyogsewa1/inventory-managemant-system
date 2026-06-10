
import axios from "axios";
import React,{useEffect, useState} from "react";

const Profile = () => {
    const [user, setUser] = React.useState({
        name: "",
        email: "",
        address: "",    
        password: "",
    });

    const [edit, setEdit] = useState(false);


const fetchUser = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/users/profile", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                },
            });
            if (response.data.success) {
                setUser({
                    name: response.data.user.name,
                    email: response.data.user.email,    
                    address: response.data.user.address,   
                })
            }
        }catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.put("http://localhost:3000/api/users/profile", user,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                },
      });
      if (response.data.success){
        alert("Profile updated successfully");
        setEdit(false);
      }else{
        alert("failedto update profile");
      }
    }catch (error){
      console.error("error updating profile:", error );
      alert("error updating profile.Please try again .");
    }
  }

  return (
    <div className="p-5 ">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              disabled={!edit}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              disabled={!edit}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={user.address}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              disabled={!edit}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
            />
          </div>

          {edit &&(
            <div className="">
                <label className="block text-sm font-medium text-gray-700">
                    Password</label>
                    <input 
                    type="password"
                    name="password"
                    placeholder="Enter new password(optional)"
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"

                    />
        
            </div>
          )}
          { !edit ? (
          <button
            type="button"
            onClick={() => setEdit(!edit)}
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition cursor-pointer"
          >
            Edit Profile
          </button> ):(
            <div className="flex space-x-47">
            <button type="submit"
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 cursor-pointer "
            >
              Save Changes</button>
            <button
            type="button"
            onClick={() => setEdit(!edit)}
            className=" bg-gray-500 text-white font-semibold py-2 px-4 cursor-pointer rounded-md hover:bg-gray-600 "

            >
              Cancel
              </button>
            </div>
            

          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
