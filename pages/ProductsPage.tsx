import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { PRODUCT_CATEGORIES, ProductCategory } from '../types';

interface ProductsPageProps {
  onProductClick: (url: string) => void;
}

const categoryStyles: { [key in ProductCategory]?: { bg: string; text: string; } } = {
    'Thuốc trừ sâu': { bg: 'bg-[#FFE5E0]', text: 'text-[#D9534F]' },
    'Thuốc trừ bệnh': { bg: 'bg-[#F1E6F9]', text: 'text-[#8A63D2]' },
    'Thuốc trừ cỏ': { bg: 'bg-[#E5F5EA]', text: 'text-[#5CB85C]' },
    'Thuốc trừ ốc': { bg: 'bg-[#F8EDE4]', text: 'text-[#F0AD4E]' },
    'Phân bón lá': { bg: 'bg-[#E1F7F4]', text: 'text-[#46B8DA]' },
    'Phân bón gốc': { bg: 'bg-[#FFF6DA]', text: 'text-[#E69A2A]' },
    'Chất điều hòa sinh trưởng': { bg: 'bg-[#E6F0FA]', text: 'text-[#337AB7]' },
};

const getCategoryStyle = (category: ProductCategory) => {
    return categoryStyles[category] || { bg: 'bg-gray-200', text: 'text-gray-800' };
};


const ProductsPage: React.FC<ProductsPageProps> = ({ onProductClick }) => {
  const { products } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let categoryFiltered = products;
    if (selectedCategory !== 'all') {
      categoryFiltered = products.filter(p => p.category === selectedCategory);
    }

    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return categoryFiltered.filter(p => 
      p.name.toLowerCase().includes(lowercasedSearchTerm) ||
      p.ingredients.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Tìm kiếm tên hoặc thành phần..." 
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
          {filteredProducts.map(product => {
            const style = getCategoryStyle(product.category);
            return (
              <div onClick={() => onProductClick(product.articleUrl)} key={product.id} className="cursor-pointer block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover" />
                <div className="p-3 flex flex-col flex-grow">
                  <div>
                    <h3 className={`font-semibold text-sm truncate ${style.text}`}>{product.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 truncate">{product.ingredients}</p>
                    <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full mt-1 inline-block ${style.bg} ${style.text}`}>
                        {product.category}
                    </span>
                  </div>
                  <div className="flex-grow" />
                  <div>
                    {!product.isPartnerOnly && product.price > 0 && (
                      <p className="text-sm font-bold text-green-600 mt-1">{product.price.toLocaleString('vi-VN')}đ</p>
                    )}
                    {product.isPartnerOnly && (
                      <p className="text-sm font-bold text-blue-600 mt-1">Giá đối tác</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Card className="p-6 text-center text-gray-500">
          <p>Không tìm thấy sản phẩm nào.</p>
        </Card>
      )}
    </div>
  );
};

export default ProductsPage;