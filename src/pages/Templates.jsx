import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../contexts/ThemeContext';
import {
  Sparkles,
  FileText,
  Users,
  Briefcase,
  Heart,
  Camera,
  Music,
  Code,
  TrendingUp,
  Star,
  Search,
  Filter,
  ArrowRight,
  Home,
  Copy,
  Check,
  ArrowLeft,
  Plus,
  Bookmark,
  BookmarkPlus,
  Eye,
  Download,
  Edit,
  Trash2,
  X,
  ChevronDown,
  History,
  BarChart3
} from "lucide-react";

const Templates = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedTemplate, setCopiedTemplate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [bookmarkedTemplates, setBookmarkedTemplates] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  
  // New template form state
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'business',
    platform: 'All Platforms',
    tone: 'Professional',
    title: '',
    description_template: '',
    hashtags: '',
    tags: ''
  });

  const categories = [
    { id: "all", name: "All Templates", icon: <FileText className="h-5 w-5" /> },
    { id: "business", name: "Business", icon: <Briefcase className="h-5 w-5" /> },
    { id: "lifestyle", name: "Lifestyle", icon: <Heart className="h-5 w-5" /> },
    { id: "tech", name: "Technology", icon: <Code className="h-5 w-5" /> },
    { id: "entertainment", name: "Entertainment", icon: <Music className="h-5 w-5" /> },
    { id: "photography", name: "Photography", icon: <Camera className="h-5 w-5" /> },
    { id: "fitness", name: "Fitness", icon: <TrendingUp className="h-5 w-5" /> },
  ];

  const templates = [
    {
      id: 1,
      name: "Product Launch Announcement",
      category: "business",
      description: "Perfect for announcing new products or services",
      platform: "All Platforms",
      tone: "Professional",
      template: {
        title: "🚀 Introducing [Product Name] - The Future is Here!",
        description: "We're thrilled to announce the launch of [Product Name]! After months of development, we're ready to revolutionize [industry/problem]. Get ready for [key benefit] like never before. #Innovation #Launch #[YourBrand]",
        hashtags: ["#ProductLaunch", "#Innovation", "#NewProduct", "#TechNews", "#Startup"]
      },
      rating: 4.9,
      uses: "12.5K"
    },
    {
      id: 2,
      name: "Behind the Scenes Content",
      category: "lifestyle",
      description: "Show your audience the real you",
      platform: "Instagram/TikTok",
      tone: "Casual",
      template: {
        title: "Behind the Scenes: How I Really [Activity/Work]",
        description: "You guys always ask me about my daily routine, so here's an honest look at how I really [activity]. It's not always glamorous, but it's real! What would you like to see more of? Comment below! ✨",
        hashtags: ["#BehindTheScenes", "#RealLife", "#DayInTheLife", "#Authentic", "#Content"]
      },
      rating: 4.8,
      uses: "8.3K"
    },
    {
      id: 3,
      name: "Tutorial/How-To Guide",
      category: "tech",
      description: "Educational content that provides value",
      platform: "YouTube/LinkedIn",
      tone: "Informative",
      template: {
        title: "Complete Guide: How to [Skill/Task] in [Time Frame]",
        description: "Master [skill/task] with this step-by-step guide! Whether you're a beginner or looking to improve, this tutorial covers everything you need to know. Save this post for later and share with someone who needs to see this! 🎯",
        hashtags: ["#Tutorial", "#HowTo", "#Learn", "#Education", "#Tips"]
      },
      rating: 4.9,
      uses: "15.2K"
    }
  ];

  // Load custom templates and bookmarks from localStorage
  useEffect(() => {
    const savedCustomTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedTemplates') || '[]');
    setCustomTemplates(savedCustomTemplates);
    setBookmarkedTemplates(savedBookmarks);
  }, []);

  // Combine built-in and custom templates
  const allTemplates = [...templates, ...customTemplates];

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const useTemplate = (template) => {
    // Store the template data to be used in the generator
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
    navigate('/generator?template=true');
  };

  const copyTemplate = (template) => {
    const content = `Title: ${template.template.title}\n\nDescription: ${template.template.description}\n\nHashtags: ${template.template.hashtags.join(' ')}`;
    navigator.clipboard.writeText(content);
    setCopiedTemplate(template.id);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  // Toggle bookmark function
  const toggleBookmark = (templateId) => {
    const newBookmarks = bookmarkedTemplates.includes(templateId)
      ? bookmarkedTemplates.filter(id => id !== templateId)
      : [...bookmarkedTemplates, templateId];
    
    setBookmarkedTemplates(newBookmarks);
    localStorage.setItem('bookmarkedTemplates', JSON.stringify(newBookmarks));
  };

  // Create custom template
  const createTemplate = () => {
    if (!newTemplate.name || !newTemplate.description_template) {
      alert('Please fill in the required fields (Name and Description Template)');
      return;
    }

    const template = {
      id: `custom-${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description,
      category: newTemplate.category,
      platform: newTemplate.platform,
      tone: newTemplate.tone,
      template: {
        title: newTemplate.title,
        description: newTemplate.description_template,
        hashtags: newTemplate.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag)
      },
      rating: 0,
      uses: '0',
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    const updatedCustomTemplates = [...customTemplates, template];
    setCustomTemplates(updatedCustomTemplates);
    localStorage.setItem('customTemplates', JSON.stringify(updatedCustomTemplates));

    // Reset form
    setNewTemplate({
      name: '',
      description: '',
      category: 'business',
      platform: 'All Platforms',
      tone: 'Professional',
      title: '',
      description_template: '',
      hashtags: '',
      tags: ''
    });
    setShowCreateModal(false);
  };

  // Delete custom template
  const deleteTemplate = (templateId) => {
    const updatedCustomTemplates = customTemplates.filter(t => t.id !== templateId);
    setCustomTemplates(updatedCustomTemplates);
    localStorage.setItem('customTemplates', JSON.stringify(updatedCustomTemplates));
  };

  return (
    <div className={`min-h-screen ${colors.background} transition-all duration-500`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${colors.card} border-b ${colors.border} p-6`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/generator')}
              className={`mr-4 p-2 rounded-xl ${colors.button.secondary} ${colors.text.primary} ${colors.button.hover} transition-all duration-300`}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className={`text-3xl font-bold ${colors.text.primary}`}>Template Library</h1>
              <p className={`${colors.text.secondary} mt-1`}>Choose from pre-built templates or create your own</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/history')}
              className={`px-4 py-2 ${colors.button.secondary} ${colors.text.primary} rounded-xl ${colors.button.hover} transition-all duration-300 flex items-center`}
            >
              <History className="h-4 w-4 mr-2" />
              History
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/analytics')}
              className={`px-4 py-2 ${colors.button.secondary} ${colors.text.primary} rounded-xl ${colors.button.hover} transition-all duration-300 flex items-center`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Template
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`${colors.card} rounded-xl p-4 border ${colors.border}`}>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className={`text-2xl font-bold ${colors.text.primary}`}>{allTemplates.length}</p>
                <p className={`text-sm ${colors.text.secondary}`}>Total Templates</p>
              </div>
            </div>
          </div>
          <div className={`${colors.card} rounded-xl p-4 border ${colors.border}`}>
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-400 mr-3" />
              <div>
                <p className={`text-2xl font-bold ${colors.text.primary}`}>{bookmarkedTemplates.length}</p>
                <p className={`text-sm ${colors.text.secondary}`}>Bookmarked</p>
              </div>
            </div>
          </div>
          <div className={`${colors.card} rounded-xl p-4 border ${colors.border}`}>
            <div className="flex items-center">
              <Plus className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className={`text-2xl font-bold ${colors.text.primary}`}>{customTemplates.length}</p>
                <p className={`text-sm ${colors.text.secondary}`}>Custom Templates</p>
              </div>
            </div>
          </div>
          <div className={`${colors.card} rounded-xl p-4 border ${colors.border}`}>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-cyan-400 mr-3" />
              <div>
                <p className={`text-2xl font-bold ${colors.text.primary}`}>95%</p>
                <p className={`text-sm ${colors.text.secondary}`}>Avg. Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${colors.text.secondary}`} />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full px-4 py-3 pr-10 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none`}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${colors.text.secondary} pointer-events-none`} />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`w-full px-4 py-3 pr-10 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none`}
            >
              <option value="popular">Most Popular</option>
              <option value="recent">Most Recent</option>
              <option value="alphabetical">A-Z</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${colors.text.secondary} pointer-events-none`} />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (template.id || 0) * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className={`${colors.card} rounded-2xl p-6 border ${colors.border} hover:border-blue-500/50 transition-all duration-300 group`}
            >
              {/* Template Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${colors.text.primary} group-hover:text-blue-400 transition-colors mb-2`}>{template.name}</h3>
                  <p className={`${colors.text.secondary} text-sm`}>{template.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={() => toggleBookmark(template.id)}
                    className={`p-2 rounded-lg transition-all duration-300 ${bookmarkedTemplates.includes(template.id)
                      ? 'text-yellow-400 bg-yellow-400/20'
                      : colors.text.secondary + ' hover:text-yellow-400 hover:bg-yellow-400/20'
                    }`}
                  >
                    {bookmarkedTemplates.includes(template.id) ? (
                      <Bookmark className="h-4 w-4 fill-current" />
                    ) : (
                      <BookmarkPlus className="h-4 w-4" />
                    )}
                  </button>
                  {template.isCustom && (
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className={`p-2 rounded-lg ${colors.text.secondary} hover:text-red-400 hover:bg-red-400/20 transition-all duration-300`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Template Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className={colors.text.secondary}>Platform:</span>
                  <span className="text-blue-400 font-medium">{template.platform}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={colors.text.secondary}>Tone:</span>
                  <span className="text-cyan-400 font-medium">{template.tone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={colors.text.secondary}>Rating:</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className={`${colors.text.primary} font-medium`}>{template.rating || '0.0'}</span>
                  </div>
                </div>
              </div>

              {/* Template Preview */}
              <div className={`${colors.button.secondary} rounded-lg p-3 mb-4`}>
                <div className={`text-xs ${colors.text.secondary} mb-2`}>Preview:</div>
                <div className={`${colors.text.primary} font-medium text-sm line-clamp-2`}>
                  {template.template.title}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => useTemplate(template)}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center text-sm"
                >
                  Use Template
                  <ArrowRight className="h-4 w-4 ml-2" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => copyTemplate(template)}
                  className={`p-2 ${colors.button.secondary} ${colors.text.primary} rounded-lg ${colors.button.hover} transition-all duration-300`}
                >
                  {copiedTemplate === template.id ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`col-span-full text-center py-12 ${colors.text.secondary}`}
          >
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl mb-2">No templates found</p>
            <p>Try adjusting your search or filters</p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`mt-12 ${colors.card} rounded-2xl p-8 border ${colors.border} text-center`}
        >
          <h2 className={`text-3xl font-bold ${colors.text.primary} mb-4`}>
            Need a Custom Template?
          </h2>
          <p className={`${colors.text.secondary} mb-6 max-w-2xl mx-auto`}>
            Can't find what you're looking for? Use our AI generator to create personalized content for your specific needs.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/generator')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold text-lg shadow-2xl flex items-center justify-center mx-auto"
          >
            <Sparkles className="h-6 w-6 mr-2" />
            Create Custom Content
          </motion.button>
        </motion.div>
      </div>
      
      {/* Create Template Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`${colors.card} rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border ${colors.border}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${colors.text.primary}`}>Create Custom Template</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`p-2 rounded-lg ${colors.text.secondary} hover:text-red-400 hover:bg-red-400/20 transition-all duration-300`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                      Template Name *
                    </label>
                    <input
                      type="text"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Product Launch Template"
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                      Category
                    </label>
                    <select
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                    Description
                  </label>
                  <textarea
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this template is best used for..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                      Platform
                    </label>
                    <input
                      type="text"
                      value={newTemplate.platform}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, platform: e.target.value }))}
                      placeholder="e.g., Instagram/LinkedIn"
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                      Tone
                    </label>
                    <select
                      value={newTemplate.tone}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, tone: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="Professional">Professional</option>
                      <option value="Casual">Casual</option>
                      <option value="Exciting">Exciting</option>
                      <option value="Informative">Informative</option>
                      <option value="Inspirational">Inspirational</option>
                      <option value="Creative">Creative</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                    Template Title
                  </label>
                  <input
                    type="text"
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., 🚀 Exciting News: [Your Announcement]"
                    className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                    Content Template *
                  </label>
                  <textarea
                    value={newTemplate.description_template}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, description_template: e.target.value }))}
                    placeholder="Write your template content here. Use [placeholders] for dynamic content..."
                    rows={6}
                    className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                    Hashtags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newTemplate.hashtags}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, hashtags: e.target.value }))}
                    placeholder="#hashtag1, #hashtag2, #hashtag3"
                    className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={createTemplate}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                  >
                    Create Template
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreateModal(false)}
                    className={`px-6 py-3 ${colors.button.secondary} ${colors.text.primary} rounded-xl font-semibold ${colors.button.hover} transition-all duration-300`}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Templates;
