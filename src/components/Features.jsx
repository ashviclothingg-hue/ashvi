import React from 'react';
import { Sparkles, ShieldCheck, Smile, MessageCircleHeart } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <Sparkles size={40} className="text-ashvi-pink" />,
        title: 'Trendy Designs',
        description: 'Fresh styles that keep you ahead of fashion trends.',
    },
    {
        icon: <ShieldCheck size={40} className="text-ashvi-pink" />,
        title: 'Premium Quality',
        description: 'High-quality fabrics that last long and look great.',
    },
    {
        icon: <Smile size={40} className="text-ashvi-pink" />,
        title: 'Comfortable Fit',
        description: 'Designed for all-day wear with perfect fitting.',
    },
    {
        icon: <MessageCircleHeart size={40} className="text-ashvi-pink" />,
        title: 'Instant Support',
        description: 'Fast WhatsApp support for all your queries.',
    },
];

const Features = () => {
    return (
        <section id="features" className="py-20 bg-ashvi-light/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold text-ashvi-dark mb-4">
                        Why Shop with ASHVI?
                    </h2>
                    <div className="w-20 h-1 bg-ashvi-pink mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-8 rounded-2xl shadow-soft text-center group border border-transparent hover:border-ashvi-pink/20 transition-all"
                        >
                            <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform">
                                <div className="p-4 bg-ashvi-pink/10 rounded-full">
                                    {feature.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-ashvi-dark">
                                {feature.title}
                            </h3>
                            <p className="text-gray-500">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
