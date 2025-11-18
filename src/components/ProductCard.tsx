import React from 'react';
import type { Product } from '../types/product';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Ảnh fallback nếu không có thumbnail
  const imageUrl =
    product.thumbnail && product.thumbnail.trim() !== ''
      ? product.thumbnail
      : '/placeholder.png';

  const categoryLabel = product.category_name ?? 'Không phân loại';
  const badgeKey = product.product_type_badge ?? 'default';

  return (
    <article className="product-card">
      {/* Khung ảnh cố định tỉ lệ, CSS sẽ lo phần này */}
      <div className="product-card__media">
        <img
          src={imageUrl}
          alt={product.name}
        />
      </div>

      {/* Phần nội dung dưới ảnh */}
      <div className="product-card__body">
        <h3 className="product-card__title">
          {product.name}
        </h3>

        {product.description && (
          <p className="product-card__desc">
            {product.description}
          </p>
        )}

        <p className="product-card__meta">
          {product.product_type_label && (
            <>
              <span className={`badge badge-${badgeKey}`}>
                {product.product_type_label}
              </span>
              {' · '}
            </>
          )}
          {categoryLabel}
        </p>

        <div className="product-card__footer">
          <span className="product-card__price">
            {product.price.toLocaleString('vi-VN')} đ
          </span>
          {/* nếu sau này muốn thêm nút Add to cart thì quăng ở đây */}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
