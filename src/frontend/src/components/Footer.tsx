import { Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-apple-dark text-white py-16" role="contentinfo">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="font-semibold text-xl tracking-tight mb-4">VoiceAgent</h3>
                        <p className="text-gray-400 max-w-md">
                            Intelligent, human-like conversations for your business. 
                            Available 24/7 to qualify leads and connect customers.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#enterprise" className="hover:text-white transition-colors">Enterprise</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li className="flex items-center gap-2">
                                <Phone size={16} aria-hidden="true" />
                                <a href="tel:+1-800-555-0123" className="hover:text-white transition-colors">
                                    +1 (800) 555-0123
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} aria-hidden="true" />
                                <a href="mailto:hello@voiceagent.ai" className="hover:text-white transition-colors">
                                    hello@voiceagent.ai
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin size={16} aria-hidden="true" />
                                <span>Miami, FL</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
                    <p>&copy; {currentYear} VoiceAgent. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
