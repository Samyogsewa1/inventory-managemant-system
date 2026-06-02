
import axios from "axios";
import {useEffect, useState} from "react";

const Products = () => {
    const [openModal, setOpenModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        supplierId: "",
    });

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
        setSuppliers(response.data.suppliers );
      setCategories(response.data.categories );

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

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
      ...prevData,
     [name]: value,
     }));
    }
  

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
    "http://localhost:3000/api/products/add",
          formData,
          {
            headers: {  
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );

        if (response.data.success) {
          // fetchSuppliers(); 
          alert("Products added successfully");  
          setOpenModal(false);
          setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
            categoryId: "",
            supplierId: "",
          });
         
        } else {
          console.error("Failed to add product", response.data); // ✅ fixed
          alert("Failed to add product. Please try again.");
        }
      }
     catch (error) {
      console.error("Error submitting product", error);
      alert("Something went wrong. Please try again.");
    }

 }

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
           <h1 className="text-2xl font-bold">Product Management </h1>
           <div className="flex justify-between items-center"> 
            <input 
            type="text" 
            placeholder="Search " 
            className="border p-1 bg-white rounded px-4" 
            // onChange={handleSearch} 
            />
            <button 
            className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
            onClick={() => setOpenModal(true)}

            >Add Product
            </button>
           </div>

           <div>
              <table className="w-full border-collapse border border-gray-300 mt-4 bg-white">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">S NO</th>
                    <th className="border border-gray-300 p-2">Product Name</th>
                    <th className="border border-gray-300 p-2">Category Name</th>
                     <th className="border border-gray-300 p-2">Supplier Name</th>
                    <th className="border border-gray-300 p-2">Price</th>
                    <th className="border border-gray-300 p-2">Stock</th>
                   
                   
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {Array.isArray(products) && products.map((product, index) => (
                    <tr key={product._id}>
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{product.name}</td>
                      <td className="border border-gray-300 p-2">{product.categoryId.categoryName}</td>
                      <td className="border border-gray-300 p-2">{product.supplierId.name }</td>
                      <td className="border border-gray-300 p-2">{product.price }</td>
                      <td className="border border-gray-300 p-2">
                        <span>
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
                        <button className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer"
                        onClick={() => handleEdit(product)}>
                          Edit
                        </button>
                        <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer ml-2"
                        onClick={() => handleDelete(product._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                </tbody>


              
                </table>
                {/* {filteredSuppliers.length === 0 && <div className="text-center p-4">No records found.</div>} */}
              </div>

           {openModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
                  <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
                    <h1 className="text-xl font-bold">Add Product</h1>
                  <button className="absolute top-4 right-4 font-bold text-red-500 hover:text-red-700 text-lg cursor-pointer" onClick={() => setOpenModal(false)}>
                        X
                  </button>
                  <form className="flex flex-col gap-4 mt-4"  onSubmit={handleSubmit}>
                        <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                        className="border p-1 bg-white rounded px-4"
                        />
                        <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Product Description"
                        className="border p-1 bg-white rounded px-4"
                        />
                        <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="EnterPrice"
                        className="border p-1 bg-white rounded px-4"
                        />
                        <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="Enter Stock"
                        className="border p-1 bg-white rounded px-4" 
                        />

                       <div>
                      
                        <select name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange} 
                        className="border p-1 bg-white rounded px-4 w-full mt-2">
                          <option value="">Select Category</option>
                          {categories && categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.categoryName}
                            </option>
                          ))}
                          </select>
                       </div>
                       <div>
                      
                        <select 
                        name="supplierId"
                        value={formData.supplierId}
                        onChange={handleChange}
                         className="border p-1 bg-white rounded px-4 w-full mt-2">
                          <option value="">Select Supplier</option>
                          {suppliers && suppliers.map((supplier) => (
                            <option key={supplier._id} value={supplier._id}>
                              {supplier.name}
                            </option>
                          ))}

                        </select>
                       </div>
                        

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600 transition duration-200"
                >
                  Add Product
                </button>
               
                  <button
                    type="button"
                    className="w-full rounded-md bg-gray-500 text-white p-3 cursor-pointer hover:bg-gray-600 transition duration-200"
                    onClick={() => setOpenModal(false)}
                  >
                    Cancel
                  </button>
                
              </div>
            </form>
              </div>
      </div>
)}

    </div>

  ) 


}

 

export default Products;