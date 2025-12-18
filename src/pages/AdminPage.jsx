import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { Trash2, Plus, Upload, Loader } from 'lucide-react';

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Password Protection State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');

    // Form State
    const [newItem, setNewItem] = useState({
        name: '',
        price: '',
        details: '',
        category: 'Kurti',
        image: null
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Fetch Products
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (passwordInput === 'ashvi@77') {
            setIsAuthenticated(true);
            localStorage.setItem('adminAuth', 'true');
        } else {
            alert('Incorrect Password');
        }
    };

    useEffect(() => {
        const isAuth = localStorage.getItem('adminAuth');
        if (isAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Admin Access</h2>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enter Admin Password</label>
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
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Unlock Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setNewItem({ ...newItem, image: e.target.files[0] });
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!newItem.image || !newItem.name || !newItem.price) {
            setError("Please fill all fields and select an image.");
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            // Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', newItem.image);
            formData.append('upload_preset', 'ashvi_products'); // You'll need to create this
            formData.append('cloud_name', 'deydeno8b'); // Replace with actual cloud name

            const response = await fetch(
                'https://api.cloudinary.com/v1_1/deydeno8b/image/upload',
                {
                    method: 'POST',
                    body: formData
                }
            );

            const data = await response.json();
            const imageUrl = data.secure_url;

            // Add to Firestore
            await addDoc(collection(db, "products"), {
                name: newItem.name,
                price: Number(newItem.price),
                details: newItem.details,
                category: newItem.category,
                image: imageUrl,
                createdAt: new Date().toISOString()
            });

            // Reset Form
            setNewItem({ name: '', price: '', details: '', category: 'Kurti', image: null });
            document.getElementById('file-input').value = "";

        } catch (err) {
            console.error("Error adding product:", err);
            setError("Failed to upload image. Please try again.");
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

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {/* Add Product Form */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-10">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Plus size={24} className="text-indigo-600" /> Add New Product
                    </h2>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <form onSubmit={handleAddProduct} className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input
                                type="text"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g. Summer Floral Dress"
                            />
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
                                onChange={(e) => setNewItem({ ...newItem, details: e.target.value })}
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g. Pure Cotton, Dry Clean Only..."
                            />
                        </div>

                        {/* Category selection */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                <option value="Kurti">Kurti</option>
                                <option value="Wedding Wear">Wedding Wear (Shadi)</option>
                                <option value="Western Wear">Western Wear</option>
                                <option value="Party Wear">Party Wear</option>
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Product Image</label>
                            <input
                                id="file-input"
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
                            >
                                {submitting ? (
                                    <>
                                        <Loader className="animate-spin mr-2" size={20} /> Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2" size={20} /> Add Product
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Product List */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Products ({products.length})</h2>

                {loading ? (
                    <div className="text-center py-10">Loading products...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
