import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
function CourseCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [materials, setMaterials] = useState([{ title: "", link: "", type: "video" }]);

  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleAddMaterial = () => {
    setMaterials([...materials, { title: "", link: "", type: "video" }]);
  };

  const handleRemoveMaterial = (index) => {
    const newMaterials = materials.filter((_, i) => i !== index);
    setMaterials(newMaterials);
  };

  const handleMaterialChange = (index, field, value) => {
    const newMaterials = [...materials];
    newMaterials[index][field] = value;
    setMaterials(newMaterials);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!title || !description || !price || !image) {
      toast.error("Please fill all fields including image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);
    
    // Filter out empty materials and add to formData
    const validMaterials = materials.filter(m => m.title && m.link);
    console.log('CourseCreate: Raw materials:', materials);
    console.log('CourseCreate: Valid materials to send:', validMaterials);
    formData.append("materials", JSON.stringify(validMaterials));
    console.log('CourseCreate: Materials JSON:', JSON.stringify(validMaterials));

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;
    if (!token) {
      toast.error("Admin not logged in");
      navigate("/admin/login");
      return;
    }

    try {
      const response = await api.post(
        `/api/v1/course/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      toast.success(response.data.message || "Course created successfully");
      navigate("/admin/our-courses");
      setTitle("");
      setPrice("");
      setImage("");
      setDescription("");
      setImagePreview("");
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.errors || error.response?.data?.error || error.message || "Error creating course";
      toast.error(errorMsg);
    }
  };

  return (
    <div>
      <div className="min-h-screen  py-10">
        <div className="max-w-4xl mx-auto p-6 border  rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-8">Create Course</h3>

          <form onSubmit={handleCreateCourse} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg">Title</label>
              <input
                type="text"
                placeholder="Enter your course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Description</label>
              <input
                type="text"
                placeholder="Enter your course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Price</label>
              <input
                type="number"
                placeholder="Enter your course price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Course Image</label>
              <div className="flex items-center justify-center">
                <img
                  src={imagePreview ? `${imagePreview}` : "/placeholder.svg"}
                  alt="Course Preview"
                  className="w-full max-w-sm h-auto rounded-md object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder.svg';
                  }}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={changePhotoHandler}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            {/* Course Materials Section */}
            <div className="space-y-2">
              <label className="block text-lg">Course Materials (Videos, PDFs, etc.)</label>
              {materials.map((material, index) => (
                <div key={index} className="flex gap-2 items-center mb-2 p-3 border border-gray-300 rounded-md">
                  <input
                    type="text"
                    placeholder="Material title (e.g., Lesson 1: Introduction)"
                    value={material.title}
                    onChange={(e) => handleMaterialChange(index, "title", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-400 rounded-md outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Material link (YouTube, Google Drive, etc.)"
                    value={material.link}
                    onChange={(e) => handleMaterialChange(index, "link", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-400 rounded-md outline-none"
                  />
                  <select
                    value={material.type}
                    onChange={(e) => handleMaterialChange(index, "type", e.target.value)}
                    className="px-3 py-2 border border-gray-400 rounded-md outline-none"
                  >
                    <option value="video">Video</option>
                    <option value="pdf">PDF</option>
                    <option value="doc">Document</option>
                    <option value="other">Other</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterial(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddMaterial}
                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
              >
                + Add Material
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
            >
              Create Course
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CourseCreate;
