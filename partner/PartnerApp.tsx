import React, { useState } from 'react';
import PartnerBottomNav from './components/PartnerBottomNav';
import PartnerProductsPage from './pages/PartnerProductsPage';
import PartnerTechniquesPage from './pages/PartnerTechniquesPage';
import PartnerAccountPage from './pages/PartnerAccountPage';
import Header from '../components/Header';

export type PartnerPage = 'products' | 'techniques' | 'account' | 'webview';

// Re-defining WebViewPage here to avoid import complexities
const WebViewPage: React.FC<{ url: string }> = ({ url }) => (
    <iframe src={url} title="Chi tiết sản phẩm" className="w-full h-full border-none absolute top-0 left-0" />
);


const PartnerApp: React.FC = () => {
    const [activePage, setActivePage] = useState<PartnerPage>('products');
    const [webViewUrl, setWebViewUrl] = useState('');

    const openWebView = (url: string) => {
        setWebViewUrl(url);
        setActivePage('webview');
    }

    const renderPage = () => {
        switch(activePage) {
            case 'products':
                return <PartnerProductsPage onProductClick={openWebView} />;
            case 'techniques':
                return <PartnerTechniquesPage />;
            case 'account':
                return <PartnerAccountPage />;
            case 'webview':
                return <WebViewPage url={webViewUrl} />;
            default:
                return <PartnerProductsPage onProductClick={openWebView} />;
        }
    };

    const getPageTitle = () => {
        switch(activePage) {
            case 'products':
                return 'Sản Phẩm Đối Tác';
            case 'techniques':
                return 'Kỹ Thuật Canh Tác';
            case 'account':
                return 'Tài Khoản Của Tôi';
            case 'webview':
                return 'Chi tiết Sản phẩm';
        }
    }

    const handleBack = () => {
        if (activePage === 'webview') {
            setActivePage('products');
            return;
        }
    };

    // Clean up webview URL if we navigate away by other means (e.g., bottom nav)
    if (webViewUrl && activePage !== 'webview') {
        setWebViewUrl('');
    }

    const isWebViewActive = activePage === 'webview';

    return (
        <div className="min-h-screen font-sans bg-gray-100 text-gray-800 flex flex-col">
            <Header title={getPageTitle()} onBack={isWebViewActive ? handleBack : undefined} />
            <div className={`flex-grow ${isWebViewActive ? '' : 'pb-20'}`}>
                <main className={`p-4 ${isWebViewActive ? 'p-0 h-full relative' : ''}`}>{renderPage()}</main>
            </div>
            {!isWebViewActive && <PartnerBottomNav activePage={activePage} setActivePage={setActivePage} />}
        </div>
    );
};

export default PartnerApp;
