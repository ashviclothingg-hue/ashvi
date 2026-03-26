import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
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
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 mb-6 leading-tight">
                            ASHVI - <span className="text-rose-400">Made just for you</span>
                        </h1>
                        <div className="mb-8">
                            <p className="text-gray-800 text-lg md:text-xl leading-relaxed font-medium">
                                Mom-Daughter sets • Dresses • Blouses • Suits<br />
                                <span className="text-rose-500 font-bold">Made-to-order | Crafted with care</span>
                            </p>
                            <p className="text-gray-500 text-sm md:text-base font-bold tracking-[0.2em] uppercase mt-4">
                                Designed by Ashvini
                            </p>
                        </div>

                        <Link
                            to="/collection"
                            className="inline-flex items-center px-8 py-4 bg-ashvi-pink text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:bg-ashvi-pink/90 transition-all text-lg transform hover:scale-105 active:scale-95 duration-200"
                        >
                            Shop Now
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
