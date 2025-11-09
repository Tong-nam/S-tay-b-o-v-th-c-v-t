import React, { useState, useMemo } from 'react';
import Card from '../../components/Card';
import { useAuth } from '../../contexts/AuthContext';
import { PRODUCT_CATEGORIES, ProductCategory } from '../../types';

interface PartnerProductsPageProps {
  onProductClick: (url: string) => void;
}

const PartnerProductsPage: React.FC<PartnerProductsPageProps> = ({ onProductClick }) => {
  const { products } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let categoryFiltered = products;
    if (selectedCategory !== 'all') {
      categoryFiltered = products.filter(p => p.category === selectedCategory);
    }

    return categoryFiltered.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Tìm kiếm sản phẩm đối tác..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <i className="fas fa-search"></i>
        </div>
      </div>

      <div className="flex overflow-x-auto space-x-2 pb-2 -mx-4 px-4">
        <button 
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${selectedCategory === 'all' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Tất cả
        </button>
        {PRODUCT_CATEGORIES.map(cat => (
          <button 
            key={cat} 
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${selectedCategory === cat ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      
       {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <div onClick={() => onProductClick(product.articleUrl)} key={product.id} className="cursor-pointer block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover" />
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                <p className="text-base font-bold text-green-600">{product.price > 0 ? `${product.price.toLocaleString('vi-VN')}đ` : 'Giá liên hệ'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center text-gray-500">
          <p>Không tìm thấy sản phẩm nào.</p>
        </Card>
      )}
    </div>
  );
};

export default PartnerProductsPage;
