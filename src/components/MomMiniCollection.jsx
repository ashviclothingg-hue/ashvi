import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

const MomMiniCollection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        try {
            const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
            const unsubscribe = onSnapshot(q,
                (snapshot) => {
                    const productsData = snapshot.docs
                        .map(doc => ({ id: doc.id, ...doc.data() }))
                        .filter(p =>
                            p.category === 'Mom & Mini Casual' ||
                            p.category === 'Mom & Mini Ethnic' ||
                            (p.category && p.category.toLowerCase().includes('mom & mini')) ||
                            (p.category && p.category.toLowerCase().includes('mom and mini'))
                        );

                    setProducts(productsData);
                    setLoading(false);
                },
                (err) => {
                    console.error("Error fetching mom & mini collection:", err);
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
        if (activeTab === 'Casual') {
            return products.filter(p =>
                p.category === 'Mom & Mini Casual' ||
                (p.category && p.category.toLowerCase().includes('casual'))
            );
        }
        if (activeTab === 'Ethnic') {
            return products.filter(p =>
                p.category === 'Mom & Mini Ethnic' ||
                (p.category && p.category.toLowerCase().includes('ethnic'))
            );
        }
        return products;
    };

    const filteredProducts = getFilteredProducts();

    return (
        <section className="py-20 bg-gradient-to-b from-rose-50/60 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-rose-500 font-bold tracking-wider uppercase text-sm">Twinning Goals</span>
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mt-2 mb-4">
                        Mom & Mini Collection
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto font-medium">
                        Matching outfits for moms and their little divas — because twinning is winning! 💕
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
                    <ProductSkeleton count={4} />
                ) : products.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">Coming soon...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">No items found in this category.</div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 gap-y-6 md:gap-8">
                            {filteredProducts.slice(0, 4).map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={index}
                                    orderSource="ASHVI (Mom & Mini)"
                                />
                            ))}
                        </div>

                        {/* View All Button */}
                        {filteredProducts.length > 4 && (
                            <div className="text-center mt-10">
                                <Link
                                    to="/mom-mini"
                                    className="inline-flex items-center px-8 py-3 bg-ashvi-dark text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all text-base transform hover:scale-105 active:scale-95 duration-200"
                                >
                                    View All Mom & Mini
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default MomMiniCollection;
