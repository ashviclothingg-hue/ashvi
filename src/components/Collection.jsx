import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

import ProductCard from './ProductCard';

const Collection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Short Kurtis', 'Long Kurtis', 'Suit Sets', 'Anarkali Sets', 'Co-ord Sets', 'One Piece Dress', 'Festive Fits'];

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
                    <div className="text-center text-gray-500">Loading collection...</div>
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

                        {products.filter(p => activeCategory === 'All' || p.category === activeCategory).length === 0 ? (
                            <div className="text-center text-gray-500 py-10">No products found in this category.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {products
                                    .filter(p => activeCategory === 'All' || p.category === activeCategory)
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
