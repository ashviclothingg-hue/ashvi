import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MessageCircle, ArrowLeft, Share2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, 'products', productId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.error("No such product!");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const handleOrder = () => {
        if (!product) return;

        const currentImage = product.images && product.images.length > 0
            ? product.images[currentImageIndex]
            : product.image;

        let message = `*Hello Ashvi!*\n`;

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
            `• *Product Image:* ${currentImage}\n\n` +
            `*Is this currently available?*`;

        const url = `https://wa.me/917803024406?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };



    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ashvi-dark"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="text-ashvi-dark underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const images = product.images && product.images.length > 0 ? product.images : [product.image];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-ashvi-dark mb-6 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="relative aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
                            <motion.img
                                key={currentImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                src={images[currentImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />

                            {/* Tags */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                {product.category && (product.category.includes('Casual') || product.category.includes('Ethnic')) && (
                                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-ashvi-dark shadow-sm">
                                        {product.category.includes('Casual') ? 'Casual' : 'Ethnic'}
                                    </div>
                                )}
                                {product.isSpecialOffer && (
                                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse">
                                        Special Offer
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-ashvi-dark' : 'border-transparent'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-playfair font-bold text-gray-900 mb-2">
                                    {product.name}
                                </h1>
                                <p className="text-sm text-gray-500 mb-4 uppercase tracking-wide">
                                    {product.category}
                                </p>
                            </div>
                            {/* Optional: Add Share/Wishlist buttons here */}
                        </div>

                        {product.isSpecialOffer ? (
                            <div className="flex items-end gap-3 mb-6">
                                <div className="text-3xl font-bold text-rose-500">
                                    ₹{product.discountPrice || product.price}
                                </div>
                                <div className="text-lg text-gray-400 line-through mb-1">
                                    ₹{product.discountPrice ? product.price : Math.round(product.price * 1.25)}
                                </div>
                                <span className="text-sm font-bold text-green-600 mb-2 bg-green-100 px-2 py-0.5 rounded">
                                    Special Offer
                                </span>
                            </div>
                        ) : (
                            <div className="text-2xl font-bold text-rose-500 mb-6">
                                ₹{product.price}
                            </div>
                        )}

                        <div className="prose prose-sm text-gray-600 mb-8">
                            <h3 className="text-gray-900 font-semibold mb-2">Description</h3>
                            <p className="whitespace-pre-wrap">
                                {product.description || product.details || "Experience elegance and comfort with this beautiful outfit from Ashvi. Perfect for special occasions or daily wear."}
                            </p>
                        </div>

                        <div className="mt-auto space-y-4">
                            <button
                                onClick={handleOrder}
                                className="w-full flex items-center justify-center gap-2 bg-ashvi-dark text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition-colors font-bold text-lg shadow-lg active:scale-[0.98]"
                            >
                                <MessageCircle size={24} />
                                Order on WhatsApp
                            </button>

                            <p className="text-xs text-center text-gray-400">
                                Secure payment and fast shipping available.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetailsPage;
