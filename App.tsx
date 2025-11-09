import React, { useState, useCallback } from 'react';
import { Page } from './types';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import LookupPage from './pages/LookupPage';
import MorePage from './pages/MorePage';
import PartnersPage from './pages/PartnersPage';
import ContactPage from './pages/ContactPage';
import NpkCalculatorPage from './pages/NpkCalculatorPage';
import FertilizerListPage from './pages/FertilizerListPage';
import Header from './components/Header';
import { useAuth } from './contexts/AuthContext';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import PartnerApp from './partner/PartnerApp';
import Card from './components/Card';


// Defined here to avoid creating new files
const TechniquesPage: React.FC = () => {
  const { articles, articleCategories, loading } = useAuth();
  
  if (loading || !articles || !articleCategories) {
      return <div className="text-center p-8"><i className="fas fa-spinner fa-spin text-2xl"></i></div>
  }
  
  const publicArticles = articles.filter(a => !a.isPartnerOnly);
  const getCategoryName = (catId: string) => articleCategories.find(c => c.id === catId)?.name || 'Chưa phân loại';

  return (
    <div className="space-y-3">
      {publicArticles.map((item) => (
        <Card key={item.id} className="hover:bg-gray-50 transition-colors">
          <div className="p-4">
            <p className="text-xs text-green-600 font-semibold">{getCategoryName(item.categoryId)}</p>
            <h3 className="font-semibold text-gray-800 mt-1">{item.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{item.summary}</p>
          </div>
        </Card>
      ))}
       {publicArticles.length === 0 && (
         <Card className="p-6 text-center text-gray-500">
           <i className="fas fa-book-open text-4xl mb-3"></i>
           <p>Hiện chưa có bài viết kỹ thuật nào.</p>
         </Card>
       )}
    </div>
  );
};

const WebViewPage: React.FC<{ url: string }> = ({ url }) => (
    <iframe src={url} title="Chi tiết sản phẩm" className="w-full h-full border-none" />
);

const PublicApp: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Home);
  const [webViewUrl, setWebViewUrl] = useState('');

  const navigateTo = useCallback((page: Page) => {
    setActivePage(page);
  }, []);

  const openWebView = (url: string) => {
      setWebViewUrl(url);
      setActivePage(Page.WebView);
  }

  const renderContent = () => {
    switch (activePage) {
      case Page.Home:
        return <HomePage />;
      case Page.Products:
        return <ProductsPage onProductClick={openWebView} />;
      case Page.Lookup:
      case Page.ActiveIngredientLookup:
        return <LookupPage />;
      case Page.More:
        return <MorePage navigateTo={navigateTo} />;
      case Page.Partners:
        return <PartnersPage />;
      case Page.Contact:
        return <ContactPage />;
      case Page.NpkCalculator:
        return <NpkCalculatorPage />;
      case Page.FertilizerList:
        return <FertilizerListPage />;
      case Page.Techniques:
        return <TechniquesPage />;
      case Page.WebView:
        return <WebViewPage url={webViewUrl} />;
      default:
        return <HomePage />;
    }
  };

  const getPageTitle = () => {
    if (activePage === Page.Home) return 'Sổ tay Bảo Vệ Thực Vật';
    if (activePage === Page.Partners) return 'Cổng Đối Tác';
    if (activePage === Page.WebView) return 'Chi tiết Sản phẩm';
    return activePage;
  };
  
  const showHeader = activePage !== Page.Home;
  const isSubPageOfMore = [Page.Contact, Page.NpkCalculator, Page.FertilizerList, Page.ActiveIngredientLookup, Page.Techniques].includes(activePage);
  
  const handleBack = () => {
    if (activePage === Page.WebView) {
      // Go back to the products page, which is the only place it's opened from.
      setActivePage(Page.Products);
      return;
    }
    if (isSubPageOfMore) {
      setActivePage(Page.More);
      return;
    }
    setActivePage(Page.Home);
  };
  
  // Clean up webview URL if we navigate away by other means (e.g., bottom nav)
  if (webViewUrl && activePage !== Page.WebView) {
      setWebViewUrl('');
  }

  return (
    <div className="min-h-screen font-sans bg-gray-100 text-gray-800 flex flex-col">
      {showHeader && <Header title={getPageTitle()} onBack={isSubPageOfMore || activePage === Page.WebView ? handleBack : undefined} />}
      <div className={`flex-grow ${!showHeader ? 'pt-4' : ''} pb-20`}>
        <main className="p-4">{renderContent()}</main>
      </div>
      <BottomNav activePage={activePage} setActivePage={navigateTo} />
    </div>
  );
};


const App: React.FC = () => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><i className="fas fa-spinner fa-spin text-4xl text-green-600"></i></div>;
  }

  if (currentUser) {
    if (currentUser.role === 'admin') {
      return <AdminDashboardPage />;
    }
    return <PartnerApp />;
  }

  return <PublicApp />;
};

export default App;
