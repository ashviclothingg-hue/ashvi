import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Palette, Ruler } from 'lucide-react';

const FabricsCollection = () => {
    const [fabrics, setFabrics] = useState([]);
    const [loading, setLoading] = useState(true);

    const whatsappNumber = "917803024406";

    useEffect(() => {
        const q = query(collection(db, "fabrics"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFabrics(data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching fabrics:", error);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    if (loading) return null; // Or a loading spinner

    // If no fabrics, don't show the section (optional, but good for empty state)
    if (fabrics.length === 0) return null;

    return (
        <section className="py-20 bg-ashvi-light/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-playfair font-bold text-ashvi-dark mb-4">
                        Select Fabric
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto font-medium">
                        Choose from our exclusive collection for your custom order.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 gap-y-6 md:gap-8">
                    {fabrics.map((fabric, index) => (
                        <motion.div
                            key={fabric.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-xl transition-all group"
                        >
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={fabric.image}
                                    alt={fabric.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <a
                                        href={`https://wa.me/${whatsappNumber}?text=Hi,%20I%20want%20to%20use%20this%20Fabric%20for%20custom%20order:%20${fabric.name}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white text-ashvi-dark px-6 py-2 rounded-full font-medium hover:bg-ashvi-pink hover:text-white transition-colors"
                                    >
                                        Select Fabric
                                    </a>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{fabric.name}</h3>
                                <span className="flex items-center gap-1">
                                    <Palette size={16} /> {fabric.category || 'Fabric'}
                                </span>
                                {(fabric.description || fabric.details) && (
                                    <p className="text-xs text-gray-400 mt-3 line-clamp-2">
                                        {fabric.description || fabric.details}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FabricsCollection;
