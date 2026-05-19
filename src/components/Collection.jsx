import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

const Collection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    const baseCategoriesOrder = [
        'Tops & Shirts',
        'Short Kurtis',
        'Long Kurtis',
        'Co-ord Sets',
        'Straight Suit Sets',
        'Flared Suit Sets',
        'Dresses',
        'Festive Fits'
    ];

    // Find all categories that actually have at least one product
    const activeCategories = Array.from(new Set(
        products
            .map(p => p.category)
            .filter(cat => {
                if (!cat) return false;
                const isBaby = cat === 'Babies Casual' || cat === 'Babies Ethnic' || cat === 'Baby Fits' || cat.toLowerCase().includes('baby') || cat.toLowerCase().includes('babies');
                const isMomMini = cat === 'Mom & Mini Casual' || cat === 'Mom & Mini Ethnic' || cat.toLowerCase().includes('mom & mini') || cat.toLowerCase().includes('mom and mini');
                const isFabric = cat === 'Fabric';
                return !isBaby && !isMomMini && !isFabric;
            })
    ));

    // Sort active categories: first matching the order of baseCategoriesOrder, then any other custom categories
    const sortedCategories = activeCategories.sort((a, b) => {
        const indexA = baseCategoriesOrder.indexOf(a);
        const indexB = baseCategoriesOrder.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });

    const categories = ['All', ...sortedCategories];

    useEffect(() => {
        try {
            // Fetch products real-time
            const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
            const unsubscribe = onSnapshot(q,
                (snapshot) => {
                    const productsData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setProducts(productsData);
                    setLoading(false);
                },
                (err) => {
                    console.error("Error fetching products:", err);
                    setError("Unable to load products. Please refresh the page.");
                    setLoading(false);
                }
            );
            return () => unsubscribe();
        } catch (err) {
            console.error("Error setting up products listener:", err);
            setError("Unable to connect to database.");
            setLoading(false);
        }
    }, []);

    const filteredProducts = products.filter(p => {
        if (activeCategory === 'All') {
            const isBabyProduct = 
                ['Babies Casual', 'Babies Ethnic', 'Baby Fits'].includes(p.category) ||
                (p.category && (
                    p.category.toLowerCase().includes('baby') ||
                    p.category.toLowerCase().includes('babies')
                ));
            const isMomMini =
                ['Mom & Mini Casual', 'Mom & Mini Ethnic'].includes(p.category) ||
                (p.category && (
                    p.category.toLowerCase().includes('mom & mini') ||
                    p.category.toLowerCase().includes('mom and mini')
                ));
            const isFabric = p.category === 'Fabric';
            return !isBabyProduct && !isMomMini && !isFabric;
        }
        return p.category === activeCategory;
    });

    return (
        <section id="collection" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
                        Our Latest Collection
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto font-medium">
                        Handpicked styles designed for comfort and elegance.
                    </p>
                </div>

                {loading ? (
                    <ProductSkeleton count={4} />
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : (
                    <>
                        {/* Categories Filter */}
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2 rounded-full font-medium transition-all ${activeCategory === cat
                                        ? 'bg-ashvi-dark text-white shadow-lg'
                                        : 'bg-ashvi-light text-gray-600 hover:bg-ashvi-pink/20'
                                        }`}
                                >
                                    {cat === 'Wedding Wear' ? 'Wedding Wear (Shadi)' : cat}
                                </button>
                            ))}
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">No products found in this category.</div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 gap-y-6 md:gap-8">
                                {filteredProducts
                                    .map((product, index) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            index={index}
                                            orderSource="ASHVI"
                                        />
                                    ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default Collection;
