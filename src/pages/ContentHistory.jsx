import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../contexts/ThemeContext';
import {
  Sparkles,
  History,
  FileText,
  Search,
  Calendar,
  Trash2,
  Edit3,
  Copy,
  Check,
  Star,
  Clock,
  Filter,
  Download,
  Home,
  ArrowRight,
  Tag,
  Eye,
  BookmarkPlus,
  Bookmark,
} from "lucide-react";

const ContentHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [contentHistory, setContentHistory] = useState([]);
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [activeTab, setActiveTab] = useState("history");
  const [copiedId, setCopiedId] = useState(null);
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());

  useEffect(() => {
    loadHistoryFromStorage();
    loadDraftsFromStorage();
    loadBookmarksFromStorage();
  }, []);

  const loadHistoryFromStorage = () => {
    const history = localStorage.getItem('contentHistory');
    if (history) {
      setContentHistory(JSON.parse(history));
    }
  };

  const loadDraftsFromStorage = () => {
    const drafts = localStorage.getItem('savedDrafts');
    if (drafts) {
      setSavedDrafts(JSON.parse(drafts));
    }
  };

  const loadBookmarksFromStorage = () => {
    const bookmarks = localStorage.getItem('bookmarkedContent');
    if (bookmarks) {
      setBookmarkedItems(new Set(JSON.parse(bookmarks)));
    }
  };

  const saveHistoryToStorage = (history) => {
    localStorage.setItem('contentHistory', JSON.stringify(history));
  };

  const saveDraftsToStorage = (drafts) => {
    localStorage.setItem('savedDrafts', JSON.stringify(drafts));
  };

  const saveBookmarksToStorage = (bookmarks) => {
    localStorage.setItem('bookmarkedContent', JSON.stringify([...bookmarks]));
  };

  const deleteHistoryItem = (id) => {
    const updatedHistory = contentHistory.filter(item => item.id !== id);
    setContentHistory(updatedHistory);
    saveHistoryToStorage(updatedHistory);
  };

  const deleteDraft = (id) => {
    const updatedDrafts = savedDrafts.filter(draft => draft.id !== id);
    setSavedDrafts(updatedDrafts);
    saveDraftsToStorage(updatedDrafts);
  };

  const toggleBookmark = (item) => {
    const newBookmarks = new Set(bookmarkedItems);
    if (newBookmarks.has(item.id)) {
      newBookmarks.delete(item.id);
    } else {
      newBookmarks.add(item.id);
    }
    setBookmarkedItems(newBookmarks);
    saveBookmarksToStorage(newBookmarks);
  };

  const copyContent = (content, id) => {
    const fullContent = `Title: ${content.title || 'N/A'}\n\nDescription: ${content.description || 'N/A'}\n\nHashtags: ${content.hashtags ? content.hashtags.join(' ') : 'N/A'}`;
    navigator.clipboard.writeText(fullContent);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const editContent = (content) => {
    // Store content for editing in the generator
    localStorage.setItem('editContent', JSON.stringify(content));
    navigate('/generator?edit=true');
  };

  const saveDraft = (content) => {
    const draft = {
      ...content,
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
      type: 'draft'
    };
    const updatedDrafts = [draft, ...savedDrafts];
    setSavedDrafts(updatedDrafts);
    saveDraftsToStorage(updatedDrafts);
  };

  const getFilteredContent = () => {
    const items = activeTab === "history" ? contentHistory : savedDrafts;
    
    let filtered = items.filter(item => {
      const matchesSearch = 
        (item.topic && item.topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (filterType === "all") return matchesSearch;
      if (filterType === "bookmarked") return matchesSearch && bookmarkedItems.has(item.id);
      return matchesSearch && item.platform === filterType;
    });

    // Sort the filtered items
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.savedAt);
      const dateB = new Date(b.createdAt || b.savedAt);
      
      if (sortBy === "newest") return dateB - dateA;
      if (sortBy === "oldest") return dateA - dateB;
      if (sortBy === "title") return (a.topic || a.title || '').localeCompare(b.topic || b.title || '');
      return 0;
    });

    return filtered;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return date.toLocaleDateString();
  };

  const filteredContent = getFilteredContent();

  const { colors } = useTheme();

  return (
    <div className={`min-h-screen ${colors.background} transition-all duration-500`}>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`text-4xl md:text-5xl font-extrabold ${colors.text.primary} mb-4`}>
              Content History & Drafts
            </h1>
            <p className={`text-xl ${colors.text.secondary} max-w-3xl mx-auto`}>
              Manage your generated content and saved drafts in one place
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className={`${colors.card} backdrop-blur-xl rounded-full p-1.5 border ${colors.border} shadow-2xl`}>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center relative ${
                  activeTab === "history"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105"
                    : `${colors.text.secondary} hover:${colors.text.primary} hover:bg-blue-500/10`
                }`}
              >
                <History className="h-4 w-4 mr-2" />
                <span className="font-medium">
                  History{" "}
                  <span className={`inline-flex items-center justify-center px-2 py-0.5 ml-1 text-xs font-bold rounded-full ${
                    activeTab === "history" 
                      ? "bg-white/20 text-white" 
                      : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {contentHistory.length}
                  </span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("drafts")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center relative ${
                  activeTab === "drafts"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105"
                    : `${colors.text.secondary} hover:${colors.text.primary} hover:bg-blue-500/10`
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                <span className="font-medium">
                  Drafts{" "}
                  <span className={`inline-flex items-center justify-center px-2 py-0.5 ml-1 text-xs font-bold rounded-full ${
                    activeTab === "drafts" 
                      ? "bg-white/20 text-white" 
                      : "bg-orange-500/20 text-orange-400"
                  }`}>
                    {savedDrafts.length}
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">All Platforms</option>
                  <option value="bookmarked">Bookmarked</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">By Title</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.length > 0 ? (
              filteredContent.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        activeTab === "history" ? "bg-green-400" : "bg-yellow-400"
                      }`}></div>
                      <span className="text-sm text-gray-400">
                        {activeTab === "history" ? "Generated" : "Draft"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(item)}
                        className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                      >
                        {bookmarkedItems.has(item.id) ? (
                          <Bookmark className="h-4 w-4 fill-current text-yellow-400" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4" />
                        )}
                      </button>
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        {formatDate(item.createdAt || item.savedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                      {item.topic || item.title || "Untitled Content"}
                    </h3>
                    {item.description && (
                      <p className="text-gray-300 text-sm line-clamp-3 mb-3">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    {item.platform && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Platform:</span>
                        <span className="text-blue-300 capitalize">{item.platform}</span>
                      </div>
                    )}
                    {item.tone && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Tone:</span>
                        <span className="text-cyan-300 capitalize">{item.tone}</span>
                      </div>
                    )}
                    {item.hashtags && item.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.hashtags.slice(0, 3).map((hashtag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-500/30 text-blue-200 rounded-full text-xs"
                          >
                            {hashtag}
                          </span>
                        ))}
                        {item.hashtags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-500/30 text-gray-300 rounded-full text-xs">
                            +{item.hashtags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => editContent(item)}
                      className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center text-sm"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => copyContent(item, item.id)}
                      className="p-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      {copiedId === item.id ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => activeTab === "history" ? deleteHistoryItem(item.id) : deleteDraft(item.id)}
                      className="p-2 bg-red-500/20 text-red-300 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    {activeTab === "history" ? "No content history found" : "No saved drafts found"}
                  </p>
                  <p className="text-sm">
                    {activeTab === "history" 
                      ? "Generate some content to see it here" 
                      : "Save some drafts to see them here"
                    }
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/generator')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center mx-auto"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Start Creating
                </motion.button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/generator')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Create New Content
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/templates')}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center"
              >
                <FileText className="h-5 w-5 mr-2" />
                Browse Templates
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentHistory;
