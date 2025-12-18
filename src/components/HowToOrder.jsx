import React from 'react';
import { MousePointerClick, MessageSquare, Truck } from 'lucide-react';

const steps = [
    {
        icon: <MousePointerClick size={32} />,
        title: 'Select Favorite Dress',
        description: 'Browse our collection and pick what you love.',
    },
    {
        icon: <MessageSquare size={32} />,
        title: 'Click "Order"',
        description: 'Tap the WhatsApp button on the product card.',
    },
    {
        icon: <Truck size={32} />,
        title: 'Share Details',
        description: 'Send us your size and address to confirm order.',
    },
];

const HowToOrder = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold text-ashvi-dark mb-4">
                        How to Order
                    </h2>
                    <p className="text-gray-500">ordering is simple and personal</p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-ashvi-pink/20 -z-10 transform -translate-y-1/2"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center bg-white p-6 my-4 w-full md:w-1/3">
                            <div className="w-16 h-16 bg-ashvi-pink text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold shadow-lg">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-ashvi-dark">
                                {step.title}
                            </h3>
                            <p className="text-gray-500 px-4">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowToOrder;
