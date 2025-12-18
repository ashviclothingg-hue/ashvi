import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Collection from '../components/Collection';
import BabiesCollection from '../components/BabiesCollection';
import Features from '../components/Features';
import HowToOrder from '../components/HowToOrder';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import { MessageCircle } from 'lucide-react';

function HomePage() {
    const whatsappNumber = "917803024406";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20I%20want%20to%20order%20from%20ASHVI`;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main>
                <Hero />
                <Collection />
                <BabiesCollection />
                <Features />
                <HowToOrder />
                <Reviews />
            </main>

            <Footer />

            {/* Sticky WhatsApp Button */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition-all hover:scale-110 flex items-center justify-center"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle size={32} />
            </a>
        </div>
    );
}

export default HomePage;
