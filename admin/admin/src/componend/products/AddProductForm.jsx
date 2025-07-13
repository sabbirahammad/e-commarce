import { useState } from 'react';

const AddProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    images: [],
    isTrending: false,
    isTopProduct: false,
    description: '',
  });

  const [previews, setPreviews] = useState([null, null, null, null, null]);
  const [uploading, setUploading] = useState(false);

  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dpgags9kx/image/upload';
  const UPLOAD_PRESET = 'unsigned_upload';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileUpload = async (file, index) => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      // Update image URL and preview
      setProduct((prev) => {
        const updated = [...prev.images];
        updated[index] = data.secure_url;
        return { ...prev, images: updated };
      });

      setPreviews((prev) => {
        const updated = [...prev];
        updated[index] = URL.createObjectURL(file);
        return updated;
      });
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });

    if (response.ok) {
      alert('Product added successfully!');
      setProduct({
        name: '',
        price: '',
        category: '',
        images: [],
        isTrending: false,
        isTopProduct: false,
        description: '',
      });
      setPreviews([null, null, null, null, null]);
    } else {
      alert('Failed to add product');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl bg-white shadow-md p-6 rounded-lg space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>

      <div>
        <label className="block mb-1 font-medium">Product Name</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Price</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Category</label>
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows="3"
        />
      </div>

      {[...Array(3)].map((_, i) => (
        <div key={i}>
          <label className="block mb-1 font-medium">Image {i + 1}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files[0], i)}
            className="w-full border px-3 py-2 rounded"
          />
          {previews[i] && (
            <img
              src={previews[i]}
              alt={`Preview ${i + 1}`}
              className="w-24 h-24 mt-2 object-cover border rounded"
            />
          )}
        </div>
      ))}

      {uploading && <p className="text-blue-600">Uploading image...</p>}

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isTrending"
          checked={product.isTrending}
          onChange={handleChange}
        />
        <label>Trending Product</label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isTopProduct"
          checked={product.isTopProduct}
          onChange={handleChange}
        />
        <label>Top Product</label>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {uploading ? 'Uploading...' : 'Add Product'}
      </button>
    </form>
  );
};

export default AddProductForm;




