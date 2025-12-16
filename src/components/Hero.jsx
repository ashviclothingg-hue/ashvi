import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    const whatsappNumber = "917803024406";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20I%20want%20to%20order%20from%20ASHVI`;

    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ashvi-light">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/hero.png"
                    alt="Ashvi Fashion"
                    className="w-full h-full object-cover object-top opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-ashvi-dark/80 text-lg md:text-xl font-medium tracking-widest mb-2 uppercase">
                            Where Style Meets Comfort
                        </h2>
                        <h1 className="text-5xl md:text-7xl font-playfair font-bold text-ashvi-dark mb-6 leading-tight">
                            Trendy Girls Wear <span className="text-ashvi-pink/80">for Every Occasion</span>
                        </h1>
                        <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed">
                            Discover our exclusive collection of elegant, comfortable, and affordable outfits.
                            Order directly on WhatsApp for a personalized shopping experience.
                        </p>

                        <motion.a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center px-8 py-4 bg-ashvi-pink text-ashvi-dark font-medium rounded-full shadow-lg hover:shadow-xl hover:bg-ashvi-pink/90 transition-all text-lg"
                        >
                            Order on WhatsApp
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </motion.a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
