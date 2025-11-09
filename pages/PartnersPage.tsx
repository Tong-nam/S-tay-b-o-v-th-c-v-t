import React, { useState, FormEvent } from 'react';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';

const PartnersPage: React.FC = () => {
  const { login, register } = useAuth();
  const [isRegisterView, setIsRegisterView] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const clearFormState = () => {
    setName('');
    setPhone('');
    setPassword('');
    setError('');
    setSuccess('');
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await login(phone, password);
      // App.tsx will handle the redirect
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(name, phone, password);
      setSuccess('Đăng ký thành công! Vui lòng chờ quản trị viên kích hoạt tài khoản của bạn.');
      setIsRegisterView(false); // Switch to login view
      clearFormState();
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <div className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isRegisterView ? 'Đăng Ký Đối Tác' : 'Đăng Nhập'}
          </h2>
          <p className="text-gray-500">{isRegisterView ? 'Tạo tài khoản để truy cập các tài nguyên riêng' : 'Vui lòng đăng nhập để tiếp tục'}</p>
        </div>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-md text-sm mb-4">{success}</p>}
        
        {isRegisterView ? (
          // Registration Form
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1" htmlFor="name">Tên của bạn</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-300 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1" htmlFor="phone-register">Số điện thoại</label>
              <input type="tel" id="phone-register" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-300 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1" htmlFor="password-register">Mật khẩu</label>
              <input type="password" id="password-register" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-300 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:bg-gray-400 text-lg">
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Đăng Ký'}
            </button>
          </form>
        ) : (
          // Login Form
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1" htmlFor="phone-login">Số điện thoại</label>
              <input type="text" id="phone-login" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-300 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" placeholder="Nhập số điện thoại" required />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1" htmlFor="password-login">Mật khẩu</label>
              <input type="password" id="password-login" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-300 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" placeholder="Nhập mật khẩu" required />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:bg-gray-400 text-lg">
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Đăng Nhập'}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
            <button onClick={() => { setIsRegisterView(!isRegisterView); clearFormState(); }} className="text-sm text-green-600 hover:underline">
                {isRegisterView ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
            </button>
        </div>

      </div>
    </Card>
  );
};

export default PartnersPage;