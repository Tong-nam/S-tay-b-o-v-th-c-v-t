import React from 'react';
import { Page } from '../types';
import Card from '../components/Card';

interface MorePageProps {
  navigateTo: (page: Page) => void;
}

const MorePage: React.FC<MorePageProps> = ({ navigateTo }) => {
  const menuItems = [
    { page: Page.ActiveIngredientLookup, label: 'Tra cứu Hoạt chất BVTV', icon: 'fa-flask' },
    { page: Page.NpkCalculator, label: 'Phối trộn phân bón NPK', icon: 'fa-calculator' },
    { page: Page.FertilizerList, label: 'Danh mục phân bón', icon: 'fa-book' },
    { page: Page.Techniques, label: 'Kỹ thuật canh tác', icon: 'fa-seedling' },
    { page: Page.Contact, label: 'Liên Hệ', icon: 'fa-address-card' },
  ];

  return (
    <div className="space-y-3">
      {menuItems.map(item => (
        <Card key={item.page} className="hover:bg-gray-100 transition-colors">
          <button onClick={() => navigateTo(item.page)} className="w-full text-left p-4 flex items-center">
            <i className={`fas ${item.icon} text-green-600 w-8 text-center text-xl`}></i>
            <span className="ml-4 font-medium text-gray-700">{item.label}</span>
            <i className="fas fa-chevron-right ml-auto text-gray-400"></i>
          </button>
        </Card>
      ))}
    </div>
  );
};

export default MorePage;
