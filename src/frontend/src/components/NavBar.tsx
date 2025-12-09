import React from 'react';
import { Menu, X } from 'lucide-react';

export const NavBar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <span className="font-semibold text-xl tracking-tight">VoiceAgent</span>
                    </div>
                    <div className="hidden md:flex space-x-8">
                        <a href="#" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Features</a>
                        <a href="#" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Enterprise</a>
                        <a href="#" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Pricing</a>
                        <button className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                            Get Started
                        </button>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-black">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
