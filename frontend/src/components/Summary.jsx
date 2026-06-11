import React, { useEffect, useState } from "react";
import Products from "./Products";
import axios from "axios";

const Summary = () => {
    
    const [dashboardData, setDashboardData]= useState ({
        totalProducts:0,
        totalStock:0,
        ordersToday:0,
        revenue:0,
        outOfStock:[],
        highestSaleProduct:null,
        lowStock:[],
    });

    const [loading, setLoading ]= useState(false);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:3000/api/dashboard", {
               headers: {
                     Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                    },
                });
            setDashboardData(response.data.dashboardData);

        }catch (error){
            alert(error.message);

        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchDashboardData();
    },[]);

    if (loading){
        return <div>loading....</div>
    }


  return (
    <div className="p-5">
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
            <div className="bg-blue-500 text-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center hover:scale-105 transition-transform">
                <p className="text-lg font-semibold">Total Products</p>
                <p className="text-3xl font-bold mt-2">{dashboardData.totalProducts}</p>
            </div>
        
    
            <div className="bg-green-500 text-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center hover:scale-105 transition-transform">
                <p className="text-lg font-semibold">Total Stock</p>
                <p className="text-3xl font-bold mt-2">{dashboardData.totalStock}</p>
            </div>
      
        <div className="bg-orange-500 text-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center hover:scale-105 transition-transform">
                <p className="text-lg font-semibold">Orders Today</p>
                <p className="text-3xl font-bold mt-2">{dashboardData.ordersToday}</p>
        </div>
    
        <div className="bg-purple-500 text-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center hover:scale-105 transition-transform">
                <p className="text-lg font-semibold">Revenue</p>
                <p className="text-3xl font-bold mt-2">${dashboardData.revenue}</p>
        </div>
    </div>


    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {/* Out of Stock Products */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Out of Stock Products
            </h3>
            {dashboardData.outOfStock.length > 0 ?(
                <ul className="space-y-2">
                    {dashboardData.outOfStock.map((Product, index) => (
                        <li key ={index} className="text-gray-600">
                            {Product.name}{""}
                            <span className="text-gray-400">({Product.categoryId.categoryName})</span>

                        </li>
                    ))}
                </ul>
            ):(
                <p className="text-gray-400">No products out of stock</p>
            )}
        </div>

        {/* Highest Sale Products */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Highest Sale Product
            </h3>
            {dashboardData.highestSaleProduct?.name ? (
                <div className="text-gray-600">
                    <p><strong>Name:</strong>{dashboardData.highestSaleProduct.name}</p>
                    <p><strong>Category:</strong>{dashboardData.highestSaleProduct.category}</p>
                    <p><strong>Total Units Sold:</strong>{dashboardData.highestSaleProduct.totalSold}</p>
                </div>
            ):(
              <p className="text-gray-600">{dashboardData.highestSaleProduct?.message || 'Loading....'}</p>
            )}
           
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Low Stock Products
            </h3>
            {dashboardData.lowStock.length > 0 ?(
                <ul className="space-y-2">
                    {dashboardData.lowStock.map((Product, index) => (
                        <li key ={index} className="text-gray-600">
                            <strong>{Product.name}</strong> - {Product.stock} left{""}
                            <span className="text-gray-400">({Product.categoryId.categoryName})</span>

                        </li>
                    ))}
                </ul>
            ):(
                <p className="text-gray-500">No low stock products</p>
            )}
           
        </div>
    </div>

    </div>
  );
};

export default Summary;
