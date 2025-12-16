import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
    {
        name: 'Ananya Sharma',
        rating: 5,
        text: 'Loved the fabric quality and fitting. The dress looks exactly like the picture! Highly recommended!',
    },
    {
        name: 'Priya Verma',
        rating: 5,
        text: 'Super comfortable and trendy designs. Delivery was quick and the packaging was cute.',
    },
    {
        name: 'Suhani Kapoor',
        rating: 4,
        text: 'Great collection for girls. Ordered a party gown and it fits perfectly. Will shop again.',
    },
];

const Reviews = () => {
    return (
        <section id="reviews" className="py-20 bg-ashvi-pink/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold text-ashvi-dark mb-4">
                        Happy Customers
                    </h2>
                    <p className="text-gray-500">What our girls say about us</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-ashvi-pink/10 relative"
                        >
                            <div className="flex mb-4 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={20}
                                        fill={i < review.rating ? "currentColor" : "none"}
                                        className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600 mb-6 italic">
                                "{review.text}"
                            </p>
                            <div className="font-semibold text-ashvi-dark">
                                {review.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reviews;
