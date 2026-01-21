import React from 'react';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { Instagram, MessageCircle, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="footer" className="bg-ashvi-soft text-ashvi-dark pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-playfair font-bold mb-4">ASHVI</h2>
                        <p className="text-ashvi-dark/80 mb-6">
                            We Design your Dreams✨<br />
                            Handcrafted | Made-to-Order
                        </p>
                        <div className="flex justify-center md:justify-start space-x-4">
                            <a
                                href="https://instagram.com/ashvi.clothing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-ashvi-dark/10 rounded-full flex items-center justify-center text-ashvi-dark hover:bg-ashvi-pink hover:text-white transition-all"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="https://wa.me/917803024406"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-ashvi-dark/10 rounded-full flex items-center justify-center text-ashvi-dark hover:bg-ashvi-pink hover:text-white transition-all"
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
                                <Link to="hero" smooth={true} className="text-ashvi-dark/70 hover:text-ashvi-pink cursor-pointer transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="collection" smooth={true} className="text-ashvi-dark/70 hover:text-ashvi-pink cursor-pointer transition-colors">Collection</Link>
                            </li>
                            <li>
                                <Link to="reviews" smooth={true} className="text-ashvi-dark/70 hover:text-ashvi-pink cursor-pointer transition-colors">Reviews</Link>
                            </li>
                            <li>
                                <RouterLink to="/terms-and-conditions" className="text-ashvi-dark/70 hover:text-ashvi-pink cursor-pointer transition-colors">Terms & Conditions</RouterLink>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="text-center md:text-right">
                        <h3 className="text-xl font-semibold mb-6 text-ashvi-pink">Contact Us</h3>
                        <p className="text-ashvi-dark/80 mb-2">WhatsApp Orders Only</p>
                        <p className="text-xl font-bold mb-4 text-ashvi-dark">+91 7803024406</p>
                        <a
                            href="https://wa.me/917803024406"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block border border-ashvi-pink text-ashvi-pink px-6 py-2 rounded-full hover:bg-ashvi-pink hover:text-white transition-colors"
                        >
                            Chat Now
                        </a>
                    </div>
                </div>

                <div className="border-t border-ashvi-dark/10 pt-8 text-center text-ashvi-dark/60 text-sm">
                    <p className="flex items-center justify-center gap-1">
                        Made with <Heart size={14} className="text-red-500 fill-current" /> by ASHVI Team &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
