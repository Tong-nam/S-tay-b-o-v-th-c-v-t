import React from 'react';
import Card from '../../components/Card';
import { useAuth } from '../../contexts/AuthContext';

const PartnerTechniquesPage: React.FC = () => {
    const { articles, articleCategories, loading } = useAuth();

    if (loading || !articles || !articleCategories) {
        return <div className="text-center p-8"><i className="fas fa-spinner fa-spin text-2xl"></i></div>
    }

    const getCategoryName = (catId: string) => articleCategories.find(c => c.id === catId)?.name || 'Chưa phân loại';

    return (
        <div className="space-y-3">
          {articles.map((item) => (
            <Card key={item.id} className="hover:bg-gray-50 transition-colors">
                <div className="p-4">
                     <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-green-600 font-semibold">{getCategoryName(item.categoryId)}</p>
                        {item.isPartnerOnly && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">Nội bộ</span>}
                    </div>
                    <h3 className="font-semibold text-gray-800 mt-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.summary}</p>
                    <button className="text-sm text-blue-600 hover:underline mt-2">Xem chi tiết &raquo;</button>
                </div>
            </Card>
          ))}
           {articles.length === 0 && (
            <Card className="p-6 text-center text-gray-500">
              <i className="fas fa-book-open text-4xl mb-3"></i>
              <p>Hiện chưa có bài viết kỹ thuật nào.</p>
            </Card>
          )}
        </div>
      );
};

export default PartnerTechniquesPage;
