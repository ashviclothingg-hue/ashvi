import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-28 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-ashvi-dark mb-4">
                            Terms and Conditions
                        </h1>
                        <div className="w-20 h-1 bg-ashvi-pink mx-auto rounded-full"></div>
                        <p className="mt-6 text-gray-600">
                            Welcome to Ashvi. By placing an order with us, you agree to the following terms and conditions:
                        </p>
                    </div>

                    <div className="bg-ashvi-light/30 rounded-2xl p-8 md:p-12 shadow-sm space-y-10 text-gray-700 leading-relaxed">

                        {/* Section 1 */}
                        <section>
                            <h2 className="text-xl font-bold text-ashvi-dark mb-4 border-l-4 border-ashvi-pink pl-3">
                                1. Products & Orders
                            </h2>
                            <ul className="list-disc list-outside ml-5 space-y-2">
                                <li>All products are handcrafted / made-to-order.</li>
                                <li>We accept custom orders based on your selected size, fabric, and design preferences.</li>
                                <li>Please provide accurate measurements and details. Any errors caused by wrong information provided by the customer are the customer’s responsibility.</li>
                                <li>All images on our website / social media are for illustration purposes only. Slight variations in color, fabric, or design may occur.</li>
                            </ul>
                        </section>

                        <div className="border-b border-gray-200"></div>

                        {/* Section 2 */}
                        <section>
                            <h2 className="text-xl font-bold text-ashvi-dark mb-4 border-l-4 border-ashvi-pink pl-3">
                                2. Order Confirmation & Payment
                            </h2>
                            <ul className="list-disc list-outside ml-5 space-y-2">
                                <li>Orders are confirmed only after full payment or as per the agreed payment terms.</li>
                                <li>We accept UPI, GPay, PhonePe, and COD (if available).</li>
                                <li>Prices are subject to change without prior notice.</li>
                            </ul>
                        </section>

                        <div className="border-b border-gray-200"></div>

                        {/* Section 3 */}
                        <section>
                            <h2 className="text-xl font-bold text-ashvi-dark mb-4 border-l-4 border-ashvi-pink pl-3">
                                3. Production & Delivery
                            </h2>
                            <ul className="list-disc list-outside ml-5 space-y-2">
                                <li>Production time: 7–10 days for made-to-order items (can vary based on order volume).</li>
                                <li>Shipping is PAN India. Delivery time may vary depending on location and courier service.</li>
                                <li>Customers will receive a tracking number (if applicable) once the order is dispatched.</li>
                            </ul>
                        </section>

                        <div className="border-b border-gray-200"></div>

                        {/* Section 4 */}
                        <section>
                            <h2 className="text-xl font-bold text-ashvi-dark mb-4 border-l-4 border-ashvi-pink pl-3">
                                4. Returns & Exchanges
                            </h2>
                            <ul className="list-disc list-outside ml-5 space-y-2">
                                <li>Due to the customized nature of our products, returns or exchanges are not accepted unless there is a manufacturing defect.</li>
                                <li>Any manufacturing defects must be reported within 2 days of receiving the product, with photos.</li>
                                <li>We reserve the right to inspect and verify defects before offering a replacement or refund.</li>
                            </ul>
                        </section>

                        <div className="border-b border-gray-200"></div>

                        {/* Section 5 */}
                        <section>
                            <h2 className="text-xl font-bold text-ashvi-dark mb-4 border-l-4 border-ashvi-pink pl-3">
                                5. Cancellations
                            </h2>
                            <ul className="list-disc list-outside ml-5 space-y-2">
                                <li>Orders can be cancelled within 24 hours of confirmation.</li>
                                <li>Custom / personalized orders cannot be cancelled once stitching/production has started.</li>
                            </ul>
                        </section>

                        <div className="border-b border-gray-200"></div>

                        {/* Section 6 */}
                        <section>
                            <h2 className="text-xl font-bold text-ashvi-dark mb-4 border-l-4 border-ashvi-pink pl-3">
                                6. Liability
                            </h2>
                            <ul className="list-disc list-outside ml-5 space-y-2">
                                <li>Ashvi is not responsible for delays caused by courier services, natural calamities, or unforeseen circumstances.</li>
                                <li>All disputes will be handled in accordance with Indian law.</li>
                            </ul>
                        </section>

                        <div className="border-b border-gray-200"></div>

                        {/* Section 7 */}
                        <section>
                            <h2 className="text-xl font-bold text-ashvi-dark mb-4 border-l-4 border-ashvi-pink pl-3">
                                7. Privacy Policy
                            </h2>
                            <ul className="list-disc list-outside ml-5 space-y-2">
                                <li>Customer information, including contact details and address, will only be used for order processing and delivery.</li>
                                <li>We do not share personal information with third parties for marketing purposes.</li>
                            </ul>
                        </section>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TermsAndConditions;
