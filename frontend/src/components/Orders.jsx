import React,{useEffect} from "react";
import axios from "axios";

const Orders = () => {
    const [orders, setOrders] = React.useState([]);

        const fetchOrders =async () => {
      try {
      const response = await axios.get("http://localhost:3000/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      if (response.data.success) {
        console.log(response.data)
        setOrders(response.data.orders);

      }else {
        console.error("Failed to fetch products", response.data);
        alert("Failed to fetch products. Please try again.");
      }
      
    } catch (error) {
      console.error("Error fetching orders", error);

      
    } 

    } ;
    useEffect(() => {
        fetchOrders();
    }, []);


    return (
           <div className="w-full h-full flex flex-col gap-4 p-4">
           <h1 className="text-2xl font-bold">Orders</h1>

           <div>
              <table className="w-full border-collapse border border-gray-300 mt-4 bg-white">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">S NO</th>
                    <th className="border border-gray-300 p-2">Product Name</th>
                    <th className="border border-gray-300 p-2">Category Name</th>
                     <th className="border border-gray-300 p-2">Quantity</th>
                    <th className="border border-gray-300 p-2">Total Price</th>
                    <th className="border border-gray-300 p-2">Date</th>
    
                  </tr>
                </thead>

                <tbody>

                  {Array.isArray(orders) && orders.map((order, index) => (
                    <tr key={order._id}>
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{order.product.name}</td>
                      <td className="border border-gray-300 p-2">{order.product.categoryId.categoryName}</td>
                      <td className="border border-gray-300 p-2">{order.quantity}</td>
                      <td className="border border-gray-300 p-2">${order.totalPrice.toFixed(2)}</td>
                      <td className="border border-gray-300 p-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                    
                    </tr>
                  ))}

                </tbody>

              
                </table>
                
              </div>
              </div>

    )
}

export default Orders;