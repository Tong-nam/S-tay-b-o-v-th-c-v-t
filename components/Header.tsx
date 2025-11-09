
import React from 'react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-green-600 text-white shadow-md">
       {onBack && (
        <button onClick={onBack} className="absolute left-4">
          <i className="fas fa-chevron-left"></i>
        </button>
      )}
      <h1 className="text-lg font-bold w-full text-center">{title}</h1>
    </header>
  );
};

export default Header;
