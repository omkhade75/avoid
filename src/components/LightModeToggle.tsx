import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const LightModeToggle = () => {
    const [isLight, setIsLight] = useState(false);

    useEffect(() => {
        if (isLight) {
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.remove('light');
        }
    }, [isLight]);

    const toggleTheme = () => {
        setIsLight(!isLight);
    };

    return (
        <motion.div
            className="fixed bottom-8 right-8 z-50"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
        >
            <motion.button
                onClick={toggleTheme}
                className="light-mode-toggle group"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    initial={false}
                    animate={{
                        rotate: isLight ? 180 : 0,
                        scale: isLight ? 0 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute"
                >
                    <Moon className="h-6 w-6 text-primary" />
                </motion.div>

                <motion.div
                    initial={false}
                    animate={{
                        rotate: isLight ? 0 : -180,
                        scale: isLight ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute"
                >
                    <Sun className="h-6 w-6 text-yellow-400" />
                </motion.div>

                {/* Glow effect */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                        boxShadow: isLight
                            ? "0 0 30px rgba(251, 191, 36, 0.4), 0 0 60px rgba(251, 191, 36, 0.2)"
                            : "0 0 30px rgba(255, 51, 153, 0.4), 0 0 60px rgba(255, 51, 153, 0.2)",
                    }}
                    transition={{ duration: 0.3 }}
                />
            </motion.button>

            {/* Tooltip */}
            <motion.div
                className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg glass text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                initial={{ opacity: 0, y: 5 }}
                whileHover={{ opacity: 1, y: 0 }}
            >
                {isLight ? "Dark Mode" : "Light Mode"}
            </motion.div>
        </motion.div>
    );
};
