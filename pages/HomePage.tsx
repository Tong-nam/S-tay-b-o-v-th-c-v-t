
import React from 'react';
import Card from '../components/Card';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center p-6 bg-green-600 text-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold">Sổ tay Bảo Vệ Thực Vật</h1>
        <p className="mt-2 text-green-100">Người bạn đồng hành của nhà nông</p>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Chào mừng bạn!</h2>
          <p className="text-gray-600">
            Ứng dụng Sổ tay Bảo Vệ Thực Vật cung cấp các công cụ và thông tin cần thiết để giúp bạn chăm sóc cây trồng hiệu quả, từ việc tra cứu sản phẩm, hoạt chất cho đến các kỹ thuật canh tác tiên tiến.
          </p>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Tính năng nổi bật</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Tra cứu nhanh sản phẩm và hoạt chất BVTV.</li>
            <li>Công cụ tính toán phối trộn phân bón NPK.</li>
            <li>Danh mục sản phẩm, phân bón cập nhật.</li>
            <li>Thông tin liên hệ và hỗ trợ kỹ thuật.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
