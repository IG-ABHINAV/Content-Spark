import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import {
  Sparkles,
  Rocket,
  Zap,
  Globe,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Lightbulb,
  Target,
  Clock,
  Award,
  FileText,
  History,
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
  };

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast Generation",
      description: "Create content in seconds with our advanced AI technology",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Professional Templates",
      description: "Choose from hundreds of industry-specific templates for instant inspiration",
      gradient: "from-blue-400 to-purple-500"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Audience Targeting",
      description: "Tailor your content to specific audiences for maximum engagement",
      gradient: "from-green-400 to-teal-500"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Conversion Optimized",
      description: "Generate content designed to drive engagement and conversions",
      gradient: "from-cyan-400 to-blue-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Content Creator",
      content: "Content Spark transformed my workflow! I can create a week's worth of content in just minutes.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      role: "Digital Marketer",
      content: "The quality of generated content is incredible. My engagement rates have increased by 300%!",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emma Rodriguez",
      role: "Social Media Manager",
      content: "This tool is a game-changer. I can focus on strategy while Content Spark handles the creative work.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const stats = [
    { number: "50K+", label: "Content Pieces Generated", icon: <Sparkles className="h-6 w-6" /> },
    { number: "10K+", label: "Happy Creators", icon: <Users className="h-6 w-6" /> },
    { number: "300%", label: "Average Engagement Boost", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "99.9%", label: "Uptime Guarantee", icon: <Award className="h-6 w-6" /> }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.background} overflow-hidden transition-all duration-500`}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Content Spark</span>
        </div>
        <div className="flex gap-4">
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/history')}
            className={`px-6 py-3 ${colors.button.secondary} ${colors.text.primary} rounded-full font-semibold ${colors.button.hover} transition-all duration-300 flex items-center`}
          >
            <History className="h-5 w-5 mr-2" />
            History
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/templates')}
            className={`px-6 py-3 ${colors.button.secondary} ${colors.text.primary} rounded-full font-semibold ${colors.button.hover} transition-all duration-300 flex items-center`}
          >
            <FileText className="h-5 w-5 mr-2" />
            Templates
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/generator')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-10 text-center py-20 px-6 max-w-6xl mx-auto"
      >
        <motion.div variants={fadeInUp} className="mb-8">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30 mb-6">
            ✨ Powered by Advanced AI Technology
          </span>
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Create Viral Content
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 text-transparent bg-clip-text">
              In Seconds
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Transform your ideas into high-converting content for any platform. 
            Generate catchy titles, engaging descriptions, and trending hashtags with the power of AI.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/generator')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold text-lg shadow-2xl flex items-center justify-center group"
          >
            <Rocket className="h-6 w-6 mr-2 group-hover:animate-bounce" />
            Start Creating Now
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/templates')}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold text-lg border border-white/20 flex items-center justify-center group"
          >
            <FileText className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
            Browse Templates
          </motion.button>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <div className="flex justify-center mb-3 text-blue-400">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                Content Creators
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to create engaging content that converts and captivates your audience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 group cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Three simple steps to create amazing content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Enter Your Topic",
                description: "Simply type in your content idea or let our AI suggest trending topics",
                icon: <Lightbulb className="h-8 w-8" />
              },
              {
                step: "02",
                title: "Customize Settings",
                description: "Choose your platform, tone, target audience, and content length",
                icon: <Target className="h-8 w-8" />
              },
              {
                step: "03",
                title: "Generate & Use",
                description: "Get instant titles, descriptions, and hashtags ready to publish",
                icon: <Rocket className="h-8 w-8" />
              }
            ].map((item, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 px-6 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Loved by Creators
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of content creators who are already creating viral content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Go Viral?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the content revolution and start creating engaging posts that your audience will love
            </p>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(168, 85, 247, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/generator')}
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold text-xl shadow-2xl group"
            >
              <Zap className="h-6 w-6 mr-3 group-hover:animate-pulse" />
              Start Creating for Free
              <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </motion.button>
            <p className="text-sm text-gray-400 mt-4">
              No credit card required • Generate unlimited content
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Content Spark</span>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering creators with AI-driven content generation
          </p>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Content Spark. All rights reserved. • Powered by Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
