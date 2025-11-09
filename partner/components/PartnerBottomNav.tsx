import React from 'react';
import { PartnerPage } from '../PartnerApp';

interface PartnerBottomNavProps {
  activePage: PartnerPage;
  setActivePage: (page: PartnerPage) => void;
}

const NavItem: React.FC<{
  page: PartnerPage;
  label: string;
  iconClass: string;
  isActive: boolean;
  onClick: (page: PartnerPage) => void;
}> = ({ page, label, iconClass, isActive, onClick }) => {
  const activeColor = 'text-green-600';
  const inactiveColor = 'text-gray-500';

  return (
    <button
      onClick={() => onClick(page)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ease-in-out ${
        isActive ? activeColor : inactiveColor
      }`}
    >
      <i className={`fas ${iconClass} text-xl`}></i>
      <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : ''}`}>{label}</span>
    </button>
  );
};

const PartnerBottomNav: React.FC<PartnerBottomNavProps> = ({ activePage, setActivePage }) => {

  const navItems = [
    { page: 'products' as PartnerPage, label: 'Sản Phẩm', iconClass: 'fa-tags' },
    { page: 'techniques' as PartnerPage, label: 'Kỹ Thuật', iconClass: 'fa-seedling' },
    { page: 'account' as PartnerPage, label: 'Tài khoản', iconClass: 'fa-user-cog' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around max-w-screen-md mx-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.page}
            page={item.page}
            label={item.label}
            iconClass={item.iconClass}
            isActive={activePage === item.page}
            onClick={setActivePage}
          />
        ))}
      </div>
    </nav>
  );
};

export default PartnerBottomNav;
