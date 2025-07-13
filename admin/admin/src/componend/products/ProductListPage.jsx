import { useEffect, useState } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import EditProductModal from './EditProductModal';
import ProductCategorySearch from './ProductCategorySearch';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:3000/products');
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    const res = await fetch(`http://localhost:3000/products/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert('Failed to delete product');
    }
  };

  const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">All Products</h2>

      <ProductCategorySearch
        categories={uniqueCategories}
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border bg-white rounded-xl">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Images</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Trending</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">
                  <div className="flex space-x-1">
                    {(product.images || []).slice(0, 3).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`img-${i}`}
                        className="w-10 h-10 object-cover rounded border"
                      />
                    ))}
                  </div>
                </td>
                <td className="p-3">{product.name}</td>
                <td className="p-3 capitalize">{product.category}</td>
                <td className="p-3">৳{product.price}</td>
                <td className="p-3">
                  {product.isTrending ? (
                    <span className="text-green-600 font-medium">Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>
                <td className="p-3 text-center space-x-2">
                  <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600">
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => setEditProduct(product)}
                    className="p-1.5 rounded hover:bg-gray-100 text-blue-600"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-1.5 rounded hover:bg-red-100 text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onUpdate={fetchProducts}
        />
      )}
    </div>
  );
};

export default ProductListPage;



