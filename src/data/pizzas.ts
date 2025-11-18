// src/data/pizzas.ts
import type { Pizza } from '../types/pizza';

export const PIZZAS: Pizza[] = [
  {
    id: 'p1',
    name: 'Margherita',
    description: 'Sốt cà chua, phô mai Mozzarella, lá húng quế thơm.',
    price: 119000,
    image: '/src/assets/pizza1.jpg',
    tags: ['classic', 'vegetarian'],
  },
  {
    id: 'p2',
    name: 'Pepperoni Feast',
    description: 'Pepperoni giòn, phô mai kéo sợi, sốt đặc biệt của quán.',
    price: 149000,
    image: '/src/assets/pizza1.jpg',
    tags: ['spicy'],
  },
  {
    id: 'p3',
    name: 'BBQ Chicken',
    description: 'Gà nướng BBQ, hành tây, phô mai Mozzarella.',
    price: 159000,
    image: '/src/assets/pizza1.jpg',
    tags: ['special'],
  },
  {
    id: 'p4',
    name: 'Veggie Supreme',
    description: 'Hỗn hợp rau củ nướng: ớt chuông, nấm, hành tây, olive.',
    price: 129000,
    image: '/src/assets/pizza1.jpg',
    tags: ['vegetarian'],
  },
];
