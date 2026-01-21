import React, { useState, useEffect } from 'react';
import { Link, scroller } from 'react-scroll';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, LogOut, ChevronDown } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const menuItems = [
        { name: 'Collection', to: '/collection', isRoute: true },
        { name: 'Why ASHVI', to: 'features' },
        { name: 'Reviews', to: 'reviews' },
        { name: 'Contact', to: 'footer' },
    ];

    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigation = (to, isRoute) => {
        setIsOpen(false);
        if (isRoute) {
            navigate(to);
        } else {
            if (location.pathname === '/') {
                scroller.scrollTo(to, {
                    smooth: true,
                    duration: 500,
                });
            } else {
                navigate('/');
                setTimeout(() => {
                    scroller.scrollTo(to, {
                        smooth: true,
                        duration: 500,
                    });
                }, 100);
            }
        }
    };

    const handleLogoClick = () => {
        if (location.pathname === '/') {
            scroller.scrollTo('hero', {
                smooth: true,
                duration: 500,
            });
        } else {
            navigate('/');
        }
    };

    return (
        <nav className="fixed w-full bg-ashvi-light/90 backdrop-blur-md z-50 shadow-sm border-b border-ashvi-pink/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={handleLogoClick}>
                        <img
                            src="/ashvi-logo.png"
                            alt="ASHVI Logo"
                            className="h-40 w-auto object-contain hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {menuItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavigation(item.to, item.isRoute)}
                                className="text-ashvi-dark hover:text-ashvi-pink transition-colors cursor-pointer font-medium bg-transparent border-none"
                            >
                                {item.name}
                            </button>
                        ))}

                        {/* Baby Fits Link */}
                        <RouterLink
                            to="/baby-fits"
                            className="text-ashvi-dark hover:text-ashvi-pink transition-colors cursor-pointer font-medium"
                        >
                            Baby Fits
                        </RouterLink>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-ashvi-dark font-medium">Hello, {user.displayName || 'User'}</span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors font-medium border border-red-200 px-3 py-1 rounded-full hover:bg-red-50"
                                >
                                    <LogOut size={16} />
                                    <span className="text-sm">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <RouterLink
                                to="/login"
                                className="flex items-center space-x-1 text-white bg-ashvi-pink hover:bg-ashvi-dark px-4 py-2 rounded-full transition-colors font-medium shadow-md"
                            >
                                <User size={18} />
                                <span>Login</span>
                            </RouterLink>
                        )}
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
                <div className="md:hidden bg-white shadow-lg absolute w-full left-0 border-t border-gray-100">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavigation(item.to, item.isRoute)}
                                className="block w-full text-left px-3 py-3 text-base font-medium text-gray-800 hover:text-ashvi-pink hover:bg-ashvi-pink/5 rounded-lg transition-colors"
                            >
                                {item.name}
                            </button>
                        ))}

                        {/* Mobile Baby Fits */}
                        <RouterLink
                            to="/baby-fits"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-left px-3 py-3 text-base font-medium text-gray-800 hover:text-ashvi-pink hover:bg-ashvi-pink/5 rounded-lg transition-colors"
                        >
                            Baby Fits
                        </RouterLink>

                        {user ? (
                            <div className="border-t border-gray-100 pt-3 mt-3">
                                <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                    Account
                                </div>
                                <div className="px-3 py-2 text-base font-medium text-gray-800">
                                    Hello, {user.displayName || 'User'}
                                </div>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-3 text-base font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="border-t border-gray-100 pt-3 mt-3">
                                <RouterLink
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-left px-3 py-3 text-base font-medium text-ashvi-pink hover:bg-ashvi-pink/5 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <User size={18} />
                                    Login / Signup
                                </RouterLink>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
