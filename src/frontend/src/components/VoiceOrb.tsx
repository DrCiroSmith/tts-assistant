import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { clsx } from 'clsx';

interface VoiceOrbProps {
    onActivate?: () => void;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({ onActivate }) => {
    const [isActive, setIsActive] = useState(false);

    const handleClick = useCallback(() => {
        setIsActive(prev => !prev);
        onActivate?.();
    }, [onActivate]);

    const buttonClassName = useMemo(() => clsx(
        'relative z-10 w-24 h-24 rounded-full flex items-center justify-center',
        'text-white shadow-2xl cursor-pointer transition-all',
        'focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-4',
        isActive ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black hover:bg-gray-800'
    ), [isActive]);

    const rippleClassName = useMemo(() => clsx(
        'absolute border rounded-full',
        isActive ? 'border-blue-500/50' : 'border-blue-500/30'
    ), [isActive]);

    return (
        <div 
            className="relative flex items-center justify-center w-64 h-64"
            role="region"
            aria-label="Voice assistant activation"
        >
            {/* Glowing Background */}
            <motion.div
                className="absolute w-full h-full orb-glow rounded-full"
                animate={{
                    scale: isActive ? [1, 1.3, 1] : [1, 1.2, 1],
                    opacity: isActive ? [0.7, 1, 0.7] : [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: isActive ? 1.5 : 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                aria-hidden="true"
            />

            {/* Core Orb */}
            <motion.button
                className={buttonClassName}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onClick={handleClick}
                aria-pressed={isActive}
                aria-label={isActive ? 'Voice assistant active. Click to deactivate.' : 'Click to activate voice assistant'}
            >
                <Mic size={32} aria-hidden="true" />
                <span className="sr-only">
                    {isActive ? 'Voice assistant is active' : 'Activate voice assistant'}
                </span>
            </motion.button>

            {/* Ripple Rings */}
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    className={rippleClassName}
                    style={{ width: '100%', height: '100%' }}
                    animate={{
                        scale: [1, 1.5],
                        opacity: [isActive ? 0.7 : 0.5, 0],
                    }}
                    transition={{
                        duration: isActive ? 1 : 2,
                        repeat: Infinity,
                        delay: i * (isActive ? 0.2 : 0.4),
                        ease: "easeOut",
                    }}
                    aria-hidden="true"
                />
            ))}

            {/* Status indicator */}
            {isActive && (
                <motion.div
                    className="absolute -bottom-8 text-sm font-medium text-blue-600"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                >
                    Listening...
                </motion.div>
            )}
        </div>
    );
};
