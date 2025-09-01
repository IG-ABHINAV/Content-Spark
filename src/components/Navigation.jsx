import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import {
  Sparkles,
  History,
  Calendar,
  FileText,
  Lightbulb,
  BarChart3,
  Download,
  Home,
} from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useTheme();

  const navItems = [
    { 
      path: '/history', 
      label: 'History', 
      icon: History 
    },
    { 
      path: '/calendar', 
      label: 'Calendar', 
      icon: Calendar 
    },
    { 
      path: '/templates', 
      label: 'Templates', 
      icon: FileText 
    },
    { 
      path: '/suggestions', 
      label: 'Suggestions', 
      icon: Lightbulb 
    },
    { 
      path: '/insights', 
      label: 'Insights', 
      icon: BarChart3 
    },
    { 
      path: '/export', 
      label: 'Export', 
      icon: Download 
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`sticky top-0 z-50 ${colors.nav.background} border-b ${colors.nav.border} px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className={`text-xl font-bold ${colors.text.primary}`}>
              Content Spark
            </span>
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <motion.button
                key={path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(path)}
                className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isActive(path)
                    ? `${colors.nav.itemActive} shadow-sm`
                    : colors.nav.item
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{label}</span>
                
                {isActive(path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl border"
                    style={{
                      borderColor: 'rgb(59 130 246 / 0.5)'
                    }}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-xl ${colors.button.secondary} ${colors.button.secondaryHover} transition-all duration-300`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Home/Generator Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(location.pathname === '/' ? '/generator' : '/')}
              className={`px-4 py-2 ${colors.button.primary} ${colors.button.primaryHover} rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 text-sm`}
            >
              {location.pathname === '/' ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate</span>
                </>
              ) : (
                <>
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="lg:hidden border-t border-gray-200/10 mt-2 pt-2">
          <div className="flex flex-wrap gap-2 pb-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <motion.button
                key={path}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(path)}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 text-xs ${
                  isActive(path)
                    ? `${colors.nav.itemActive} shadow-sm`
                    : colors.nav.item
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
