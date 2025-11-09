export enum Page {
  Home = 'Home',
  Products = 'Sản Phẩm',
  Lookup = 'Tra cứu',
  More = 'Thêm',
  Partners = 'Đối tác',
  Contact = 'Liên Hệ',
  NpkCalculator = 'Phối trộn phân bón NPK',
  ActiveIngredientLookup = 'Tra cứu Hoạt chất BVTV',
  FertilizerList = 'Danh mục phân bón',
  Techniques = 'Kỹ thuật canh tác',
  WebView = 'WebView',
}

export interface User {
  name: string;
  phone: string; // Changed from email
  role: 'admin' | 'partner';
  isActive: boolean;
}

export type ProductCategory = 'Thuốc trừ sâu' | 'Thuốc trừ bệnh' | 'Thuốc trừ cỏ' | 'Thuốc trừ ốc' | 'Phân bón gốc' | 'Phân bón lá' | 'Chất điều hòa sinh trưởng';

export const PRODUCT_CATEGORIES: ProductCategory[] = ['Thuốc trừ sâu', 'Thuốc trừ bệnh', 'Thuốc trừ cỏ', 'Thuốc trừ ốc', 'Phân bón gốc', 'Phân bón lá', 'Chất điều hòa sinh trưởng'];

export interface Product {
  id: string; 
  name: string;
  category: ProductCategory;
  imageUrl: string;
  price: number;
  articleUrl: string; // Changed from description
  ingredients: string;
  isPartnerOnly: boolean; 
}

export interface ArticleCategory {
    id: string;
    name: string;
}

export interface Article {
    id: string;
    title: string;
    summary: string;
    categoryId: string;
    isPartnerOnly: boolean;
}