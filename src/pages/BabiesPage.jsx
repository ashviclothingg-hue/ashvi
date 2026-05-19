import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import ProductCard from '../components/ProductCard';

const BabiesPage = () => {
    const { subCategory } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Map URL param to Database Category Name
    const categoryMap = {
        'casual': 'Babies Casual',
        'ethnic': 'Babies Ethnic'
    };

    const targetCategory = categoryMap[subCategory?.toLowerCase()];
    const displayTitle = subCategory === 'casual' ? 'Casual Wear' : 'Ethnic Wear';

    useEffect(() => {
        setLoading(true);
        try {
            // Fetch all products and filter client-side to reuse existing pattern
            // (optimization: can change to where() query if indexes allow)
            const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
            const unsubscribe = onSnapshot(q,
                (snapshot) => {
                    const productsData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    // Filter for specific category
                    const filtered = productsData.filter(p => {
                        if (subCategory?.toLowerCase() === 'casual') {
                            return p.category === 'Babies Casual' || 
                                (p.category && p.category.toLowerCase().includes('casual')) ||
                                (p.category && (
                                    p.category.toLowerCase().includes('baby') || 
                                    p.category.toLowerCase().includes('babies')
                                ) && !p.category.toLowerCase().includes('ethnic'));
                        } else {
                            return p.category === 'Babies Ethnic' || 
                                (p.category && p.category.toLowerCase().includes('ethnic'));
                        }
                    });

                    setProducts(filtered);
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
    }, [targetCategory]);

    const handleOrder = (product) => {
        const message = `*NEW ORDER FROM ASHVI (Babies Collection)* 🛍️

*Product:* ${product.name}
*Price:* ₹${product.price}
*Category:* ${product.category}

Click below to see the dress:
${product.image}

Is this available?`;
        const url = `https://wa.me/917803024406?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    if (!targetCategory) {
        return (
            <div className="min-h-screen pt-24 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Category not found</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-ashvi-pink font-medium tracking-wider uppercase">Babies Collection</span>
                    <h1 className="text-3xl md:text-5xl font-playfair font-bold text-gray-900 mt-2 mb-6">
                        {displayTitle}
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto font-medium">
                        Adorable and comfortable styles for your little ones.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500 py-20">Loading lovely outfits...</div>
                ) : error ? (
                    <div className="text-center text-red-500 py-20">{error}</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg mb-4">No outfits found in this collection yet.</p>
                        <p className="text-sm text-gray-400">Please check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 gap-y-6 md:gap-8">
                        {products.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default BabiesPage;
