
import React from 'react';
import { Page } from '../types';
import HomeIcon from './icons/HomeIcon';
import ProductIcon from './icons/ProductIcon';
import SearchIcon from './icons/SearchIcon';
import MoreIcon from './icons/MoreIcon';
import PartnerIcon from './icons/PartnerIcon';

interface BottomNavProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (page: Page) => void;
}> = ({ page, label, icon, isActive, onClick }) => {
  const activeColor = 'text-green-600';
  const inactiveColor = 'text-gray-500';

  return (
    <button
      onClick={() => onClick(page)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ease-in-out ${
        isActive ? activeColor : inactiveColor
      }`}
    >
      {icon}
      <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : ''}`}>{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  const mainPages = [Page.Home, Page.Products, Page.Lookup, Page.More, Page.Partners];
  
  // Determine if the current page is one of the main tabs
  const isMainPageActive = mainPages.includes(activePage);

  const getActiveTab = () => {
    if (isMainPageActive) return activePage;
    if ([Page.Contact, Page.NpkCalculator, Page.FertilizerList, Page.ActiveIngredientLookup].includes(activePage)) {
      return Page.More;
    }
    return Page.Home; // Default
  };
  
  const activeTab = getActiveTab();

  const navItems = [
    { page: Page.Home, label: 'Home', icon: <HomeIcon /> },
    { page: Page.Products, label: 'Sản Phẩm', icon: <ProductIcon /> },
    { page: Page.Lookup, label: 'Tra cứu', icon: <SearchIcon /> },
    { page: Page.More, label: 'Thêm', icon: <MoreIcon /> },
    { page: Page.Partners, label: 'Đối tác', icon: <PartnerIcon /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around max-w-screen-md mx-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.page}
            page={item.page}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item.page}
            onClick={setActivePage}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
