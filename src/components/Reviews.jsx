import React, { useState, useEffect } from 'react';
import { Star, Upload, X, Loader, Camera } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [newReview, setNewReview] = useState({
        name: '',
        rating: 5,
        text: '',
        image: null
    });

    // Fetch Reviews
    useEffect(() => {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reviewsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReviews(reviewsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setNewReview({ ...newReview, image: e.target.files[0] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = newReview.name.trim();
        const text = newReview.text.trim();

        if (!name || !text) {
            setError("Please fill in your name and review.");
            return;
        }

        if (name.length > 50) {
            setError("Name must be under 50 characters.");
            return;
        }

        if (text.length > 500) {
            setError("Review must be under 500 characters.");
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            let imageUrl = null;

            if (newReview.image) {
                const formData = new FormData();
                formData.append('file', newReview.image);
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
                imageUrl = data.secure_url;
            }

            await addDoc(collection(db, "reviews"), {
                name: name,
                rating: newReview.rating,
                text: text,
                image: imageUrl,
                createdAt: new Date().toISOString()
            });

            setShowModal(false);
            setNewReview({ name: '', rating: 5, text: '', image: null });
            alert("Thank you for your review!");

        } catch (err) {
            console.error("Error submitting review:", err);
            setError("Failed to submit review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="reviews" className="py-20 bg-ashvi-pink/5 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold text-ashvi-dark mb-4">
                        Happy Customers
                    </h2>
                    <p className="text-gray-500 mb-8">What our girls say about us</p>

                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-ashvi-dark text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all hover:scale-105 shadow-lg flex items-center mx-auto gap-2"
                    >
                        <Camera size={20} />
                        Write a Review
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">Be the first to review!</div>
                ) : (
                    <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-6 snap-x snap-mandatory scrollbar-hide">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-ashvi-pink/10 flex flex-col h-full min-w-[85%] sm:min-w-[45%] md:min-w-0 snap-center"
                            >
                                <div className="flex mb-4 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            fill={i < review.rating ? "currentColor" : "none"}
                                            className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                                        />
                                    ))}
                                </div>

                                <p className="text-gray-600 mb-6 italic flex-grow">
                                    "{review.text}"
                                </p>

                                {review.image && (
                                    <div className="mb-4 rounded-lg overflow-hidden h-48 w-full bg-gray-50">
                                        <img
                                            src={review.image}
                                            alt="Review attachment"
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}

                                <div className="font-semibold text-ashvi-dark border-t pt-4 border-gray-100">
                                    {review.name}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Write Review Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-6">Write a Review</h3>

                        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                <input
                                    type="text"
                                    maxLength={50}
                                    value={newReview.name}
                                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-ashvi-pink focus:border-ashvi-pink"
                                    placeholder="Enter your name"
                                    required
                                />
                                <p className="text-[10px] text-gray-400 text-right mt-1">{newReview.name.length}/50</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={28}
                                                fill={star <= newReview.rating ? "#FBBF24" : "none"}
                                                className={star <= newReview.rating ? "text-yellow-400" : "text-gray-300"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                                <textarea
                                    value={newReview.text}
                                    maxLength={500}
                                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-ashvi-pink focus:border-ashvi-pink"
                                    placeholder="Share your experience..."
                                    required
                                />
                                <p className="text-[10px] text-gray-400 text-right mt-1">{newReview.text.length}/500</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Add a Photo (Optional)</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Upload className="text-gray-400" size={24} />
                                        <span className="text-sm text-gray-500">
                                            {newReview.image ? newReview.image.name : "Click to upload image"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-ashvi-dark text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <Loader className="animate-spin" size={20} /> Publishing...
                                    </>
                                ) : (
                                    "Submit Review"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Reviews;
