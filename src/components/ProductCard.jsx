import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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

    const handleOrder = (e) => {
        e.preventDefault(); // Prevent navigation when clicking order button

        let message = `*Hello Ashvi Clothing!*\n`;

        if (product.isSpecialOffer) {
            message += `*Special Offer Order!*\n\n`;
        } else {
            message += `\n`;
        }

        message += `I would like to order this beautiful outfit:\n\n` +
            `• *Product:* ${product.name}\n`;

        if (product.isSpecialOffer) {
            const offerPrice = product.discountPrice || product.price;
            const originalPrice = product.discountPrice ? product.price : Math.round(product.price * 1.25);

            message += `• *Offer Price:* ₹${offerPrice}\n` +
                `• *Cutt-off Price:* ~₹${originalPrice}~\n`;
        } else {
            message += `• *Price:* ₹${product.price}\n`;
        }

        message += `• *Category:* ${product.category}\n\n` +
            `• *Product Link:* ${images[currentImageIndex]}\n\n` +
            `*Is this currently available for order?*`;

        const url = `https://wa.me/917803024406?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <Link to={`/product/${product.id}`} className="block group">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-soft group border border-gray-100 h-full flex flex-col"
            >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 flex items-center justify-center">
                    {/* Images */}
                    <img
                        src={images[currentImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-cover transform transition-transform duration-700"
                    />

                    {/* Tags */}
                    <div className="absolute top-2 left-2 flex gap-2 z-10 w-full pr-4">
                        {product.category && (product.category.includes('Casual') || product.category.includes('Ethnic')) && (
                            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] md:text-xs font-bold text-ashvi-dark shadow-sm">
                                {product.category.includes('Casual') ? 'Casual' : 'Ethnic'}
                            </div>
                        )}
                        {product.isSpecialOffer && (
                            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-[10px] md:text-xs font-bold shadow-sm animate-pulse">
                                Special Offer
                            </div>
                        )}
                    </div>

                    {/* Navigation Arrows - Only show on desktop/hover to keep mobile clean */}
                    {images.length > 1 && (
                        <div className="hidden md:block">
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
                        </div>
                    )}
                </div>

                <div className="p-3 md:p-6 flex flex-col flex-grow">
                    <h3 className="font-playfair font-semibold text-sm md:text-lg text-gray-800 mb-1 md:mb-2 truncate">
                        {product.name}
                    </h3>

                    {product.isSpecialOffer ? (
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <span className="text-gray-400 text-xs md:text-sm line-through">
                                ₹{product.discountPrice ? product.price : Math.round(product.price * 1.25)}
                            </span>
                            <p className="text-rose-500 font-bold text-base md:text-xl">
                                ₹{product.discountPrice || product.price}
                            </p>
                        </div>
                    ) : (
                        <p className="text-rose-500 font-bold text-base md:text-xl mb-3 md:mb-4">
                            ₹{product.price}
                        </p>
                    )}

                    <button
                        onClick={handleOrder}
                        className="mt-auto w-full flex items-center justify-center gap-2 bg-ashvi-dark text-white py-2 md:py-3 px-3 md:px-4 rounded-xl hover:bg-gray-800 transition-colors font-semibold shadow-lg shadow-gray-200 text-sm md:text-base"
                    >
                        <MessageCircle size={18} />
                        <span className="hidden md:inline">Order Now</span>
                        <span className="md:hidden">Order</span>
                    </button>
                </div>
            </motion.div>
        </Link>
    );
};

export default ProductCard;
