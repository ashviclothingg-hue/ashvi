import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductCard = ({ product, index, orderSource = "ASHVI" }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Support both new 'images' array and old single 'image' string
    const images = product.images && product.images.length > 0 ? product.images : [product.image];

    const nextImage = (e) => {
        e.stopPropagation();
        if (images.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = (e) => {
        e.stopPropagation();
        if (images.length > 1) {
            setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        }
    };

    const handleOrder = () => {
        const message = `*NEW ORDER FROM ${orderSource}* 🛍️

*Product:* ${product.name}
*Price:* ₹${product.price}
*Category:* ${product.category}

Click below to see the dress:
${images[currentImageIndex]}

Is this available?`;
        const url = `https://wa.me/917803024406?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="bg-white rounded-2xl overflow-hidden shadow-soft group border border-gray-100"
        >
            <div className="relative h-[450px] overflow-hidden bg-gray-50 flex items-center justify-center">
                {/* Images */}
                <img
                    src={images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-contain transform transition-transform duration-700"
                />

                {/* Tags */}
                {product.category && (product.category.includes('Casual') || product.category.includes('Ethnic')) && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-ashvi-dark shadow-sm z-10">
                        {product.category.includes('Casual') ? 'Casual' : 'Ethnic'}
                    </div>
                )}

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-gray-800 z-10"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-gray-800 z-10"
                        >
                            <ChevronRight size={20} />
                        </button>

                        {/* Dots Indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-ashvi-dark' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="p-6">
                <h3 className="font-playfair font-semibold text-lg text-gray-800 mb-2 truncate">
                    {product.name}
                </h3>
                <p className="text-rose-500 font-bold text-xl mb-4">
                    ₹{product.price}
                </p>
                <button
                    onClick={handleOrder}
                    className="w-full flex items-center justify-center gap-2 bg-ashvi-dark text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors font-semibold shadow-lg shadow-gray-200"
                >
                    <MessageCircle size={18} />
                    Order Now
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
