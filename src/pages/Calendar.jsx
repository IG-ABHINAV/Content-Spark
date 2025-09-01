import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  ArrowLeft,
  Clock,
  Edit,
  Trash2,
  Copy,
  Eye,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Users,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Facebook,
  X,
  Save,
  Calendar as CalendarView,
  List,
  Grid,
  Repeat,
  Bell,
  Settings
} from 'lucide-react';

const Calendar = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Create post form state
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    platform: 'instagram',
    scheduledDate: '',
    scheduledTime: '',
    status: 'scheduled',
    recurring: false,
    recurringInterval: 'weekly',
    hashtags: '',
    notes: ''
  });

  const platforms = [
    { value: 'instagram', label: 'Instagram', color: 'from-pink-500 to-purple-500', icon: Instagram },
    { value: 'linkedin', label: 'LinkedIn', color: 'from-blue-600 to-blue-700', icon: Linkedin },
    { value: 'twitter', label: 'Twitter', color: 'from-sky-400 to-blue-500', icon: Twitter },
    { value: 'youtube', label: 'YouTube', color: 'from-red-500 to-red-600', icon: Youtube },
    { value: 'facebook', label: 'Facebook', color: 'from-blue-500 to-blue-600', icon: Facebook },
    { value: 'tiktok', label: 'TikTok', color: 'from-gray-800 to-gray-900', icon: Globe }
  ];

  const statuses = [
    { value: 'all', label: 'All Posts', color: 'text-gray-400' },
    { value: 'scheduled', label: 'Scheduled', color: 'text-blue-400' },
    { value: 'published', label: 'Published', color: 'text-green-400' },
    { value: 'draft', label: 'Draft', color: 'text-yellow-400' },
    { value: 'failed', label: 'Failed', color: 'text-red-400' }
  ];

  // Load scheduled posts from localStorage
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
    setScheduledPosts(savedPosts);
  }, []);

  // Calendar helpers
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  const getDateString = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getPostsForDate = (date) => {
    const dateString = getDateString(date);
    return scheduledPosts.filter(post => post.scheduledDate === dateString);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Create scheduled post
  const createScheduledPost = () => {
    if (!newPost.title || !newPost.content || !newPost.scheduledDate || !newPost.scheduledTime) {
      alert('Please fill in all required fields');
      return;
    }

    const post = {
      id: `post-${Date.now()}`,
      ...newPost,
      hashtags: newPost.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date().toISOString()
    };

    const updatedPosts = [...scheduledPosts, post];
    setScheduledPosts(updatedPosts);
    localStorage.setItem('scheduledPosts', JSON.stringify(updatedPosts));

    // Reset form
    setNewPost({
      title: '',
      content: '',
      platform: 'instagram',
      scheduledDate: '',
      scheduledTime: '',
      status: 'scheduled',
      recurring: false,
      recurringInterval: 'weekly',
      hashtags: '',
      notes: ''
    });
    setShowCreateModal(false);
  };

  // Delete scheduled post
  const deletePost = (postId) => {
    const updatedPosts = scheduledPosts.filter(post => post.id !== postId);
    setScheduledPosts(updatedPosts);
    localStorage.setItem('scheduledPosts', JSON.stringify(updatedPosts));
  };

  // Update post status
  const updatePostStatus = (postId, newStatus) => {
    const updatedPosts = scheduledPosts.map(post =>
      post.id === postId ? { ...post, status: newStatus } : post
    );
    setScheduledPosts(updatedPosts);
    localStorage.setItem('scheduledPosts', JSON.stringify(updatedPosts));
  };

  // Get calendar grid
  const getCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const CalendarDay = ({ day }) => {
    if (!day) return <div className="aspect-square"></div>;

    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const isToday = getDateString(date) === getDateString(new Date());
    const isSelected = selectedDate && getDateString(date) === getDateString(selectedDate);
    const posts = getPostsForDate(date);

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => setSelectedDate(date)}
        className={`aspect-square p-2 rounded-lg cursor-pointer transition-all duration-300 ${
          isSelected ? 'bg-blue-500/30 border-2 border-blue-500' :
          isToday ? 'bg-blue-500/20 border border-blue-500/50' :
          `${colors.card} border ${colors.border} hover:border-blue-500/50`
        }`}
      >
        <div className="h-full flex flex-col">
          <div className={`text-sm font-semibold mb-1 ${
            isToday ? 'text-blue-400' : colors.text.primary
          }`}>
            {day}
          </div>
          <div className="flex-1 space-y-1">
            {posts.slice(0, 3).map((post, index) => {
              const platform = platforms.find(p => p.value === post.platform);
              return (
                <div
                  key={post.id}
                  className={`w-full h-1.5 rounded-full bg-gradient-to-r ${platform?.color || 'from-gray-400 to-gray-500'}`}
                  title={`${post.title} - ${platform?.label}`}
                />
              );
            })}
            {posts.length > 3 && (
              <div className={`text-xs ${colors.text.secondary}`}>
                +{posts.length - 3} more
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const PostCard = ({ post }) => {
    const platform = platforms.find(p => p.value === post.platform);
    const PlatformIcon = platform?.icon || Globe;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${colors.card} rounded-xl p-4 border ${colors.border} hover:border-blue-500/50 transition-all duration-300`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${platform?.color || 'from-gray-400 to-gray-500'} mr-3`}>
              <PlatformIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className={`font-semibold ${colors.text.primary} text-sm`}>{post.title}</h3>
              <p className={`text-xs ${colors.text.secondary}`}>
                {post.scheduledDate} at {post.scheduledTime}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              post.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
              post.status === 'published' ? 'bg-green-500/20 text-green-400' :
              post.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {post.status}
            </span>
            <button
              onClick={() => deletePost(post.id)}
              className={`p-1 rounded ${colors.text.secondary} hover:text-red-400 hover:bg-red-400/20 transition-all duration-300`}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        <p className={`text-sm ${colors.text.secondary} line-clamp-2 mb-3`}>
          {post.content}
        </p>

        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.hashtags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs text-blue-400">
                {tag}
              </span>
            ))}
            {post.hashtags.length > 3 && (
              <span className={`text-xs ${colors.text.secondary}`}>
                +{post.hashtags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {post.recurring && (
              <div className="flex items-center text-xs text-purple-400">
                <Repeat className="h-3 w-3 mr-1" />
                {post.recurringInterval}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                navigator.clipboard.writeText(post.content);
              }}
              className={`p-1 rounded ${colors.text.secondary} hover:text-blue-400 hover:bg-blue-400/20 transition-all duration-300`}
            >
              <Copy className="h-3 w-3" />
            </button>
            <button
              onClick={() => updatePostStatus(post.id, post.status === 'published' ? 'scheduled' : 'published')}
              className={`p-1 rounded ${colors.text.secondary} hover:text-green-400 hover:bg-green-400/20 transition-all duration-300`}
            >
              <CheckCircle className="h-3 w-3" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen ${colors.background} transition-all duration-500`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-b border-blue-200/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className={`text-3xl md:text-4xl font-bold ${colors.text.primary} mb-2`}>Content Calendar</h1>
            <p className={`${colors.text.secondary} text-lg`}>Plan, schedule, and manage your content</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateMonth(-1)}
              className={`p-2 rounded-xl ${colors.button.secondary} ${colors.text.primary} ${colors.button.hover} transition-all duration-300`}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            
            <h2 className={`text-2xl font-bold ${colors.text.primary}`}>
              {getMonthName(currentDate)} {currentDate.getFullYear()}
            </h2>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateMonth(1)}
              className={`p-2 rounded-xl ${colors.button.secondary} ${colors.text.primary} ${colors.button.hover} transition-all duration-300`}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentDate(new Date())}
              className={`px-4 py-2 ${colors.button.secondary} ${colors.text.primary} rounded-xl ${colors.button.hover} transition-all duration-300`}
            >
              Today
            </motion.button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className={`px-4 py-2 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Platforms</option>
              {platforms.map(platform => (
                <option key={platform.value} value={platform.value}>{platform.label}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`${colors.card} rounded-xl p-4 border ${colors.border}`}>
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className={`text-2xl font-bold ${colors.text.primary}`}>
                  {scheduledPosts.filter(p => p.status === 'scheduled').length}
                </p>
                <p className={`text-sm ${colors.text.secondary}`}>Scheduled Posts</p>
              </div>
            </div>
          </div>
          <div className={`${colors.card} rounded-xl p-4 border ${colors.border}`}>
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className={`text-2xl font-bold ${colors.text.primary}`}>
                  {scheduledPosts.filter(p => p.status === 'published').length}
                </p>
                <p className={`text-sm ${colors.text.secondary}`}>Published</p>
              </div>
            </div>
          </div>
          <div className={`${colors.card} rounded-xl p-4 border ${colors.border}`}>
            <div className="flex items-center">
              <Edit className="h-8 w-8 text-yellow-400 mr-3" />
              <div>
                <p className={`text-2xl font-bold ${colors.text.primary}`}>
                  {scheduledPosts.filter(p => p.status === 'draft').length}
                </p>
                <p className={`text-sm ${colors.text.secondary}`}>Drafts</p>
              </div>
            </div>
          </div>
          <div className={`${colors.card} rounded-xl p-4 border ${colors.border}`}>
            <div className="flex items-center">
              <Repeat className="h-8 w-8 text-purple-400 mr-3" />
              <div>
                <p className={`text-2xl font-bold ${colors.text.primary}`}>
                  {scheduledPosts.filter(p => p.recurring).length}
                </p>
                <p className={`text-sm ${colors.text.secondary}`}>Recurring</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <div className={`${colors.card} rounded-2xl p-6 border ${colors.border}`}>
              <h3 className={`text-xl font-semibold ${colors.text.primary} mb-6`}>
                Content Calendar
              </h3>

              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className={`text-center text-sm font-semibold ${colors.text.secondary} py-2`}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {getCalendarGrid().map((day, index) => (
                  <CalendarDay key={index} day={day} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Selected Date Posts or Upcoming Posts */}
          <div>
            <div className={`${colors.card} rounded-2xl p-6 border ${colors.border}`}>
              <h3 className={`text-xl font-semibold ${colors.text.primary} mb-4`}>
                {selectedDate ? `Posts for ${selectedDate.toLocaleDateString()}` : 'Upcoming Posts'}
              </h3>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {(selectedDate ? getPostsForDate(selectedDate) : 
                  scheduledPosts
                    .filter(post => filterPlatform === 'all' || post.platform === filterPlatform)
                    .filter(post => filterStatus === 'all' || post.status === filterStatus)
                    .sort((a, b) => new Date(a.scheduledDate + ' ' + a.scheduledTime) - new Date(b.scheduledDate + ' ' + b.scheduledTime))
                    .slice(0, 10)
                ).map(post => (
                  <PostCard key={post.id} post={post} />
                ))}

                {(selectedDate ? getPostsForDate(selectedDate) : scheduledPosts).length === 0 && (
                  <div className={`text-center py-8 ${colors.text.secondary}`}>
                    <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No posts scheduled</p>
                    <p className="text-sm mt-1">
                      {selectedDate ? 'for this date' : 'in your calendar'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${colors.card} rounded-2xl p-6 border ${colors.border} mt-6`}>
              <h3 className={`text-lg font-semibold ${colors.text.primary} mb-4`}>Quick Actions</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(true)}
                  className={`w-full px-4 py-3 ${colors.button.secondary} ${colors.text.primary} rounded-xl ${colors.button.hover} transition-all duration-300 flex items-center`}
                >
                  <Plus className="h-4 w-4 mr-3" />
                  Schedule New Post
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/templates')}
                  className={`w-full px-4 py-3 ${colors.button.secondary} ${colors.text.primary} rounded-xl ${colors.button.hover} transition-all duration-300 flex items-center`}
                >
                  <CalendarIcon className="h-4 w-4 mr-3" />
                  Browse Templates
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/insights')}
                  className={`w-full px-4 py-3 ${colors.button.secondary} ${colors.text.primary} rounded-xl ${colors.button.hover} transition-all duration-300 flex items-center`}
                >
                  <Eye className="h-4 w-4 mr-3" />
                  View Insights
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Schedule Post Modal */}
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
                <h2 className={`text-2xl font-bold ${colors.text.primary}`}>Schedule New Post</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`p-2 rounded-lg ${colors.text.secondary} hover:text-red-400 hover:bg-red-400/20 transition-all duration-300`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                    Post Title *
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter your post title..."
                    className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                    Content *
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your post content here..."
                    rows={6}
                    className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                      Platform *
                    </label>
                    <select
                      value={newPost.platform}
                      onChange={(e) => setNewPost(prev => ({ ...prev, platform: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      {platforms.map(platform => (
                        <option key={platform.value} value={platform.value}>{platform.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                      Status
                    </label>
                    <select
                      value={newPost.status}
                      onChange={(e) => setNewPost(prev => ({ ...prev, status: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                      Scheduled Date *
                    </label>
                    <input
                      type="date"
                      value={newPost.scheduledDate}
                      onChange={(e) => setNewPost(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                      Scheduled Time *
                    </label>
                    <input
                      type="time"
                      value={newPost.scheduledTime}
                      onChange={(e) => setNewPost(prev => ({ ...prev, scheduledTime: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                    Hashtags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newPost.hashtags}
                    onChange={(e) => setNewPost(prev => ({ ...prev, hashtags: e.target.value }))}
                    placeholder="#hashtag1, #hashtag2, #hashtag3"
                    className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={newPost.recurring}
                      onChange={(e) => setNewPost(prev => ({ ...prev, recurring: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="recurring" className={`ml-2 text-sm font-medium ${colors.text.primary}`}>
                      Make this a recurring post
                    </label>
                  </div>
                  {newPost.recurring && (
                    <select
                      value={newPost.recurringInterval}
                      onChange={(e) => setNewPost(prev => ({ ...prev, recurringInterval: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                    Notes (optional)
                  </label>
                  <textarea
                    value={newPost.notes}
                    onChange={(e) => setNewPost(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any notes or reminders..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border ${colors.input.border} ${colors.input.background} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={createScheduledPost}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Schedule Post
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

export default Calendar;
