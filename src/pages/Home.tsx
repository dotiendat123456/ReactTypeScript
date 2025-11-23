// import React, { useEffect, useState } from 'react';
// // import PizzaCard from '../components/PizzaCard';
// // import type { Pizza } from '../types/pizza';
// // import { pizzasService } from '../services/pizzasService';

// import ProductCard from '../components/ProductCard';
// import type { Product } from '../types/product';
// import { productsService } from '../services/productsService';

// import { useCart } from '../hooks/useCart';
// import '../App.css';

// const Home: React.FC = () => {
//     const [products, setProducts] = useState<Product[]>([]);
//     const [loading, setLoading] = useState(false);
//     const { totalItems } = useCart(); // cart logic nếu bạn còn dùng

//     useEffect(() => {
//         let mounted = true;
//         setLoading(true);

//         productsService
//             .fetch(1) // status = 1
//             .then(res => {
//                 if (!mounted) return;
//                 setProducts(res.items);
//                 console.log(res.message); // "Lấy danh sách sản phẩm thành công"
//             })
//             .catch(err => {
//                 console.error('Fetch products error:', err);
//             })
//             .finally(() => {
//                 if (mounted) setLoading(false);
//             });

//         return () => {
//             mounted = false;
//         };
//     }, []);

//     return (
//         <main>
//             <section className="hero">
//                 <div className="container hero-inner">
//                     <div className="hero-left">
//                         <h1>Menu nhà hàng</h1>
//                         <a href="#menu" className="btn btn-primary">
//                             Xem thực đơn
//                         </a>
//                     </div>
//                 </div>
//             </section>

//             <section id="menu" className="menu-section container">
//                 <div className="section-head">
//                     <h2>Thực đơn</h2>
//                     <p>{products.length} sản phẩm • Giỏ: {totalItems} món</p>
//                 </div>

//                 {loading ? (
//                     <p>Đang tải sản phẩm...</p>
//                 ) : (
//                     <div className="pizza-grid">
//                         {products.map(p => (
//                             <ProductCard key={p.id} product={p} />
//                         ))}
//                     </div>
//                 )}
//             </section>

//             <div className="cart-fab">
//                 <a href="/cart" className="btn btn-fab">
//                     {totalItems}
//                 </a>
//             </div>
//         </main>
//     );
// };

// export default Home;


import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/product';
import type { Category } from '../types/category';
import { productsService } from '../services/productsService';
import { categoriesService } from '../services/categoriesService';
import { useCart } from '../hooks/useCart';
import './Home.css';

const Home: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

    const { totalItems } = useCart();

    // Load products
    const loadProducts = async (cateId?: number) => {
        setLoadingProducts(true);
        try {
            const res = await productsService.fetch({
                status: 1,
                categoryId: cateId,
            });
            setProducts(res.items);
        } catch (err) {
            console.error('Fetch products error:', err);
        } finally {
            setLoadingProducts(false);
        }
    };

    // Load categories once
    useEffect(() => {
        let mounted = true;
        setLoadingCategories(true);

        categoriesService
            .fetch()
            .then(data => {
                if (mounted) setCategories(data);
            })
            .catch(err => console.error('Fetch categories error:', err))
            .finally(() => {
                if (mounted) setLoadingCategories(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    // Reload products when category changes
    useEffect(() => {
        loadProducts(categoryId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setCategoryId(val ? Number(val) : undefined);
    };

    return (
        <main>
            <section className="hero">
                <div className="container hero-inner">
                    <div className="hero-left">
                        <h1>Menu nhà hàng</h1>
                        <p>Danh sách món ăn, combo, dịch vụ… lấy trực tiếp từ API Laravel.</p>
                        <a href="#menu" className="btn btn-primary">
                            Xem thực đơn
                        </a>
                    </div>
                </div>
            </section>

            <section id="menu" className="menu-section container">
                <div className="section-head">
                    <h2>Thực đơn</h2>
                    <p>{products.length} sản phẩm • Giỏ: {totalItems} món</p>
                </div>

                {/* Filter theo category */}
                <div className="filter-row">
                    <label>
                        Danh mục sản phẩm:&nbsp;
                        <select
                            value={categoryId ?? ''}
                            onChange={handleCategoryChange}
                        >
                            <option value="">Tất cả danh mục</option>

                            {loadingCategories && (
                                <option disabled>Đang tải danh mục...</option>
                            )}

                            {!loadingCategories &&
                                categories.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.locale_name}
                                    </option>
                                ))}
                        </select>
                    </label>
                </div>

                {loadingProducts ? (
                    <p>Đang tải sản phẩm...</p>
                ) : (
                    <div className="pizza-grid">
                        {products.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                )}
            </section>

            <div className="cart-fab">
                <a href="/cart" className="btn btn-fab">
                    {totalItems}
                </a>
            </div>
        </main>
    );
};

export default Home;
