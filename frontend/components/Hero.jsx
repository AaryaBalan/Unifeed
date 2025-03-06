import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HeroPage() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#792a1d] to-[#ff371a] text-center p-6">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl"
            >
                <h1 className="text-5xl font-extrabold text-white leading-tight">
                    Experience the New Era of Social Media
                </h1>
                <p className="text-gray-100 mt-4 text-lg">
                 the Power of Unifeed – All the content you love, One Tap Away!
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-8 flex gap-4"
            >
                <button
                    onClick={() => navigate('/login')}
                    className="bg-white text-[#ff371a] px-6 py-3 rounded-xl text-lg shadow-md hover:bg-gray-200 transition"
                >
                    Login
                </button>
                <button
                    onClick={() => navigate('/signup')}
                    className="bg-white text-[#ff371a] px-6 py-3 rounded-xl text-lg shadow-md hover:bg-gray-200 transition"
                >
                    Sign Up
                </button>
            </motion.div>
        </div>
    );
}