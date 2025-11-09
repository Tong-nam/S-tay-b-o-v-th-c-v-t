
import React from 'react';
import Card from '../components/Card';

const fertilizers = [
  { name: 'Phân NPK 20-20-15', description: 'Cung cấp đạm, lân, kali cân đối cho cây trồng.' },
  { name: 'Phân hữu cơ vi sinh', description: 'Cải tạo đất, tăng độ phì nhiêu, cung cấp vi sinh vật có lợi.' },
  { name: 'Phân bón lá Amino', description: 'Bổ sung axit amin, giúp cây trồng vượt qua stress.' },
  { name: 'Super Lân', description: 'Cung cấp lân dễ tiêu, giúp phát triển bộ rễ.' },
  { name: 'Kali Sulphate (K₂SO₄)', description: 'Cung cấp Kali và Lưu huỳnh, giúp tăng chất lượng nông sản.' },
];

const FertilizerListPage: React.FC = () => {
  return (
    <div className="space-y-3">
        <div className="relative mb-4">
            <input 
            type="text" 
            placeholder="Tìm kiếm phân bón..." 
            className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <i className="fas fa-search"></i>
            </div>
        </div>
      {fertilizers.map((item, index) => (
        <Card key={index}>
            <div className="p-4">
                <h3 className="font-semibold text-green-700">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </div>
        </Card>
      ))}
    </div>
  );
};

export default FertilizerListPage;
