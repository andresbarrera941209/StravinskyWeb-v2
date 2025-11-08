export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CategoryProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}