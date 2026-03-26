import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { Trash2, Plus, Upload, Loader, X, Pencil } from 'lucide-react';
import ImageCropper from '../components/ImageCropper';
import ProductCard from '../components/ProductCard';

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
    const [activeTab, setActiveTab] = useState('main'); // 'main', 'baby', 'fabric'

    // Form State
    const [newItem, setNewItem] = useState({
        name: '',
        price: '',
        description: '',
        category: 'Short Kurtis',
        unit: 'meter',
        specialOffer: false,
        images: []
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [editingItemId, setEditingItemId] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [fabrics, setFabrics] = useState([]);
    const [banner, setBanner] = useState({
        isActive: false,
        showText: true,
        showImage: true,
        text: '',
        image: ''
    });
    const [bannerImageFile, setBannerImageFile] = useState(null);
    const [bannerSaving, setBannerSaving] = useState(false);

    // Cropper State
    const [showCropper, setShowCropper] = useState(false);
    const [croppingImage, setCroppingImage] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setCurrentFile(file);
            setCroppingImage(URL.createObjectURL(file));
            setShowCropper(true);
            // Clear input so same file can be selected again if needed
            e.target.value = '';
        }
    };

    const handleCropComplete = (croppedBlob) => {
        // Create a File from the Blob
        const croppedFile = new File([croppedBlob], currentFile.name, { type: "image/jpeg" });

        // Add to images array (limit to 5)
        if (newItem.images.length < 5) {
            setNewItem(prev => ({ ...prev, images: [...prev.images, croppedFile] }));
        } else {
            alert("Maximum 5 images allowed");
        }

        setShowCropper(false);
        setCroppingImage(null);
        setCurrentFile(null);
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setCroppingImage(null);
        setCurrentFile(null);
    };

    const removeImage = (index) => {
        setNewItem(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // Fetch Products & Reviews
    useEffect(() => {
        if (!isAuthenticated) return;

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

        const unsubscribeFabrics = onSnapshot(collection(db, "fabrics"), (snapshot) => {
            const fabricsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setFabrics(fabricsData);
        });

        return () => {
            unsubscribeProducts();
            unsubscribeReviews();
            unsubscribeFabrics();
        };
    }, [isAuthenticated]);

    // Update default category when tab changes
    useEffect(() => {
        if (activeTab === 'main') {
            setNewItem(prev => ({ ...prev, category: 'Short Kurtis' }));
        } else if (activeTab === 'baby') {
            setNewItem(prev => ({ ...prev, category: 'Babies Casual' }));
        } else {
            setNewItem(prev => ({ ...prev, category: 'Fabric' }));
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

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "settings", "banner"), (docSnap) => {
            if (docSnap.exists()) {
                setBanner(docSnap.data());
            }
        });
        return () => unsubscribe();
    }, []);

    const handleUpdateBanner = async (e) => {
        e.preventDefault();
        setBannerSaving(true);
        try {
            let finalBanner = { ...banner };

            // Upload banner image if a new one is selected
            if (bannerImageFile) {
                const formData = new FormData();
                formData.append('file', bannerImageFile);
                formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
                formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: 'POST',
                        body: formData
                    }
                );

                if (!response.ok) {
                    throw new Error("Banner image upload failed");
                }

                const data = await response.json();
                finalBanner.image = data.secure_url;
            }

            await setDoc(doc(db, "settings", "banner"), finalBanner);
            setBanner(finalBanner);
            setBannerImageFile(null);
            alert("Banner updated successfully!");
        } catch (err) {
            console.error("Error updating banner:", err);
            alert("Failed to update banner.");
        } finally {
            setBannerSaving(false);
        }
    };

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



    const handleAddProduct = async (e) => {
        e.preventDefault();
        const name = newItem.name.trim();
        const price = Number(newItem.price);
        const description = newItem.description.trim();

        // Check if we have existing images (strings) or new files (Blobs)
        const hasImages = newItem.images.length > 0;

        const isFabric = activeTab === 'fabric';

        // Validation: Price must be > 0 (unless it's a fabric, where we allow 0/empty)
        if (!hasImages || !name || isNaN(price) || (price <= 0 && !isFabric)) {
            setError(isFabric
                ? "Please fill all fields. Add at least one image and a name."
                : "Please fill all fields correctly. Price must be greater than 0."
            );
            return;
        }

        if (name.length > 100) {
            setError("Product name must be under 100 characters.");
            return;
        }

        if (description.length > 1000) {
            setError("Product description must be under 1000 characters.");
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const imageUrls = [];

            // Upload each image to Cloudinary IF it's a new file (not a string URL)
            for (const image of newItem.images) {
                if (typeof image === 'string') {
                    imageUrls.push(image);
                    continue;
                }

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

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Cloudinary Error:", errorData);
                    throw new Error(`Cloudinary upload failed: ${errorData.error?.message || response.statusText}`);
                }

                const data = await response.json();
                if (data.secure_url) {
                    imageUrls.push(data.secure_url);
                }
            }

            // Add to Firestore based on Tab
            const collectionName = activeTab === 'fabric' ? 'fabrics' : 'products';

            const payload = {
                name: newItem.name,
                price: Number(newItem.price), // This is MRP if special offer
                description: newItem.description,
                category: activeTab === 'fabric' ? 'Fabric' : newItem.category,
                unit: newItem.unit || 'meter',
                isSpecialOffer: newItem.specialOffer || false,
                image: imageUrls[0], // Keep primary image for backward compatibility
                images: imageUrls, // Array of all images
                createdAt: new Date().toISOString()
            };

            if (newItem.specialOffer && newItem.discountPrice) {
                payload.discountPrice = Number(newItem.discountPrice);
            }

            if (editingItemId) {
                await setDoc(doc(db, collectionName, editingItemId), {
                    ...payload,
                    updatedAt: new Date().toISOString()
                }, { merge: true });
                alert("Product updated successfully!");
                setEditingItemId(null);
            } else {
                await addDoc(collection(db, collectionName), payload);
                alert("Product added successfully!");
            }

            // Reset Form (maintain current tab category default)
            let defaultCategory = 'Short Kurtis';
            if (activeTab === 'baby') defaultCategory = 'Babies Casual';
            if (activeTab === 'fabric') defaultCategory = 'Fabric';

            setNewItem({
                name: '',
                price: '',
                description: '',
                category: defaultCategory,
                specialOffer: false,
                discountPrice: '',
                images: []
            });
            setEditingItemId(null);
            if (document.getElementById('file-input')) {
                document.getElementById('file-input').value = "";
            }

        } catch (err) {
            console.error("Full Error details:", err);
            setError(err.message || "Failed to upload. Please check console and Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditProduct = (product) => {
        setEditingItemId(product.id);
        setNewItem({
            name: product.name || '',
            price: product.price || '',
            description: product.description || product.details || '',
            category: product.category || 'Short Kurtis',
            unit: product.unit || 'meter',
            specialOffer: product.isSpecialOffer || false,
            discountPrice: product.discountPrice || '',
            images: product.images || (product.image ? [product.image] : [])
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        let defaultCategory = 'Short Kurtis';
        if (activeTab === 'baby') defaultCategory = 'Babies Casual';
        if (activeTab === 'fabric') defaultCategory = 'Fabric';

        setEditingItemId(null);
        setNewItem({
            name: '',
            price: '',
            description: '',
            category: defaultCategory,
            specialOffer: false,
            discountPrice: '',
            images: []
        });
    };
    const handleDeleteProduct = async (id, collectionName = 'products') => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            await deleteDoc(doc(db, collectionName, id));
            if (editingItemId === id) {
                handleCancelEdit();
            }
        } catch (err) {
            console.error("Error deleting item:", err);
            alert("Failed to delete item.");
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
    // For products, we filter by category. For fabrics, we just use the fabrics array.
    const getDisplayItems = () => {
        if (activeTab === 'fabric') return fabrics;

        return products.filter(product => {
            const isBabyProduct = ['Babies Casual', 'Babies Ethnic'].includes(product.category);
            return activeTab === 'baby' ? isBabyProduct : !isBabyProduct;
        });
    };

    const displayItems = getDisplayItems();

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
                        <button
                            onClick={() => setActiveTab('fabric')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'fabric'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Fabrics
                        </button>
                    </div>
                </div>

                {/* Cropper Modal */}
                {showCropper && (
                    <ImageCropper
                        imageSrc={croppingImage}
                        onCropComplete={handleCropComplete}
                        onCancel={handleCropCancel}
                    />
                )}

                {/* Main Content Grid: Form (Left) & Preview (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

                    {/* Form Section */}
                    <div className={`lg:col-span-2 bg-white rounded-xl shadow-md p-6 border-t-4 ${activeTab === 'main' ? 'border-t-indigo-500' : activeTab === 'baby' ? 'border-t-rose-500' : 'border-t-amber-500'
                        }`}>
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            {editingItemId ? <Pencil size={24} className="text-blue-500" /> : <Plus size={24} className={activeTab === 'main' ? 'text-indigo-600' : activeTab === 'baby' ? 'text-rose-500' : 'text-amber-500'} />}
                            {editingItemId ? 'Edit' : 'Add New'} {activeTab === 'main' ? 'Collection' : activeTab === 'baby' ? 'Baby' : 'Fabric'} Product
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

                            {/* Price and Special Offer */}
                            {activeTab !== 'fabric' && (
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                                            <input
                                                type="number"
                                                value={newItem.price}
                                                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder={newItem.specialOffer ? "Original Price (MRP)" : "Selling Price"}
                                            />
                                        </div>
                                        <div className="flex items-center pt-6">
                                            <label className="flex items-center cursor-pointer gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={newItem.specialOffer || false}
                                                    onChange={(e) => setNewItem({ ...newItem, specialOffer: e.target.checked })}
                                                    className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Special Offer?</span>
                                            </label>
                                        </div>
                                    </div>

                                    {newItem.specialOffer && (
                                        <div className="animate-fade-in bg-rose-50 p-4 rounded-lg border border-rose-100">
                                            <label className="block text-sm font-bold text-rose-700 mb-1">Discount Price (₹)</label>
                                            <input
                                                type="number"
                                                value={newItem.discountPrice || ''}
                                                onChange={(e) => setNewItem({ ...newItem, discountPrice: e.target.value })}
                                                className="block w-full border border-rose-300 rounded-md shadow-sm p-3 focus:ring-rose-500 focus:border-rose-500 bg-white"
                                                placeholder="Enter Deal Price"
                                            />
                                            <p className="text-xs text-rose-500 mt-1">This will be the main selling price.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Description */}
                            <div className="md:col-span-2 mt-4">
                                <label className="block text-sm font-medium text-gray-700">Product Description</label>
                                <textarea
                                    value={newItem.description}
                                    maxLength={1000}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    rows={3}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g. Pure Cotton, Dry Clean Only..."
                                />
                                <p className="text-[10px] text-gray-400 text-right mt-1">{newItem.description.length}/1000</p>
                            </div>

                            {/* Category selection */}
                            {activeTab !== 'fabric' && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <div className="flex flex-col gap-2">
                                        <select
                                            value={[
                                                // Main Collection
                                                'Short Kurtis', 'Long Kurtis', 'Suit Sets', 'Anarkali Sets',
                                                'Co-ord Sets', 'One Piece Dress', 'Festive Fits',
                                                // Baby Fits
                                                'Babies Casual', 'Babies Ethnic'
                                            ].includes(newItem.category) ? newItem.category : 'custom'}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === 'custom') {
                                                    setNewItem({ ...newItem, category: '' });
                                                } else {
                                                    setNewItem({ ...newItem, category: val });
                                                }
                                            }}
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
                                                    <option value="custom">Other (Manual)</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="Babies Casual">Babies Casual</option>
                                                    <option value="Babies Ethnic">Babies Ethnic</option>
                                                    <option value="custom">Other (Manual)</option>
                                                </>
                                            )}
                                        </select>

                                        {/* Manual Category Input */}
                                        {![
                                            'Short Kurtis', 'Long Kurtis', 'Suit Sets', 'Anarkali Sets',
                                            'Co-ord Sets', 'One Piece Dress', 'Festive Fits',
                                            'Babies Casual', 'Babies Ethnic'
                                        ].includes(newItem.category) && (
                                                <input
                                                    type="text"
                                                    value={newItem.category}
                                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                                    placeholder="Enter custom category name"
                                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                                />
                                            )}
                                    </div>
                                </div>
                            )}

                            {/* Image Upload & Preview */}
                            <div className="md:col-span-2 space-y-4">
                                <label className="block text-sm font-medium text-gray-700">Product Images (Max 5)</label>

                                {/* Upload Button */}
                                <div className="flex items-center gap-4">
                                    <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm inline-flex items-center transition-colors">
                                        <Upload size={18} className="mr-2" />
                                        Choose Image to Crop & Add
                                        <input
                                            id="file-input"
                                            type="file"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="hidden"
                                            disabled={newItem.images.length >= 5}
                                        />
                                    </label>
                                    <span className="text-xs text-gray-500">
                                        {5 - newItem.images.length} slots remaining
                                    </span>
                                </div>

                                {/* Selected Images List */}
                                {newItem.images.length > 0 && (
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        {newItem.images.map((img, index) => (
                                            <div key={index} className="relative group w-24 h-32 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                                <img
                                                    src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                                                    alt={`Preview ${index}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:bg-gray-400 ${activeTab === 'main'
                                        ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                                        : activeTab === 'baby'
                                            ? 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-500'
                                            : 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500'
                                        }`}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader className="animate-spin mr-2" size={20} /> {editingItemId ? 'Updating...' : 'Uploading...'}
                                        </>
                                    ) : (
                                        <>
                                            {editingItemId ? <Pencil className="mr-2" size={20} /> : <Upload className="mr-2" size={20} />}
                                            {editingItemId ? 'Update' : 'Add to'} {activeTab === 'main' ? 'Collection' : activeTab === 'baby' ? 'Baby Fits' : 'Fabrics'}
                                        </>
                                    )}
                                </button>
                                {editingItemId && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="mt-2 w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Live Preview Section */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                Live Preview
                            </h2>
                            <div className="transform scale-90 origin-top">
                                <ProductCard
                                    product={{
                                        ...newItem,
                                        price: newItem.price || '0',
                                        // Create preview URLs for the images
                                        images: newItem.images.length > 0
                                            ? newItem.images.map(img => typeof img === 'string' ? img : URL.createObjectURL(img))
                                            : ['https://placehold.co/400x500?text=Product+Preview']
                                    }}
                                    index={0}
                                />
                            </div>
                            <p className="text-sm text-gray-500 text-center mt-4">
                                This is how your product will appear on the website.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Banner Management */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Offer Banner</h2>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <form onSubmit={handleUpdateBanner} className="space-y-4">
                        <div className="flex flex-wrap items-center gap-8">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={banner.isActive}
                                    onChange={(e) => setBanner({ ...banner, isActive: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-700 font-bold">Main Banner On/Off</span>
                            </label>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={banner.showText !== false}
                                    onChange={(e) => setBanner({ ...banner, showText: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-700">Show Text</span>
                            </label>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={banner.showImage !== false}
                                    onChange={(e) => setBanner({ ...banner, showImage: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-700">Show Image</span>
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Text</label>
                                <input
                                    type="text"
                                    value={banner.text}
                                    onChange={(e) => setBanner({ ...banner, text: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g. Special Offer: 20% OFF on all items!"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image (Optional)</label>
                                <input
                                    type="file"
                                    onChange={(e) => setBannerImageFile(e.target.files[0])}
                                    accept="image/*"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>
                        </div>
                        {banner.image && !bannerImageFile && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Current Image Preview:</p>
                                <img src={banner.image} alt="Current Banner" className="h-20 rounded-md border border-gray-200" />
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={bannerSaving}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:bg-gray-400"
                        >
                            {bannerSaving ? <Loader className="animate-spin" size={18} /> : null}
                            Update Banner Settings
                        </button>
                    </form>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {activeTab === 'main' ? 'Main Collection' : activeTab === 'baby' ? 'Baby Fits' : 'Fabrics'} Inventory ({displayItems.length})
                </h2>

                {loading ? (
                    <div className="text-center py-10">Loading items...</div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 gap-y-6 md:gap-6">
                        {displayItems.map((product) => (
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
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={() => handleEditProduct(product)}
                                            className="flex-1 flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                                        >
                                            <Pencil size={18} className="mr-2" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id, activeTab === 'fabric' ? 'fabrics' : 'products')}
                                            className="flex-1 flex items-center justify-center p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 size={18} className="mr-2" /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {displayItems.length === 0 && (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No items found in this section.
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
