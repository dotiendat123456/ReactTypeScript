// src/components/PizzaCard.tsx
import React from 'react';
import type { Pizza } from '../types/pizza';
import { formatCurrency } from '../utils/format';

type Props = {
    pizza: Pizza;
    onAdd?: (p: Pizza) => void; // optional override
};

export const PizzaCard: React.FC<Props> = ({ pizza, onAdd }) => {
    const formatted = formatCurrency(pizza.price);
    return (
        <article className="pizza-card" aria-labelledby={`pizza-${pizza.id}`}>
            <div className="pizza-media">
                <img src={pizza.image || '/assets/placeholder.png'} alt={pizza.name} />
            </div>
            <div className="pizza-body">
                <h3 id={`pizza-${pizza.id}`} className="pizza-title">{pizza.name}</h3>
                <p className="pizza-desc">{pizza.description}</p>
                <div className="pizza-footer">
                    <div className="pizza-price">{formatted}</div>
                    <button
                        className="btn btn-primary"
                        onClick={() => onAdd ? onAdd(pizza) : console.warn('onAdd not provided')}
                    >
                        Thêm vào giỏ
                    </button>
                </div>
            </div>
        </article>
    );
};

export default PizzaCard;
