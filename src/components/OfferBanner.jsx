import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

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
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-ashvi-dark overflow-hidden relative"
            >
                {/* Subtle animated gradient background */}
                <motion.div
                    animate={{
                        background: [
                            "linear-gradient(90deg, #1f2937, #111827, #1f2937)",
                            "linear-gradient(90deg, #111827, #1f2937, #111827)"
                        ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full absolute inset-0 opacity-50"
                />

                <div className="max-w-7xl mx-auto px-4 py-2 relative z-10 flex items-center justify-center gap-2">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-white font-medium text-xs md:text-sm tracking-wide text-center"
                    >
                        ✨ {banner.text} ✨
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OfferBanner;
