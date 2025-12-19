import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { Trash2, Plus, Upload, Loader } from 'lucide-react';

const ADMIN_EMAIL = "ashvi.clothingg@gmail.com";

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Password Protection State
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [authLoading, setAuthLoading] = useState(true);

    // Tab State
    const [activeTab, setActiveTab] = useState('main'); // 'main' or 'baby'

    // Form State
    const [newItem, setNewItem] = useState({
        name: '',
        price: '',
        details: '',
        category: 'Short Kurtis',
        images: []
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [reviews, setReviews] = useState([]);

    // Fetch Products & Reviews
    useEffect(() => {
        const unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
            setLoading(false);
        });

        const unsubscribeReviews = onSnapshot(collection(db, "reviews"), (snapshot) => {
            const reviewsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReviews(reviewsData);
        });

        return () => {
            unsubscribeProducts();
            unsubscribeReviews();
        };
    }, []);

    // Update default category when tab changes
    useEffect(() => {
        if (activeTab === 'main') {
            setNewItem(prev => ({ ...prev, category: 'Short Kurtis' }));
        } else {
            setNewItem(prev => ({ ...prev, category: 'Babies Casual' }));
        }
    }, [activeTab]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await signInWithEmailAndPassword(auth, emailInput, passwordInput);
            if (userCredential.user.email !== ADMIN_EMAIL) {
                await signOut(auth);
                alert('Access Denied: You are not an authorized admin.');
            }
        } catch (err) {
            console.error("Login Error:", err);
            alert('Incorrect Email or Password');
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error("Logout Error:", err);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.email === ADMIN_EMAIL) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                if (user) signOut(auth); // Sign out if accidentally logged in with wrong id
            }
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader className="animate-spin text-indigo-600" size={40} />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Admin Access</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Admin Email</label>
                            <input
                                type="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="admin@ashvi.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            Unlock Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const handleImageChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).slice(0, 5); // Limit to 5 images
            setNewItem({ ...newItem, images: filesArray });
        }
    };

    const handleAddProduct = async (e) => {
        const name = newItem.name.trim();
        const price = Number(newItem.price);
        const details = newItem.details.trim();

        if (newItem.images.length === 0 || !name || isNaN(price) || price <= 0) {
            setError("Please fill all fields correctly. Price must be greater than 0.");
            return;
        }

        if (name.length > 100) {
            setError("Product name must be under 100 characters.");
            return;
        }

        if (details.length > 1000) {
            setError("Product details must be under 1000 characters.");
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const imageUrls = [];

            // Upload each image to Cloudinary
            for (const image of newItem.images) {
                const formData = new FormData();
                formData.append('file', image);
                formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
                formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: 'POST',
                        body: formData
                    }
                );

                const data = await response.json();
                if (data.secure_url) {
                    imageUrls.push(data.secure_url);
                }
            }

            // Add to Firestore
            await addDoc(collection(db, "products"), {
                name: newItem.name,
                price: Number(newItem.price),
                details: newItem.details,
                category: newItem.category,
                image: imageUrls[0], // Keep primary image for backward compatibility
                images: imageUrls, // Array of all images
                createdAt: new Date().toISOString()
            });

            // Reset Form (maintain current tab category default)
            setNewItem({
                name: '',
                price: '',
                details: '',
                category: activeTab === 'main' ? 'Short Kurtis' : 'Babies Casual',
                images: []
            });
            document.getElementById('file-input').value = "";
            alert("Product added successfully!");

        } catch (err) {
            console.error("Error adding product:", err);
            setError("Failed to upload images. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await deleteDoc(doc(db, "products", id));
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Failed to delete product.");
        }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            await deleteDoc(doc(db, "reviews", id));
        } catch (err) {
            console.error("Error deleting review:", err);
            alert("Failed to delete review.");
        }
    };

    // Filter products based on active tab
    const filteredProducts = products.filter(product => {
        const isBabyProduct = ['Babies Casual', 'Babies Ethnic'].includes(product.category);
        return activeTab === 'baby' ? isBabyProduct : !isBabyProduct;
    });

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded-full transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Tab Switcher */}
                    <div className="bg-white p-1 rounded-lg border border-gray-200 inline-flex">
                        <button
                            onClick={() => setActiveTab('main')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'main'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Main Collection
                        </button>
                        <button
                            onClick={() => setActiveTab('baby')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'baby'
                                ? 'bg-rose-500 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Baby Fits
                        </button>
                    </div>
                </div>

                {/* Add Product Form */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-10 border-t-4 border-t-indigo-500">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Plus size={24} className="text-indigo-600" />
                        Add New {activeTab === 'main' ? 'Collection' : 'Baby'} Product
                    </h2>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <form onSubmit={handleAddProduct} className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input
                                type="text"
                                maxLength={100}
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g. Summer Floral Dress"
                            />
                            <p className="text-[10px] text-gray-400 text-right mt-1">{newItem.name.length}/100</p>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                            <input
                                type="number"
                                value={newItem.price}
                                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="1299"
                            />
                        </div>

                        {/* Details */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Product Details</label>
                            <textarea
                                value={newItem.details}
                                maxLength={1000}
                                onChange={(e) => setNewItem({ ...newItem, details: e.target.value })}
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g. Pure Cotton, Dry Clean Only..."
                            />
                            <p className="text-[10px] text-gray-400 text-right mt-1">{newItem.details.length}/1000</p>
                        </div>

                        {/* Category selection */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                {activeTab === 'main' ? (
                                    <>
                                        <option value="Short Kurtis">Short Kurtis</option>
                                        <option value="Long Kurtis">Long Kurtis</option>
                                        <option value="Suit Sets">Suit Sets</option>
                                        <option value="Anarkali Sets">Anarkali Sets</option>
                                        <option value="Co-ord Sets">Co-ord Sets</option>
                                        <option value="One Piece Dress">One Piece Dress</option>
                                        <option value="Festive Fits">Festive Fits</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="Babies Casual">Babies Casual</option>
                                        <option value="Babies Ethnic">Babies Ethnic</option>
                                    </>
                                )}
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Product Images (Max 5)</label>
                            <input
                                id="file-input"
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                multiple
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                {newItem.images.length > 0 ? `${newItem.images.length} file(s) selected` : "Hold Ctrl/Cmd to select multiple"}
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:bg-gray-400 ${activeTab === 'main'
                                    ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                                    : 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-500'
                                    }`}
                            >
                                {submitting ? (
                                    <>
                                        <Loader className="animate-spin mr-2" size={20} /> Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2" size={20} /> Add to {activeTab === 'main' ? 'Collection' : 'Baby Fits'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Product List */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {activeTab === 'main' ? 'Main Collection' : 'Baby Fits'} Inventory ({filteredProducts.length})
                </h2>

                {loading ? (
                    <div className="text-center py-10">Loading products...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                                <div className="h-64 overflow-hidden bg-gray-50 flex items-center justify-center">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{product.category || 'Kurti'}</span>
                                    </div>
                                    <p className="text-rose-500 font-bold">₹{product.price}</p>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id, product.image)}
                                        className="mt-4 w-full flex items-center justify-center p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 size={18} className="mr-2" /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No products found in this section.
                            </div>
                        )}
                    </div>
                )}

                {/* Reviews Management */}
                <h2 className="text-2xl font-bold text-gray-900 my-8 pt-8 border-t border-gray-200">Manage Reviews ({reviews.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900">{review.name}</span>
                                    <span className="text-yellow-500 text-sm">★ {review.rating}</span>
                                </div>
                                <p className="text-gray-600 text-sm italic mb-2">"{review.text}"</p>
                                {review.image && (
                                    <img src={review.image} alt="Review" className="h-16 w-16 object-cover rounded-md" />
                                )}
                            </div>
                            <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-red-500 hover:text-red-700 p-2"
                                title="Delete Review"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {reviews.length === 0 && <p className="text-gray-500">No reviews found.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
