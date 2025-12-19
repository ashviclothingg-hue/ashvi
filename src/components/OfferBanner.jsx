import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Sparkles } from 'lucide-react';

const OfferBanner = () => {
    const [banner, setBanner] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "settings", "banner"), (docSnap) => {
            if (docSnap.exists()) {
                setBanner(docSnap.data());
            } else {
                setBanner({ isActive: false, text: "" });
            }
        });
        return () => unsubscribe();
    }, []);

    if (!banner || !banner.isActive) return null;

    return (
        <AnimatePresence>
            <div className="max-w-7xl mx-auto px-4 mt-12 mb-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative p-[2px] rounded-2xl bg-gradient-to-r from-ashvi-pink via-rose-400 to-ashvi-pink shadow-xl overflow-hidden group"
                >
                    <div className="bg-white rounded-[14px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 transition-colors group-hover:bg-ashvi-pink/5">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-ashvi-pink/20 rounded-full blur-3xl opacity-50" />
                        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50" />

                        <div className="flex items-center gap-4 text-ashvi-dark shrink-0">
                            <div className="bg-ashvi-pink/20 p-3 rounded-xl">
                                <Sparkles className="text-ashvi-pink" size={32} />
                            </div>
                            <div>
                                <h3 className="font-playfair font-bold text-xl md:text-2xl text-ashvi-dark">Offer Alert!</h3>
                            </div>
                        </div>

                        <div className="flex-grow text-center md:text-left">
                            <p className="text-gray-900 font-semibold text-lg md:text-xl leading-relaxed">
                                {banner.text}
                            </p>
                        </div>

                        <div className="shrink-0">
                            <button
                                onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}
                                className="bg-ashvi-dark text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-md active:scale-95"
                            >
                                Explore Now
                            </button>
                        </div>
                    </div>

                    {/* Animated Border Glow */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default OfferBanner;
