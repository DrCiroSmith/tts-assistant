import React from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => (
    <a
        href={href}
        onClick={onClick}
        className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
    >
        {children}
    </a>
);

export const NavBar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const closeMenu = () => setIsOpen(false);

    // Close menu on escape key
    React.useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <nav 
            className="fixed top-0 w-full z-50 glass-nav transition-all duration-300"
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <span className="font-semibold text-xl tracking-tight">VoiceAgent</span>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <NavLink href="#features">Features</NavLink>
                        <NavLink href="#enterprise">Enterprise</NavLink>
                        <NavLink href="#pricing">Pricing</NavLink>
                        <button 
                            className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                            aria-label="Get started with VoiceAgent"
                        >
                            Get Started
                        </button>
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="text-gray-500 hover:text-black p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black rounded-md"
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu"
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden bg-white border-t border-gray-100"
                        role="menu"
                    >
                        <div className="px-4 py-4 space-y-4">
                            <a 
                                href="#features" 
                                className="block text-base font-medium text-gray-500 hover:text-black transition-colors py-2"
                                onClick={closeMenu}
                                role="menuitem"
                            >
                                Features
                            </a>
                            <a 
                                href="#enterprise" 
                                className="block text-base font-medium text-gray-500 hover:text-black transition-colors py-2"
                                onClick={closeMenu}
                                role="menuitem"
                            >
                                Enterprise
                            </a>
                            <a 
                                href="#pricing" 
                                className="block text-base font-medium text-gray-500 hover:text-black transition-colors py-2"
                                onClick={closeMenu}
                                role="menuitem"
                            >
                                Pricing
                            </a>
                            <button 
                                className="w-full bg-black text-white px-4 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                onClick={closeMenu}
                                role="menuitem"
                            >
                                Get Started
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
