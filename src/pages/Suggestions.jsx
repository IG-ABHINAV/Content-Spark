import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
  Lightbulb,
  TrendingUp,
  Users,
  Target,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Zap,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share,
  Clock,
  Filter,
  Search,
  ChevronDown,
  Star,
  Bookmark,
  BookmarkPlus,
  Copy,
  Check,
  ArrowRight,
  Hash,
  Globe,
  Calendar,
  BarChart3,
  FileText,
  History,
  Settings
} from 'lucide-react';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const Suggestions = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('trending');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState({
    trending: [
      {
        title: "AI-Generated Art Challenge",
        description: "Create content about AI art tools and showcase your creations",
        engagement_potential: 9,
        difficulty: "easy",
        suggested_hashtags: ["#AIArt", "#DigitalArt", "#CreativeAI", "#ArtChallenge"]
      },
      {
        title: "Remote Work Setup Tour",
        description: "Show your home office setup and productivity tips",
        engagement_potential: 8,
        difficulty: "easy",
        suggested_hashtags: ["#RemoteWork", "#HomeOffice", "#ProductivityTips", "#WorkFromHome"]
      },
      {
        title: "Sustainable Living Tips",
        description: "Share eco-friendly lifestyle changes and their impact",
        engagement_potential: 7,
        difficulty: "medium",
        suggested_hashtags: ["#SustainableLiving", "#EcoFriendly", "#ClimateAction", "#GreenLifestyle"]
      }
    ],
    personalized: [
      {
        title: "Your Content Creation Journey",
        description: "Share your personal story of becoming a content creator",
        engagement_potential: 8,
        difficulty: "easy",
        suggested_hashtags: ["#CreatorJourney", "#ContentCreator", "#MyStory", "#Inspiration"]
      }
    ],
    competitor: [
      {
        title: "Day in the Life Format",
        description: "Popular format showing your daily routine or work process",
        engagement_potential: 9,
        difficulty: "easy",
        suggested_hashtags: ["#DayInTheLife", "#BehindTheScenes", "#Routine", "#Lifestyle"]
      }
    ],
    hashtags: [
      {
        hashtag: "#ContentCreator",
        popularity: 95,
        category: "General",
        description: "Popular hashtag for all content creators"
      },
      {
        hashtag: "#Viral",
        popularity: 88,
        category: "Growth",
        description: "For content aiming to go viral"
      }
    ]
  });
  const [copiedItems, setCopiedItems] = useState({});
  const [bookmarkedSuggestions, setBookmarkedSuggestions] = useState([]);

  const categories = [
    { id: 'trending', name: 'Trending Topics', icon: <TrendingUp className="h-5 w-5" />, color: 'text-red-400' },
    { id: 'personalized', name: 'For You', icon: <Target className="h-5 w-5" />, color: 'text-blue-400' },
    { id: 'competitor', name: 'Competitor Analysis', icon: <Users className="h-5 w-5" />, color: 'text-green-400' },
    { id: 'hashtags', name: 'Trending Hashtags', icon: <Hash className="h-5 w-5" />, color: 'text-purple-400' }
  ];

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' }
  ];

  // Load bookmarked suggestions from localStorage
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedSuggestions') || '[]');
    setBookmarkedSuggestions(savedBookmarks);
  }, []);

  // Generate AI-powered suggestions (but only refresh, don't initially load)
  useEffect(() => {
    // Only generate new suggestions if we don't have any for the current category
    if (suggestions[selectedCategory].length === 0) {
      generateSuggestions();
    }
  }, [selectedCategory, selectedPlatform]);

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      const contentHistory = JSON.parse(localStorage.getItem('contentHistory') || '[]');
      const userInterests = extractUserInterests(contentHistory);
      
      let prompt = '';
      switch (selectedCategory) {
        case 'trending':
          prompt = `Generate 8 trending content topics for ${selectedPlatform === 'all' ? 'social media' : selectedPlatform} in 2024. Focus on current viral trends, popular challenges, and hot topics that are getting high engagement. Format as JSON array with objects containing: title, description, engagement_potential (1-10), difficulty (easy/medium/hard), and suggested_hashtags array.`;
          break;
        case 'personalized':
          prompt = `Based on these user interests: ${userInterests.join(', ') || 'general content creation'}, suggest 8 personalized content ideas for ${selectedPlatform === 'all' ? 'social media' : selectedPlatform}. Make them specific and actionable. Format as JSON array with objects containing: title, description, engagement_potential (1-10), difficulty (easy/medium/hard), and suggested_hashtags array.`;
          break;
        case 'competitor':
          prompt = `Generate 8 content ideas inspired by successful competitor strategies for ${selectedPlatform === 'all' ? 'social media' : selectedPlatform}. Focus on proven formats and topics that perform well. Format as JSON array with objects containing: title, description, engagement_potential (1-10), difficulty (easy/medium/hard), and suggested_hashtags array.`;
          break;
        case 'hashtags':
          prompt = `Generate 20 trending hashtags for ${selectedPlatform === 'all' ? 'social media' : selectedPlatform} content creators in 2024. Include popularity score (1-100) and category. Format as JSON array with objects containing: hashtag, popularity, category, and description.`;
          break;
      }

      const response = await fetch(
        `${GEMINI_API_URL}?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      const text = data.candidates[0].content.parts[0].text;
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        const suggestionsData = JSON.parse(jsonMatch[0]);
        setSuggestions(prev => ({
          ...prev,
          [selectedCategory]: suggestionsData
        }));
      } else {
        // Fallback with mock data
        generateMockSuggestions();
      }
    } catch (error) {
      console.error('Suggestions error:', error);
      generateMockSuggestions();
    } finally {
      setIsLoading(false);
    }
  };

  const extractUserInterests = (history) => {
    const topics = history.slice(0, 10).map(item => item.topic || '').filter(topic => topic);
    const uniqueTopics = [...new Set(topics)];
    return uniqueTopics.slice(0, 5);
  };

  const generateMockSuggestions = () => {
    const mockData = {
      trending: [
        {
          title: "AI-Generated Art Challenge",
          description: "Create content about AI art tools and showcase your creations",
          engagement_potential: 9,
          difficulty: "easy",
          suggested_hashtags: ["#AIArt", "#DigitalArt", "#CreativeAI", "#ArtChallenge"]
        },
        {
          title: "Remote Work Setup Tour",
          description: "Show your home office setup and productivity tips",
          engagement_potential: 8,
          difficulty: "easy",
          suggested_hashtags: ["#RemoteWork", "#HomeOffice", "#ProductivityTips", "#WorkFromHome"]
        },
        {
          title: "Sustainable Living Tips",
          description: "Share eco-friendly lifestyle changes and their impact",
          engagement_potential: 7,
          difficulty: "medium",
          suggested_hashtags: ["#SustainableLiving", "#EcoFriendly", "#ClimateAction", "#GreenLifestyle"]
        }
      ],
      personalized: [
        {
          title: "Your Content Creation Journey",
          description: "Share your personal story of becoming a content creator",
          engagement_potential: 8,
          difficulty: "easy",
          suggested_hashtags: ["#CreatorJourney", "#ContentCreator", "#MyStory", "#Inspiration"]
        }
      ],
      competitor: [
        {
          title: "Day in the Life Format",
          description: "Popular format showing your daily routine or work process",
          engagement_potential: 9,
          difficulty: "easy",
          suggested_hashtags: ["#DayInTheLife", "#BehindTheScenes", "#Routine", "#Lifestyle"]
        }
      ],
      hashtags: [
        {
          hashtag: "#ContentCreator",
          popularity: 95,
          category: "General",
          description: "Popular hashtag for all content creators"
        },
        {
          hashtag: "#Viral",
          popularity: 88,
          category: "Growth",
          description: "For content aiming to go viral"
        }
      ]
    };

    setSuggestions(prev => ({
      ...prev,
      [selectedCategory]: mockData[selectedCategory] || []
    }));
  };

  const useSuggestion = (suggestion) => {
    // Store the suggestion data for use in generator
    const suggestionData = {
      topic: suggestion.title,
      platform: selectedPlatform === 'all' ? 'instagram' : selectedPlatform,
      tone: 'engaging',
      description: suggestion.description,
      hashtags: suggestion.suggested_hashtags || []
    };
    
    localStorage.setItem('suggestionData', JSON.stringify(suggestionData));
    navigate('/generator?suggestion=true');
  };

  const toggleBookmark = (suggestionId) => {
    const newBookmarks = bookmarkedSuggestions.includes(suggestionId)
      ? bookmarkedSuggestions.filter(id => id !== suggestionId)
      : [...bookmarkedSuggestions, suggestionId];
    
    setBookmarkedSuggestions(newBookmarks);
    localStorage.setItem('bookmarkedSuggestions', JSON.stringify(newBookmarks));
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedItems(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopiedItems(prev => ({ ...prev, [key]: false })), 2000);
  };

  const SuggestionCard = ({ suggestion, index }) => {
    const suggestionId = `${selectedCategory}-${index}`;
    const isBookmarked = bookmarkedSuggestions.includes(suggestionId);

    if (selectedCategory === 'hashtags') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${colors.card} rounded-xl p-4 border ${colors.border} hover:border-blue-500/50 transition-all duration-300 group`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                <Hash className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className={`font-bold ${colors.text.primary} group-hover:text-blue-400 transition-colors`}>
                  {suggestion.hashtag}
                </h3>
                <p className={`text-sm ${colors.text.secondary}`}>
                  {suggestion.category} • {suggestion.popularity}% popularity
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleBookmark(suggestionId)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isBookmarked
                  ? 'text-yellow-400 bg-yellow-400/20'
                  : `${colors.text.secondary} hover:text-yellow-400 hover:bg-yellow-400/20`
              }`}
            >
              {isBookmarked ? (
                <Bookmark className="h-4 w-4 fill-current" />
              ) : (
                <BookmarkPlus className="h-4 w-4" />
              )}
            </button>
          </div>

          <p className={`text-sm ${colors.text.secondary} mb-4`}>
            {suggestion.description}
          </p>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => copyToClipboard(suggestion.hashtag, suggestionId)}
              className={`flex-1 px-4 py-2 ${colors.button.secondary} ${colors.text.primary} rounded-lg ${colors.button.hover} transition-all duration-300 flex items-center justify-center text-sm`}
            >
              {copiedItems[suggestionId] ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`${colors.card} rounded-xl p-6 border ${colors.border} hover:border-blue-500/50 transition-all duration-300 group`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className={`font-bold ${colors.text.primary} group-hover:text-blue-400 transition-colors mb-2`}>
              {suggestion.title}
            </h3>
            <p className={`text-sm ${colors.text.secondary} mb-3`}>
              {suggestion.description}
            </p>
          </div>
          <button
            onClick={() => toggleBookmark(suggestionId)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isBookmarked
                ? 'text-yellow-400 bg-yellow-400/20'
                : `${colors.text.secondary} hover:text-yellow-400 hover:bg-yellow-400/20`
            }`}
          >
            {isBookmarked ? (
              <Bookmark className="h-4 w-4 fill-current" />
            ) : (
              <BookmarkPlus className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-yellow-400 mr-1" />
              <span className={colors.text.secondary}>{suggestion.engagement_potential}/10</span>
            </div>
            <div className="flex items-center">
              <Target className="h-4 w-4 text-blue-400 mr-1" />
              <span className={`${colors.text.secondary} capitalize`}>{suggestion.difficulty}</span>
            </div>
          </div>
        </div>

        {suggestion.suggested_hashtags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestion.suggested_hashtags.slice(0, 4).map((hashtag, hashIndex) => (
              <span
                key={hashIndex}
                className={`px-2 py-1 text-xs rounded-full ${colors.button.secondary} text-blue-400`}
              >
                {hashtag}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => useSuggestion(suggestion)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center text-sm"
          >
            Use Suggestion
            <ArrowRight className="h-4 w-4 ml-2" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => copyToClipboard(suggestion.title, suggestionId)}
            className={`px-4 py-2 ${colors.button.secondary} ${colors.text.primary} rounded-lg ${colors.button.hover} transition-all duration-300`}
          >
            {copiedItems[suggestionId] ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  };

  const InsightCard = ({ icon, title, value, change, color = "text-blue-400" }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${colors.card} rounded-xl p-4 border ${colors.border} hover:scale-105 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        <div className={`text-sm ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change > 0 ? '+' : ''}{change}%
        </div>
      </div>
      <h3 className={`text-sm ${colors.text.secondary} mb-1`}>{title}</h3>
      <p className={`text-xl font-bold ${colors.text.primary}`}>{value}</p>
    </motion.div>
  );

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
              <h1 className={`text-3xl font-bold ${colors.text.primary}`}>AI Content Suggestions</h1>
              <p className={`${colors.text.secondary} mt-1`}>Discover trending topics and personalized content ideas</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className={`px-4 py-2 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {platforms.map(platform => (
                <option key={platform.value} value={platform.value}>{platform.label}</option>
              ))}
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateSuggestions}
              disabled={isLoading}
              className={`px-4 py-2 ${colors.button.primary} text-white rounded-xl ${colors.button.hover} transition-all duration-300 flex items-center`}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-6">
        {/* AI Insights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <InsightCard
            icon={<TrendingUp className="h-5 w-5" />}
            title="Trending Score"
            value="8.7/10"
            change={12}
          />
          <InsightCard
            icon={<Eye className="h-5 w-5" />}
            title="Avg. Reach Potential"
            value="25.3K"
            change={18}
          />
          <InsightCard
            icon={<ThumbsUp className="h-5 w-5" />}
            title="Engagement Rate"
            value="4.2%"
            change={-5}
          />
          <InsightCard
            icon={<Clock className="h-5 w-5" />}
            title="Best Posting Time"
            value="3:00 PM"
            change={0}
          />
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map(category => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : `${colors.button.secondary} ${colors.text.primary} ${colors.button.hover} border ${colors.border}`
              }`}
            >
              <div className={selectedCategory === category.id ? 'text-white' : category.color}>
                {category.icon}
              </div>
              <span className="ml-2">{category.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Suggestions Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={`${colors.card} rounded-xl p-6 border ${colors.border} animate-pulse`}
              >
                <div className="h-4 bg-gray-600 rounded mb-4"></div>
                <div className="h-3 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded mb-4"></div>
                <div className="h-8 bg-gray-600 rounded"></div>
              </div>
            ))
          ) : (
            suggestions[selectedCategory]?.map((suggestion, index) => (
              <SuggestionCard key={index} suggestion={suggestion} index={index} />
            ))
          )}
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`${colors.card} rounded-2xl p-8 border ${colors.border}`}
        >
          <h2 className={`text-2xl font-bold ${colors.text.primary} mb-6`}>
            AI Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Optimal Posting Schedule",
                description: "Post content between 2-4 PM for maximum engagement",
                action: "View Calendar",
                icon: <Clock className="h-5 w-5" />,
                color: "blue",
                onClick: () => navigate('/calendar')
              },
              {
                title: "Content Mix Strategy",
                description: "Balance educational (40%), entertaining (35%), and promotional (25%) content",
                action: "View History",
                icon: <History className="h-5 w-5" />,
                color: "green",
                onClick: () => navigate('/history')
              },
              {
                title: "Trending Formats",
                description: "Carousel posts and video content are performing 300% better",
                action: "Browse Templates",
                icon: <FileText className="h-5 w-5" />,
                color: "purple",
                onClick: () => navigate('/templates')
              }
            ].map((rec, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-xl ${colors.button.secondary} border ${colors.border} cursor-pointer`}
                onClick={rec.onClick}
              >
                <div className={`text-${rec.color}-400 mb-3`}>{rec.icon}</div>
                <h3 className={`font-semibold ${colors.text.primary} mb-2`}>{rec.title}</h3>
                <p className={`text-sm ${colors.text.secondary} mb-3`}>{rec.description}</p>
                <div className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                  {rec.action} →
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Suggestions;
