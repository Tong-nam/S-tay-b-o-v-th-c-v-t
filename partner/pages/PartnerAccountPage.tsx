import React, { useState, FormEvent } from 'react';
import Card from '../../components/Card';
import { useAuth } from '../../contexts/AuthContext';

const PartnerAccountPage: React.FC = () => {
    const { currentUser, logout, changeMyPassword } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }
        
        setLoading(true);
        try {
            await changeMyPassword(newPassword);
            setMessage('Đổi mật khẩu thành công!');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.message || "Đã xảy ra lỗi khi đổi mật khẩu.");
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return <p>Đang tải thông tin người dùng...</p>
    }

    return (
        <div className="space-y-4">
            <Card>
                <div className="p-6 text-center">
                    <i className="fas fa-user-circle text-5xl text-green-600 mb-3"></i>
                    <h2 className="text-xl font-bold text-gray-800">{currentUser.name}</h2>
                    <p className="text-gray-500">{currentUser.phone}</p>
                </div>
            </Card>

            <Card>
                <div className="p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">Đổi mật khẩu</h3>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">{error}</p>}
                    {message && <p className="bg-green-100 text-green-700 p-3 rounded-md text-sm mb-4">{message}</p>}
                    <form className="space-y-3" onSubmit={handleChangePassword}>
                        <div>
                            <label className="text-sm font-medium">Mật khẩu mới</label>
                            <input 
                                type="password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full mt-1 p-2 border rounded-md"
                                placeholder="Nhập mật khẩu mới"
                            />
                        </div>
                         <div>
                            <label className="text-sm font-medium">Xác nhận mật khẩu</label>
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full mt-1 p-2 border rounded-md"
                                placeholder="Nhập lại mật khẩu mới"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400">
                             {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Lưu thay đổi'}
                        </button>
                    </form>
                </div>
            </Card>
            
            <button
                onClick={logout}
                className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
                Đăng Xuất
            </button>
        </div>
    );
};

export default PartnerAccountPage;
