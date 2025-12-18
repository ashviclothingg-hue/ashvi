import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Collection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleOrder = (productName) => {
        const message = `Hi, I want to order this dress from ASHVI: ${productName}`;
        const url = `https://wa.me/917803024406?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

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
                ) : products.length === 0 ? (
                    <div className="text-center text-gray-500">No products added yet.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="bg-ashvi-light rounded-2xl overflow-hidden shadow-soft group"
                            >
                                <div className="relative h-80 overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>

                                <div className="p-6">
                                    <h3 className="font-playfair font-semibold text-lg text-gray-800 mb-2 truncate">
                                        {product.name}
                                    </h3>
                                    <p className="text-rose-500 font-bold text-xl mb-4">
                                        ₹{product.price}
                                    </p>
                                    <button
                                        onClick={() => handleOrder(product.name)}
                                        className="w-full flex items-center justify-center gap-2 bg-white border-2 border-ashvi-pink text-ashvi-dark py-2 px-4 rounded-full hover:bg-ashvi-pink transition-colors font-medium"
                                    >
                                        <MessageCircle size={18} />
                                        Order on WhatsApp
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Collection;
