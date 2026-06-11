import React, { useEffect, useState } from "react";
import axios from "axios";

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/category", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name is required");
      return;
    }

     try {
       if (editCategory) {
         const response = await axios.put(
          `http://localhost:3000/api/category/${editCategory}`,
          { categoryName, categoryDescription },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );

        if (response.data.success) {
          setEditCategory(null); // ✅ fixed
          setCategoryName("");
          setCategoryDescription("");
          alert("Category updated successfully");
          fetchCategories();
        } else {
          console.error("Failed editing category", response.data); // ✅ fixed
          alert("Failed to edit category. Please try again.");
        }
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/category/add",
          { categoryName, categoryDescription },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );

        if (response.data.success) {
          alert("Category added successfully");
          setCategoryName("");
          setCategoryDescription("");
          fetchCategories();
        } else {
          console.error("Failed to add category", response.data); // ✅ fixed
          alert("Failed to add category. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting category", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleEdit = (category) => {
    setEditCategory(category._id);
    setCategoryName(category.categoryName);
    setCategoryDescription(category.categoryDescription);
  };

  const handleCancel = () => {
    setEditCategory(null);
    setCategoryName("");
    setCategoryDescription("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
      if (response.data.success) {
        alert("Category deleted successfully");
        fetchCategories();
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      if (error.response){
        alert(error.response.data.message);
      }else {
      alert("Error deleting category. Please try again.");
      }
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8">Category Management</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Add/Edit Category Form */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-center text-xl font-bold mb-4">
              {editCategory ? "Edit Category" : "Add New Category"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  placeholder="Category Name"
                  value={categoryName}
                  className="border w-full p-2 rounded-md"
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  id="categoryDescription"
                  name="categoryDescription"
                  placeholder="Category Description"
                  value={categoryDescription}
                  className="border w-full p-2 rounded-md"
                  onChange={(e) => setCategoryDescription(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600 transition duration-200"
                >
                  {editCategory ? "Save Changes" : "Add Category"}
                </button>
                {editCategory && (
                  <button
                    type="button"
                    className="w-full rounded-md bg-gray-500 text-white p-3 cursor-pointer hover:bg-gray-600 transition duration-200"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Categories Table */}
        <div className="lg:w-2/3">
          <div className="bg-white shadow-md rounded-lg p-4">
            <table className="w-full border-collapse border border-gray-200 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-2">S.No</th>
                  <th className="border border-gray-200 p-2">Category Name</th>
                  <th className="border border-gray-200 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(categories) &&
                  categories.map((category, index) => (
                    <tr key={category._id}>
                      <td className="border border-gray-200 p-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-200 p-2">
                        {category.categoryName}
                      </td>
                      <td className="border border-gray-200 p-2">
                        <button
                          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                          onClick={() => handleEdit(category)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200 ml-2"
                          onClick={() => handleDelete(category._id)}
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

export default Categories;
