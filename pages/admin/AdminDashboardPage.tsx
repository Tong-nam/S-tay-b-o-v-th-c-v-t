import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Product, Article, ArticleCategory, PRODUCT_CATEGORIES, ProductCategory } from '../../types';
import Header from '../../components/Header';
import Card from '../../components/Card';

type AdminTab = 'users' | 'products' | 'articles' | 'categories';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
            isActive ? 'border-b-2 border-green-600 text-green-600' : 'text-blue-600 hover:text-blue-800'
        }`}
    >
        {label}
    </button>
);

// --- User Management Panel ---
const UserManagement: React.FC = () => {
    const { getAllUsers, toggleUserStatus, changeUserPassword, addUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', phone: '', password: '' });

    const fetchUsers = useCallback(() => {
        try {
            setUsers(getAllUsers().filter(u => u.role !== 'admin'));
        } catch (err) {
            setError('Không thể tải danh sách người dùng.');
        }
    }, [getAllUsers]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);
    
    const handleToggleStatus = async (phone: string) => {
        try {
            await toggleUserStatus(phone);
            setMessage('Cập nhật trạng thái thành công!');
            fetchUsers();
        } catch (err: any) { setError(err.message); }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleChangePassword = async (phone: string) => {
        const newPassword = prompt(`Nhập mật khẩu mới cho ${phone}:`);
        if (newPassword?.trim()) {
            try {
                await changeUserPassword(phone, newPassword);
                setMessage('Thay đổi mật khẩu thành công!');
            } catch (err: any) { setError(err.message); }
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleAddUser = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!newUser.name || !newUser.phone || !newUser.password) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        try {
            await addUser(newUser.name, newUser.phone, newUser.password);
            setMessage('Thêm thành viên mới thành công!');
            setNewUser({ name: '', phone: '', password: '' });
            setShowAddForm(false);
            fetchUsers();
        } catch(err: any) {
            setError(err.message);
        }
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div>
            {!showAddForm ? (
                <>
                    <button onClick={() => setShowAddForm(true)} className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"><i className="fas fa-plus mr-2"></i>Thêm thành viên</button>
                    <Card>
                        <div className="p-4">
                            {error && <p className="bg-red-100 text-red-700 p-2 rounded text-sm mb-2">{error}</p>}
                            {message && <p className="bg-green-100 text-green-700 p-2 rounded text-sm mb-2">{message}</p>}
                            <ul className="divide-y divide-gray-200">
                                {users.map(user => (
                                    <li key={user.phone} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-800">{user.name}</p>
                                            <p className="text-sm text-gray-600">{user.phone}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {user.isActive ? 'Đã kích hoạt' : 'Chờ kích hoạt'}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2 mt-2 sm:mt-0">
                                            <button onClick={() => handleToggleStatus(user.phone)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">{user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}</button>
                                            <button onClick={() => handleChangePassword(user.phone)} className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">Đổi mật khẩu</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>
                </>
            ) : (
                <Card className="p-4">
                    <h3 className="font-bold text-lg mb-4">Thêm thành viên mới</h3>
                     {error && <p className="bg-red-100 text-red-700 p-2 rounded text-sm mb-2">{error}</p>}
                    <form onSubmit={handleAddUser} className="space-y-3">
                        <input type="text" placeholder="Tên thành viên" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="w-full p-2 border rounded" required />
                        <input type="text" placeholder="Số điện thoại" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} className="w-full p-2 border rounded" required />
                        <input type="password" placeholder="Mật khẩu" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="w-full p-2 border rounded" required />
                        <div className="flex space-x-2">
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Lưu</button>
                            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Hủy</button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
};


// --- Product Management Panel ---
const ProductManagement: React.FC = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Omit<Product, 'id'>>({ name: '', category: 'Thuốc trừ sâu', imageUrl: '', price: 0, articleUrl: '', ingredients: '', isPartnerOnly: false });

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setFormData(product);
        setShowForm(true);
    };

    const handleAddNewClick = () => {
        setEditingProduct(null);
        setFormData({ name: '', category: 'Thuốc trừ sâu', imageUrl: '', price: 0, articleUrl: '', ingredients: '', isPartnerOnly: false });
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            await updateProduct({ ...formData, id: editingProduct.id });
        } else {
            await addProduct(formData);
        }
        setShowForm(false);
        setEditingProduct(null);
    };

    return (
        <div>
            {!showForm ? (
                <>
                    <button onClick={handleAddNewClick} className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"><i className="fas fa-plus mr-2"></i>Thêm sản phẩm mới</button>
                    <div className="space-y-3">
                        {products.map(p => (
                            <Card key={p.id} className="p-4 flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <img src={p.imageUrl} alt={p.name} className="w-16 h-16 object-cover rounded" />
                                    <div>
                                        <p className="font-semibold text-gray-800">{p.name} {p.isPartnerOnly && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-2">Đối tác</span>}</p>
                                        <p className="text-sm text-gray-600">{p.category} - {p.price.toLocaleString('vi-VN')}đ</p>
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    <button onClick={() => handleEditClick(p)} className="text-blue-500 hover:text-blue-700 text-lg"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => window.confirm('Bạn chắc chắn muốn xóa?') && deleteProduct(p.id)} className="text-red-500 hover:text-red-700 text-lg"><i className="fas fa-trash"></i></button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                <Card className="p-4">
                    <h3 className="font-bold text-lg mb-4">{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input type="text" placeholder="Tên sản phẩm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded" required />
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as ProductCategory })} className="w-full p-2 border rounded">
                            {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input type="number" placeholder="Giá" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full p-2 border rounded" required />
                        <input type="text" placeholder="URL hình ảnh" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full p-2 border rounded" />
                        <input type="text" placeholder="URL bài viết" value={formData.articleUrl} onChange={e => setFormData({ ...formData, articleUrl: e.target.value })} className="w-full p-2 border rounded"></input>
                        <textarea placeholder="Thành phần" value={formData.ingredients} onChange={e => setFormData({ ...formData, ingredients: e.target.value })} rows={3} className="w-full p-2 border rounded" required></textarea>
                        <label className="flex items-center space-x-2"><input type="checkbox" checked={formData.isPartnerOnly} onChange={e => setFormData({ ...formData, isPartnerOnly: e.target.checked })} /> <span className="text-black">Chỉ dành cho đối tác</span></label>
                        <div className="flex space-x-2">
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Lưu</button>
                            <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Hủy</button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
};

// --- Article & Category Management --- (Combined for simplicity)
const ArticleManagement: React.FC = () => {
    const { articles, articleCategories, addArticle, updateArticle, deleteArticle } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [formData, setFormData] = useState<Omit<Article, 'id'>>({ title: '', summary: '', categoryId: '', isPartnerOnly: false });

    useEffect(() => {
      if (articleCategories.length > 0 && !formData.categoryId) {
        setFormData(f => ({ ...f, categoryId: articleCategories[0].id }));
      }
    }, [articleCategories, formData.categoryId]);

    const handleEditClick = (article: Article) => {
        setEditingArticle(article);
        setFormData(article);
        setShowForm(true);
    };

    const handleAddNewClick = () => {
        setEditingArticle(null);
        setFormData({ title: '', summary: '', categoryId: articleCategories[0]?.id || '', isPartnerOnly: false });
        setShowForm(true);
    };

     const handleCancel = () => {
        setShowForm(false);
        setEditingArticle(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (editingArticle) {
            await updateArticle({ ...formData, id: editingArticle.id });
        } else {
            await addArticle(formData);
        }
        setShowForm(false);
        setEditingArticle(null);
    };

    return (
        <div>
           {!showForm ? (
                <>
                    <button onClick={handleAddNewClick} className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"><i className="fas fa-plus mr-2"></i>Thêm bài viết mới</button>
                    <div className="space-y-3">
                        {articles.map(a => (
                            <Card key={a.id} className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{a.title} {a.isPartnerOnly && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-2">Đối tác</span>}</p>
                                    <p className="text-sm text-gray-600">{articleCategories.find(c => c.id === a.categoryId)?.name}</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button onClick={() => handleEditClick(a)} className="text-blue-500 hover:text-blue-700 text-lg"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => window.confirm('Bạn chắc chắn muốn xóa?') && deleteArticle(a.id)} className="text-red-500 hover:text-red-700 text-lg"><i className="fas fa-trash"></i></button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                <Card className="p-4">
                     <h3 className="font-bold text-lg mb-4 text-green-700">{editingArticle ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}</h3>
                     <form onSubmit={handleSubmit} className="space-y-3">
                        <input type="text" placeholder="Tiêu đề" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border rounded" required />
                        <textarea placeholder="Tóm tắt" value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} rows={4} className="w-full p-2 border rounded"></textarea>
                        <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} className="w-full p-2 border rounded">
                            {articleCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <label className="flex items-center space-x-2"><input type="checkbox" checked={formData.isPartnerOnly} onChange={e => setFormData({ ...formData, isPartnerOnly: e.target.checked })} /> <span className="text-black">Chỉ dành cho đối tác</span></label>
                        <div className="flex space-x-2">
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Lưu</button>
                            <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Hủy</button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
};

const CategoryManagement: React.FC = () => {
    const { articleCategories, addArticleCategory, deleteArticleCategory } = useAuth();
    const [newCategory, setNewCategory] = useState('');

    const handleAdd = async () => {
        if(newCategory.trim()) {
            await addArticleCategory(newCategory.trim());
            setNewCategory('');
        }
    }

    return (
        <Card className="p-4">
            <div className="flex space-x-2 mb-4">
                <input type="text" placeholder="Tên danh mục mới" value={newCategory} onChange={e => setNewCategory(e.target.value)} className="flex-grow p-2 border rounded"/>
                <button onClick={handleAdd} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Thêm</button>
            </div>
            <ul className="space-y-2">
                {articleCategories.map(c => (
                    <li key={c.id} className="p-3 bg-gray-50 border rounded flex justify-between items-center">
                        <span className="text-gray-800">{c.name}</span>
                        <button onClick={() => window.confirm('Bạn chắc chắn muốn xóa?') && deleteArticleCategory(c.id)} className="text-red-500 hover:text-red-700 text-lg"><i className="fas fa-trash"></i></button>
                    </li>
                ))}
            </ul>
        </Card>
    );
};


// --- Main Admin Page ---
const AdminDashboardPage: React.FC = () => {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState<AdminTab>('users');

    const renderContent = () => {
        switch (activeTab) {
            case 'users': return <UserManagement />;
            case 'products': return <ProductManagement />;
            case 'articles': return <ArticleManagement />;
            case 'categories': return <CategoryManagement />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header title="Quản Trị Viên" />
            <main className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                     <h2 className="text-xl font-bold text-green-700">Bảng điều khiển</h2>
                     <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">
                        <i className="fas fa-sign-out-alt mr-2"></i>Đăng Xuất
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="border-b border-gray-200">
                       <div className="flex space-x-4 px-4">
                            <TabButton label="Thành Viên" isActive={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                            <TabButton label="Sản Phẩm" isActive={activeTab === 'products'} onClick={() => setActiveTab('products')} />
                            <TabButton label="Bài Viết" isActive={activeTab === 'articles'} onClick={() => setActiveTab('articles')} />
                            <TabButton label="Danh Mục B.Viết" isActive={activeTab === 'categories'} onClick={() => setActiveTab('categories')} />
                       </div>
                    </div>
                    <div className="p-4">
                        {renderContent()}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default AdminDashboardPage;