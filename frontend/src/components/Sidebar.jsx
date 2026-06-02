import React from "react";
import { FaBox ,FaCog, FaHome ,FaShoppingCart ,FaSignOutAlt ,FaTable ,FaTruck ,FaUsers} from "react-icons/fa";
import {NavLink} from "react-router-dom";

const Sidebar = () => {
    const menuItems = [
        { name: "Dashboard",path:"/admin-dashboard" , icon: <FaHome/> ,  isParent: true },
        { name: "Categories", path: "/admin-dashboard/categories", icon: <FaTable/>  ,isParent:false },
        { name: "Products", path: "/admin-dashboard/products", icon: <FaBox/> ,isParent:false },
        { name: "Orders", path: "/admin-dashboard/orders" , icon: <FaShoppingCart/>,isParent:false },
        { name: "Suppliers", path: "/admin-dashboard/suppliers" , icon: <FaTruck/>,isParent:false },
        { name: "Users", path: "/admin-dashboard/users" , icon: <FaUsers/> ,isParent:false},
        { name: "Profiles", path: "/admin-dashboard/profiles", icon: <FaCog/>,isParent:false },
        { name: "Logout", path: "/admin-dashboard/logout", icon: <FaSignOutAlt/> ,isParent:false}
    ];
    return (
        <div className="flex flex-col h-screen bg-black text-white w-16 md:w-64  fixed">
        <div className="h-16 flex flex-items jusify-center ">
            <span className="hidden md:block text-xl font-bold">Inventory MS</span>
            <span className=" md:hidden text-xl font-bold">IMS</span>

             </div>
             <div>
                <ul className="space-y-2 p-2">
                    {
                menuItems.map((item) => (
    <li key={item.name} >
      <NavLink
      end={item.isParent}
        to={item.path}
        className={({ isActive }) =>
          (isActive ? "bg-gray-700 text-white " : "hover:bg-gray-700 ") +
          "flex items-center p-2 rounded-md transition duration-200"
        }
      >
        <span className="text-xl">{item.icon}</span>
        <span className="ml-4 hidden- md:block">{item.name}</span>
      </NavLink>
    </li>
  ))}
</ul>

             </div>
             </div>

    )
}
export default Sidebar;