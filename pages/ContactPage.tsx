
import React from 'react';
import Card from '../components/Card';

const ContactPage: React.FC = () => {
    return (
        <div className="space-y-4">
            <Card>
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin liên hệ</h2>
                    <div className="space-y-3 text-gray-600">
                        <div className="flex items-center">
                            <i className="fas fa-building w-6 text-center text-green-600"></i>
                            <span className="ml-3">Công ty TNHH Nông Nghiệp Xanh</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-map-marker-alt w-6 text-center text-green-600"></i>
                            <span className="ml-3">123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-phone w-6 text-center text-green-600"></i>
                            <span className="ml-3">(028) 1234 5678</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-envelope w-6 text-center text-green-600"></i>
                            <span className="ml-3">hotro@nongnghiepxanh.com</span>
                        </div>
                    </div>
                </div>
            </Card>
            <Card>
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Gửi tin nhắn cho chúng tôi</h2>
                    <form className="space-y-4">
                        <input type="text" placeholder="Họ và tên" className="w-full p-2 border rounded-md" />
                        <input type="email" placeholder="Email" className="w-full p-2 border rounded-md" />
                        <textarea placeholder="Nội dung" rows={4} className="w-full p-2 border rounded-md"></textarea>
                        <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Gửi</button>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default ContactPage;
