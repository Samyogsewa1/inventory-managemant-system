import React,{ useState, useEffect } from "react";
import axios from "axios";

const CustomerProducts = () => {

    const [categories, setCategories] = useState([]);
        const [products, setProducts] = useState([]);
        const [filteredProducts, setFilteredProducts] = useState([]);
        const [openModal, setOpenModal] = useState(false);
        const [orderData, setOrderData] = useState({
          productId: "",
          quantity: 1,
          total: 0,
          stock: 0,
          price: 0,

        })

            const fetchProducts =async () => {
      try {
      const response = await axios.get("http://localhost:3000/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      if (response.data.success) {
        console.log(response.data)
        setProducts(response.data.products);
      setCategories(response.data.categories );
      setFilteredProducts(response.data.products);

      }else {
        console.error("Failed to fetch products", response.data);
        alert("Failed to fetch products. Please try again.");
      }
      
    } catch (error) {
      console.error("Error fetching suppliers & categories", error);

      
    } 

    } 
    useEffect(() => {
        fetchProducts();
    }, [])

    const handleSearch = (e) => {
        setFilteredProducts(
          products.filter((product) =>
            product.name.toLowerCase().includes(e.target.value.toLowerCase())
          )
        );
      }

      const handleChangeCategory = (e) => {
        setFilteredProducts(
          products.filter((product) =>
            product.categoryId._id === e.target.value
          )
        );
      };
    
      const handleOrderChange = (product) => {
        setOrderData({
          productId: product._id,
          quantity: 1,
          total: product.price,
          stock: product.stock,
          price: product.price,
        })
        setOpenModal(true);

      }
    
      const closeModal = () => {
        setOpenModal(false);

      }

      const handleSubmit = async(e) => {
        e.preventDefault();
        try {
          const response = await axios.post("http://localhost:3000/api/orders/add", orderData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          });
          if (response.data.success) {
            setOpenModal(false);
                      setOrderData({
                        productId:"",
                        quantity:1,
                        stock:0,
                        total:0,
                        price:0,

                      })  
                      alert("order placed successfully");
          }
        } catch (error) {
          console.error("Error placing order", error);
          alert("An error occurred while placing the order.");
        }
      }

      const increaseQuantity = (e) => {
        if (e.target.value > orderData.stock) {
          alert("Quantity exceeds available stock");
        }else{
          setOrderData((prev) => ({
            ...prev,
            quantity:parseInt(e.target.value) ,
            total: parseInt(e.target.value) * orderData.price,
          }))
        }

      }

  return (
    <div>
      < div className="py-4 px-6 ">
        <h2 className="text-2xl font-bold  "> Products</h2> 
      </div>
      <div className="py-4 px-6 flex justify-between items-center">
        <div>
            <select name="category" className="border-2 p-1 bg-white rounded " id="" 
            onChange={handleChangeCategory}

            >
                <option value="">Select Categories</option>
                {categories.map((category ,index ) => (
                    <option key={category._id} value={category._id}>
                        {category.categoryName}
                    </option>
                ))}
            </select>
        </div> 
        <div>
            <input 
            type="text" 
            placeholder="Search " 
            className="border-2 p-1 bg-white rounded px-4" 
            onChange={handleSearch} 
            />

            
        </div>
      </div>
      <div>
              <table className="w-full border-collapse border border-gray-300 mt-4 bg-white">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">S NO</th>
                    <th className="border border-gray-300 p-2">Product Name</th>
                    <th className="border border-gray-300 p-2">Category Name</th>
                    <th className="border border-gray-300 p-2">Price</th>
                    <th className="border border-gray-300 p-2">Stock</th>
                   
                   
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {Array.isArray(filteredProducts) && filteredProducts.map((product, index) => (
                    <tr key={product._id}>
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{product.name}</td>
                      <td className="border border-gray-300 p-2">{product.categoryId.categoryName}</td>
                      <td className="border border-gray-300 p-2">{product.price }</td>
                      <td className="border border-gray-300 p-2">
                        <span className="px-2 py-1 rounded-full text-sm font-semibold">
                          {product.stock == 0 ? (
                            <span className="bg-red-50 text-red-500 py-1 px-2 rounded-full">{product.stock}</span>
                          ) :
                            product.stock < 15 ?  ( 
                              <span className="bg-yellow-50 text-yellow-500 py-1 px-2 rounded-full">{product.stock}</span>
                            )
                            : (
                              <span className="bg-green-50 text-green-500 py-1 px-2 rounded-full">{product.stock}</span>
                            )
                          }
                        </span>
                        
                        
                        </td>
                      <td className="border border-gray-300 p-2">
                        <button
                        onClick={(e) => handleOrderChange(product )}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                         
                        >
                          Order
                        </button>
                        
                      </td>
                    </tr>
                  ))}

                </tbody>


              
                </table>
                {filteredProducts.length === 0 && <div className="text-center p-4">No records found.</div>}
              </div>

              {openModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
                  <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
                    <h1 className="text-xl font-bold">Place Order</h1>
                  <button className="absolute top-4 right-4 font-bold text-red-500 hover:text-red-700 text-lg cursor-pointer"
                   onClick={closeModal}
                   >
                        X
                  </button>
                  <form className="flex flex-col gap-4 mt-4"  onSubmit={handleSubmit}>
                        <input
                        type="number"
                        name="quantity"
                        value={orderData.quantity}
                        onChange={increaseQuantity}
                        min="1"
                        placeholder="Increase Quantity"
                        className="border p-1 bg-white rounded px-4"
                        /> 
                        <p>{orderData.quantity * orderData.price}</p>
                        

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600 transition duration-200"
                >
                 Order Now
                </button>
               
                  <button
                    type="button"
                    className="w-full rounded-md bg-gray-500 text-white p-3 cursor-pointer hover:bg-gray-600 transition duration-200"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                
              </div>
            </form>
              </div>
      </div>
)}
    </div>
  );
};

export default CustomerProducts;