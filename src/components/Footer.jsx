import React from 'react';
import { Link } from 'react-scroll';
import { Instagram, MessageCircle, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="footer" className="bg-ashvi-dark text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-playfair font-bold mb-4">ASHVI</h2>
                        <p className="text-gray-400 mb-6">
                            Where Style Meets Comfort. We bring you the trendiest fashion for girls.
                        </p>
                        <div className="flex justify-center md:justify-start space-x-4">
                            <a
                                href="https://instagram.com/ashvi.clothing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-ashvi-pink hover:text-ashvi-dark transition-all"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="https://wa.me/917803024406"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-ashvi-pink hover:text-ashvi-dark transition-all"
                            >
                                <MessageCircle size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-6 text-ashvi-pink">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="hero" smooth={true} className="text-gray-400 hover:text-white cursor-pointer transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="collection" smooth={true} className="text-gray-400 hover:text-white cursor-pointer transition-colors">Collection</Link>
                            </li>
                            <li>
                                <Link to="reviews" smooth={true} className="text-gray-400 hover:text-white cursor-pointer transition-colors">Reviews</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="text-center md:text-right">
                        <h3 className="text-xl font-semibold mb-6 text-ashvi-pink">Contact Us</h3>
                        <p className="text-gray-400 mb-2">WhatsApp Orders Only</p>
                        <p className="text-xl font-bold mb-4">+91 7803024406</p>
                        <a
                            href="https://wa.me/917803024406"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block border border-ashvi-pink text-ashvi-pink px-6 py-2 rounded-full hover:bg-ashvi-pink hover:text-ashvi-dark transition-colors"
                        >
                            Chat Now
                        </a>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                    <p className="flex items-center justify-center gap-1">
                        Made with <Heart size={14} className="text-red-500 fill-current" /> by ASHVI Team &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
