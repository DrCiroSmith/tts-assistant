import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

export const VoiceOrb = () => {
    return (
        <div className="relative flex items-center justify-center w-64 h-64">
            {/* Glowing Background */}
            <motion.div
                className="absolute w-full h-full orb-glow rounded-full"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Core Orb */}
            <motion.button
                className="relative z-10 w-24 h-24 bg-black rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer hover:scale-105 transition-transform"
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Mic size={32} />
            </motion.button>

            {/* Ripple Rings */}
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    className="absolute border border-blue-500/30 rounded-full"
                    style={{ width: '100%', height: '100%' }}
                    animate={{
                        scale: [1, 1.5],
                        opacity: [0.5, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeOut",
                    }}
                />
            ))}
        </div>
    );
};
