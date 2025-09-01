import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Home, Rocket, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound404 = () => {

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const rocketVariants = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-lg w-full text-center relative z-10"
      >
        {/* 404 Illustration */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div
            variants={rocketVariants}
            initial="initial"
            animate="animate"
            className="mx-auto"
          >
            <Rocket className="w-24 h-24 text-blue-400" />
          </motion.div>
          <h1 className="text-8xl font-extrabold mt-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-semibold mb-4 text-white">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Looks like you've ventured into uncharted space. The page you're
            looking for doesn't exist—or maybe it's just hiding!
          </p>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="space-y-4">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl flex items-center justify-center shadow-2xl font-semibold"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </motion.button>
          </Link>
        </motion.div>

        {/* Subtle Warning */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex items-center justify-center text-sm text-gray-400"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Error Code: 404 - Resource Not Found
        </motion.div>
        
        {/* Content Spark Branding */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 flex items-center justify-center"
        >
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-2">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-white font-semibold">Content Spark</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound404;