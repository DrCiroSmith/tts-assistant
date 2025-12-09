import { motion } from 'framer-motion';
import { VoiceOrb } from './VoiceOrb';

export const Hero = () => {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center pt-16 bg-white overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center px-4 max-w-4xl mx-auto"
            >
                <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 text-black">
                    Your business. <br />
                    <span className="text-gray-500">Now with a voice.</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto mb-12">
                    Intelligent, human-like conversations for your customers.
                    Available 24/7.
                </p>
            </motion.div>

            <div className="mt-8 mb-16">
                <VoiceOrb />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 text-sm text-gray-400"
            >
                Scroll to explore
            </motion.div>
        </section>
    );
};
