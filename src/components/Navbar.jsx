import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { Menu, X, ShoppingBag } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: 'Collection', to: 'collection' },
        { name: 'Why ASHVI', to: 'features' },
        { name: 'Reviews', to: 'reviews' },
        { name: 'Contact', to: 'footer' },
    ];

    return (
        <nav className="fixed w-full bg-ashvi-light/90 backdrop-blur-md z-50 shadow-sm border-b border-ashvi-pink/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer">
                        <Link to="hero" smooth={true} duration={500} className="text-2xl font-playfair font-bold text-ashvi-dark tracking-wide">
                            ASHVI
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.to}
                                smooth={true}
                                duration={500}
                                className="text-ashvi-dark hover:text-ashvi-pink transition-colors cursor-pointer font-medium"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-ashvi-dark hover:text-ashvi-pink focus:outline-none"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-ashvi-light/95 backdrop-blur-md animate-fade-in shadow-lg absolute w-full left-0">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.to}
                                smooth={true}
                                duration={500}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 text-base font-medium text-ashvi-dark hover:text-ashvi-pink hover:bg-ashvi-pink/10 rounded-md cursor-pointer"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
