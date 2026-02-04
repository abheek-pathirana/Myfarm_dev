import vegetableBox from '../assets/products/vegetable-box.png';
import fruitBox from '../assets/products/fruit-box.png';
import mixedBox from '../assets/products/mixed-box.png';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_active: boolean;
  category: 'vegetables' | 'fruits' | 'herbs' | 'other'; // Added this
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Fresh Vegetable Box',
    description: 'A curated selection of seasonal organic vegetables fresh from the farm.',
    price: 4500, // Updated to Rs style
    image_url: vegetableBox,
    is_active: true,
    category: 'vegetables'
  },
  {
    id: '2',
    name: 'Fruit Delight Box',
    description: 'Sweet and juicy seasonal fruits picked at peak ripeness.',
    price: 5500,
    image_url: fruitBox,
    is_active: true,
    category: 'fruits'
  },
  {
    id: '3',
    name: 'Mixed Farm Box',
    description: 'The best of both worlds! A mix of fresh veggies, fruits, and farm-fresh eggs.',
    price: 8500,
    image_url: mixedBox,
    is_active: true,
    category: 'other' // This shows up in "Other Products"
  },
];