import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Collection from '../components/Collection';
import BabiesCollection from '../components/BabiesCollection';
import MomMiniCollection from '../components/MomMiniCollection';
import CustomOrder from '../components/CustomOrder';
import FabricsCollection from '../components/FabricsCollection';
import Features from '../components/Features';
import HowToOrder from '../components/HowToOrder';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import OfferBanner from '../components/OfferBanner';

function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main>
                <Hero />
                <OfferBanner />
                <Collection />
                <BabiesCollection />
                <MomMiniCollection />
                <CustomOrder />
                <FabricsCollection />
                <Features />
                <HowToOrder />
                <Reviews />
            </main>

            <Footer />
        </div>
    );
}

export default HomePage;
