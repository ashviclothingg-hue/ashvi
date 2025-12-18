import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

import ProductCard from './ProductCard';

const BabiesCollection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All'); // 'All', 'Casual', 'Ethnic'

    // Database category names
    const CASUAL_CATEGORY = 'Babies Casual';
    const ETHNIC_CATEGORY = 'Babies Ethnic';

    useEffect(() => {
        try {
            const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
            const unsubscribe = onSnapshot(q,
                (snapshot) => {
                    const productsData = snapshot.docs
                        .map(doc => ({ id: doc.id, ...doc.data() }))
                        .filter(p => p.category === CASUAL_CATEGORY || p.category === ETHNIC_CATEGORY);

                    setProducts(productsData);
                    setLoading(false);
                },
                (err) => {
                    console.error("Error fetching babies collection:", err);
                    setLoading(false);
                }
            );
            return () => unsubscribe();
        } catch (err) {
            console.error("Error setting up listener:", err);
            setLoading(false);
        }
    }, []);

    const getFilteredProducts = () => {
        if (activeTab === 'All') return products;
        if (activeTab === 'Casual') return products.filter(p => p.category === CASUAL_CATEGORY);
        if (activeTab === 'Ethnic') return products.filter(p => p.category === ETHNIC_CATEGORY);
        return products;
    };

    const filteredProducts = getFilteredProducts();

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-rose-600 font-bold tracking-wider uppercase">Little Ones</span>
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mt-2 mb-4">
                        Babies Collection
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto font-medium">
                        Cute, comfortable, and stylish outfits for your little angels.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-12">
                    {['All', 'Casual', 'Ethnic'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === tab
                                ? 'bg-ashvi-dark text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-ashvi-pink/10 border border-gray-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center text-gray-500">Loading collection...</div>
                ) : products.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">Coming soon...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">No items found in this category.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                                orderSource="ASHVI (Babies Collection)"
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BabiesCollection;
