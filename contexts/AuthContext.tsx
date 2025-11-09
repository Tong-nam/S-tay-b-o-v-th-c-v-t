import React, { useContext, useState, useEffect, createContext, ReactNode } from 'react';
import { User, Product, Article, ArticleCategory, PRODUCT_CATEGORIES } from '../types';

// This is a simplified in-memory "database" using localStorage.
const USERS_KEY = 'bvtv_users';
const CURRENT_USER_KEY = 'bvtv_current_user';
const PRODUCTS_KEY = 'bvtv_products';
const ARTICLES_KEY = 'bvtv_articles';
const ARTICLE_CATEGORIES_KEY = 'bvtv_article_categories';


interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (name: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getAllUsers: () => User[];
  toggleUserStatus: (phone: string) => Promise<void>;
  changeUserPassword: (phone: string, newPass: string) => Promise<void>;
  changeMyPassword: (newPass: string) => Promise<void>;
  addUser: (name: string, phone: string, password: string) => Promise<void>;
  // New data properties and methods
  products: Product[];
  articles: Article[];
  articleCategories: ArticleCategory[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addArticle: (article: Omit<Article, 'id'>) => Promise<void>;
  updateArticle: (article: Article) => Promise<void>;
  deleteArticle: (articleId: string) => Promise<void>;
  addArticleCategory: (categoryName: string) => Promise<void>;
  deleteArticleCategory: (categoryId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

// Helper to get data from local storage
const getFromLS = <T,>(key: string, defaultValue: T): T => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
};

// Helper to set data to local storage
const setInLS = <T,>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleCategories, setArticleCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- Image Caching Logic ---
    const cacheImage = async (cache: Cache, url: string) => {
        try {
            const response = await cache.match(url);
            if (!response) {
                await cache.add(url);
            }
        } catch (error) {
            // It's okay if some images fail to cache, e.g., CORS issues or network errors.
            console.warn(`Could not cache image: ${url}`, error);
        }
    };

    const cacheAllImages = async (productsToCache: Product[]) => {
        if ('caches' in window) {
            const cacheName = 'product-images-v1';
            try {
                const cache = await caches.open(cacheName);
                const cachingPromises = productsToCache.map(p => cacheImage(cache, p.imageUrl));
                await Promise.all(cachingPromises);
                console.log('Image caching process completed.');
            } catch (error) {
                console.error('Failed to open image cache:', error);
            }
        } else {
            console.log('Cache API not supported in this browser.');
        }
    };
    
    // Seed initial data if it doesn't exist
    const seedData = () => {
        // Users
        const usersData = getFromLS(USERS_KEY, {});
        if (!usersData['admin']) {
            usersData['admin'] = { name: 'Admin', phone: 'admin', password: 'Tongnam60484', role: 'admin', isActive: true };
            setInLS(USERS_KEY, usersData);
        }

        // Article Categories
        let categories = getFromLS<ArticleCategory[]>(ARTICLE_CATEGORIES_KEY, []);
        if (categories.length === 0) {
            categories = [
                { id: 'cat1', name: 'Bệnh hại trên sầu riêng' },
                { id: 'cat2', name: 'Sâu hại trên sầu riêng' },
                { id: 'cat3', name: 'Bệnh hại cây có múi' },
            ];
            setInLS(ARTICLE_CATEGORIES_KEY, categories);
        }
        setArticleCategories(categories);

        // Articles
        let articlesData = getFromLS<Article[]>(ARTICLES_KEY, []);
        if (articlesData.length === 0) {
            articlesData = [
                { id: 'art1', title: 'Kỹ thuật bón phân chuyên sâu cho cây Sầu Riêng', summary: 'Tối ưu hóa lượng phân bón theo từng giai đoạn phát triển để tăng năng suất và chất lượng quả.', categoryId: 'cat1', isPartnerOnly: true },
                { id: 'art2', title: 'Quản lý dịch hại tổng hợp (IPM) trên cây có múi', summary: 'Áp dụng các biện pháp sinh học, hóa học và canh tác một cách hợp lý để giảm thiểu thiệt hại.', categoryId: 'cat3', isPartnerOnly: false },
                { id: 'art3', title: 'Phòng trừ bệnh vàng lá thối rễ', summary: 'Hướng dẫn chi tiết hình ảnh, triệu chứng và các loại thuốc đặc trị hiệu quả.', categoryId: 'cat1', isPartnerOnly: false },
                { id: 'art4', title: 'Lịch phun thuốc định kỳ cho vụ lúa Đông-Xuân', summary: 'Bảng kế hoạch chi tiết các thời điểm và loại thuốc cần sử dụng để bảo vệ lúa.', categoryId: 'cat2', isPartnerOnly: true },
            ];
            setInLS(ARTICLES_KEY, articlesData);
        }
        setArticles(articlesData);

        // Products
        let productsData = getFromLS<Product[]>(PRODUCTS_KEY, []);
        if (productsData.length === 0) {
            productsData = [
              { id: 'prod1', name: 'Thuốc trừ sâu A', category: 'Thuốc trừ sâu', imageUrl: 'https://picsum.photos/400/300?random=1', price: 250000, articleUrl: 'https://sotaybaovethucvat.id.vn/san-pham/sample-a/', ingredients: 'Fipronil: 50 g/L', isPartnerOnly: true },
              { id: 'prod2', name: 'Thuốc trừ cỏ B', category: 'Thuốc trừ cỏ', imageUrl: 'https://picsum.photos/400/300?random=2', price: 180000, articleUrl: 'https://sotaybaovethucvat.id.vn/san-pham/sample-b/', ingredients: 'Glyphosate: 480 g/L', isPartnerOnly: false },
              { id: 'prod3', name: 'Phân bón lá C', category: 'Phân bón lá', imageUrl: 'https://picsum.photos/400/300?random=3', price: 320000, articleUrl: 'https://sotaybaovethucvat.id.vn/san-pham/sample-c/', ingredients: 'N: 10%, P2O5: 5%, K2O: 5%', isPartnerOnly: false },
              { id: 'prod4', name: 'Thuốc trừ bệnh D', category: 'Thuốc trừ bệnh', imageUrl: 'https://picsum.photos/400/300?random=4', price: 295000, articleUrl: 'https://sotaybaovethucvat.id.vn/san-pham/sample-d/', ingredients: 'Hexaconazole: 50 g/L', isPartnerOnly: true },
              { id: 'prod5', name: 'Chất điều hòa sinh trưởng E', category: 'Chất điều hòa sinh trưởng', imageUrl: 'https://picsum.photos/400/300?random=5', price: 150000, articleUrl: 'https://sotaybaovethucvat.id.vn/san-pham/sample-e/', ingredients: 'Gibberellic Acid: 20 g/L', isPartnerOnly: false },
            ];
            setInLS(PRODUCTS_KEY, productsData);
        }
        setProducts(productsData);
        cacheAllImages(productsData);
    };

    try {
      seedData();
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    } finally {
        setLoading(false);
    }
  }, []);

  const login = async (phone: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const usersData = getFromLS(USERS_KEY, {});
            const userData = usersData[phone];
            if (userData && userData.password === password) {
                if (!userData.isActive) {
                    return reject(new Error('Tài khoản của bạn chưa được kích hoạt. Vui lòng liên hệ quản trị viên.'));
                }
                const user: User = { name: userData.name, phone: userData.phone, role: userData.role, isActive: userData.isActive };
                setInLS(CURRENT_USER_KEY, user);
                setCurrentUser(user);
                resolve();
            } else {
                reject(new Error('Số điện thoại hoặc mật khẩu không chính xác.'));
            }
        }, 500);
    });
  };

  const register = async (name: string, phone: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const usersData = getFromLS(USERS_KEY, {});
            if (usersData[phone]) {
                return reject(new Error('Số điện thoại này đã được đăng ký.'));
            }
            usersData[phone] = { name, phone, password, role: 'partner', isActive: false };
            setInLS(USERS_KEY, usersData);
            resolve();
        }, 500);
    });
  };
  
  const addUser = async (name: string, phone: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const usersData = getFromLS(USERS_KEY, {});
            if (usersData[phone]) {
                return reject(new Error('Số điện thoại này đã được đăng ký.'));
            }
            usersData[phone] = { name, phone, password, role: 'partner', isActive: true }; // Admins add active users
            setInLS(USERS_KEY, usersData);
            resolve();
        }, 500);
    });
  };

  const logout = async (): Promise<void> => {
     return new Promise((resolve) => {
        localStorage.removeItem(CURRENT_USER_KEY);
        setCurrentUser(null);
        resolve();
     });
  };

  const getAllUsers = (): User[] => {
    const usersData = getFromLS(USERS_KEY, {});
    return Object.values(usersData).map((u: any) => ({
        name: u.name, phone: u.phone, role: u.role, isActive: u.isActive
    }));
  }

  const toggleUserStatus = async (phone: string): Promise<void> => {
      const usersData = getFromLS(USERS_KEY, {});
      if (usersData[phone]) {
          usersData[phone].isActive = !usersData[phone].isActive;
          setInLS(USERS_KEY, usersData);
      } else {
          throw new Error('Không tìm thấy người dùng.');
      }
  }
  
  const changeUserPassword = async (phone: string, newPass: string): Promise<void> => {
    const usersData = getFromLS(USERS_KEY, {});
    if (usersData[phone]) {
        usersData[phone].password = newPass;
        setInLS(USERS_KEY, usersData);
    } else {
        throw new Error('Không tìm thấy người dùng.');
    }
  }
  
  const changeMyPassword = async (newPass: string): Promise<void> => {
    if (!currentUser) throw new Error("Không có người dùng nào đang đăng nhập.");
    return changeUserPassword(currentUser.phone, newPass);
  }

  // Product CRUD
  const addProduct = async (product: Omit<Product, 'id'>) => {
      const newProduct = { ...product, id: Date.now().toString() };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      setInLS(PRODUCTS_KEY, updatedProducts);
  };
  const updateProduct = async (product: Product) => {
      const updatedProducts = products.map(p => p.id === product.id ? product : p);
      setProducts(updatedProducts);
      setInLS(PRODUCTS_KEY, updatedProducts);
  };
  const deleteProduct = async (productId: string) => {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      setInLS(PRODUCTS_KEY, updatedProducts);
  };

  // Article CRUD
  const addArticle = async (article: Omit<Article, 'id'>) => {
      const newArticle = { ...article, id: Date.now().toString() };
      const updatedArticles = [...articles, newArticle];
      setArticles(updatedArticles);
      setInLS(ARTICLES_KEY, updatedArticles);
  };
  const updateArticle = async (article: Article) => {
      const updatedArticles = articles.map(a => a.id === article.id ? article : a);
      setArticles(updatedArticles);
      setInLS(ARTICLES_KEY, updatedArticles);
  };
  const deleteArticle = async (articleId: string) => {
      const updatedArticles = articles.filter(a => a.id !== articleId);
      setArticles(updatedArticles);
      setInLS(ARTICLES_KEY, updatedArticles);
  };

  // Article Category CRUD
  const addArticleCategory = async (categoryName: string) => {
      const newCategory = { name: categoryName, id: Date.now().toString() };
      const updatedCategories = [...articleCategories, newCategory];
      setArticleCategories(updatedCategories);
      setInLS(ARTICLE_CATEGORIES_KEY, updatedCategories);
  };
  const deleteArticleCategory = async (categoryId: string) => {
      const updatedCategories = articleCategories.filter(c => c.id !== categoryId);
      setArticleCategories(updatedCategories);
      setInLS(ARTICLE_CATEGORIES_KEY, updatedCategories);
  };

  const value = {
    currentUser, loading, login, register, logout, getAllUsers, toggleUserStatus,
    changeUserPassword, changeMyPassword, addUser, products, articles, articleCategories,
    addProduct, updateProduct, deleteProduct, addArticle, updateArticle, deleteArticle,
    addArticleCategory, deleteArticleCategory
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};