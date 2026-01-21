import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Palette, Ruler } from 'lucide-react';
import customFabricImg from '../assets/custom_fabric.png';

const CustomOrder = () => {
    const whatsappNumber = "917803024406";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20I%20am%20interested%20in%20custom%20tailoring`;

    const features = [
        {
            icon: <Palette className="w-6 h-6 text-ashvi-pink" />,
            title: "Your Design, Our Craft",
            desc: "Have a design in mind? Share it with us and we'll bring it to life."
        },
        {
            icon: <Ruler className="w-6 h-6 text-ashvi-pink" />,
            title: "Perfect Fit Guarantee",
            desc: "Made-to-measure services ensuring a flawless fit for every body type."
        },
        {
            icon: <Scissors className="w-6 h-6 text-ashvi-pink" />,
            title: "Expert Craftsmanship",
            desc: "Detailed stitching and finishing by our master tailors."
        }
    ];

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Image Section */}
                    <div className="w-full lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10 rounded-2xl overflow-hidden shadow-xl"
                        >
                            <img
                                src={customFabricImg}
                                alt="Custom Tailoring Service"
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>
                        {/* Decorative Background Element - Hidden on mobile to prevent overflow/clutter */}
                        <div className="hidden lg:block absolute -top-10 -left-10 w-full h-full border-2 border-ashvi-pink/30 rounded-2xl z-0 transform translate-x-4 translate-y-4"></div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-ashvi-dark mb-6 leading-tight">
                                Custom <span className="text-ashvi-pink">Tailoring Service</span>
                            </h2>
                            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                Don't fit into standard sizes? Or want something unique?
                                We specialize in custom stitching. Choose from our fabrics or bring your own design ideas.
                            </p>

                            <div className="space-y-6 mb-10">
                                {features.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 + (index * 0.1) }}
                                        className="flex flex-col md:flex-row items-center md:items-start gap-4"
                                    >
                                        <div className="p-3 bg-ashvi-light rounded-full shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-ashvi-dark text-lg">{item.title}</h4>
                                            <p className="text-gray-500 text-sm">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-3 bg-ashvi-dark text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all hover:bg-black mx-auto lg:mx-0"
                            >
                                Start Custom Order
                                <Scissors size={20} />
                            </motion.a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomOrder;
