import { useState, useEffect } from 'react';

const EditProductModal = ({ product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    ...product,
    images: product.images || ['', '', '', '', ''],
    description: product.description || '',
    isTrending: product.isTrending || false,
    isTopProduct: product.isTopProduct || false,
  });

  useEffect(() => {
    setFormData({
      ...product,
      images: product.images || ['', '', '', '', ''],
      description: product.description || '',
      isTrending: product.isTrending || false,
      isTopProduct: product.isTopProduct || false,
    });
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('image')) {
      const index = Number(name.replace('image', ''));
      setFormData((prev) => {
        const updatedImages = [...prev.images];
        updatedImages[index] = value;
        return { ...prev, images: updatedImages };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:3000/products/${formData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      onUpdate();
      onClose();
    } else {
      alert('Failed to update product');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl space-y-4">
        <h2 className="text-xl font-bold">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="w-full border px-3 py-2 rounded" />
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full border px-3 py-2 rounded" />
          <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full border px-3 py-2 rounded" />
          
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Product Description" className="w-full border px-3 py-2 rounded" />

          {formData.images.map((img, index) => (
            <input
              key={index}
              type="text"
              name={`image${index}`}
              value={img}
              onChange={handleChange}
              placeholder={`Image ${index + 1} URL`}
              className="w-full border px-3 py-2 rounded"
            />
          ))}

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} />
              <span>Trending</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="isTopProduct" checked={formData.isTopProduct} onChange={handleChange} />
              <span>Top Product</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-black">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;


