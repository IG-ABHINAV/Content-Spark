import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  Share,
  MessageCircle,
  Users,
  Clock,
  Target,
  Zap,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ArrowLeft,
  ChevronDown,
  Star,
  Award,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';

const Analytics = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [timeRange, setTimeRange] = useState('7d');
  const [platform, setPlatform] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Generate mock analytics data based on saved content history
  useEffect(() => {
    const generateAnalyticsData = () => {
      const savedHistory = JSON.parse(localStorage.getItem('contentHistory') || '[]');
      const now = new Date();
      const timeRangeMs = {
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000,
        '1y': 365 * 24 * 60 * 60 * 1000
      };

      const filteredHistory = savedHistory.filter(item => {
        const itemDate = new Date(item.timestamp);
        return now - itemDate <= timeRangeMs[timeRange];
      });

      // Generate mock performance metrics
      const mockMetrics = {
        totalContent: filteredHistory.length,
        totalViews: Math.floor(Math.random() * 50000) + filteredHistory.length * 100,
        totalEngagement: Math.floor(Math.random() * 5000) + filteredHistory.length * 50,
        avgEngagementRate: (Math.random() * 8 + 2).toFixed(1),
        topPerformingPlatform: ['Instagram', 'LinkedIn', 'Twitter', 'TikTok'][Math.floor(Math.random() * 4)],
        growthRate: (Math.random() * 30 + 5).toFixed(1),
        bestPerformingTime: ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'][Math.floor(Math.random() * 5)],
        contentByPlatform: {
          Instagram: Math.floor(filteredHistory.length * 0.4),
          LinkedIn: Math.floor(filteredHistory.length * 0.3),
          Twitter: Math.floor(filteredHistory.length * 0.2),
          TikTok: Math.floor(filteredHistory.length * 0.1)
        },
        weeklyTrend: Array.from({ length: 7 }, (_, i) => ({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          engagement: Math.floor(Math.random() * 1000) + 200,
          views: Math.floor(Math.random() * 5000) + 1000
        })),
        topContent: filteredHistory.slice(0, 5).map((item, index) => ({
          ...item,
          views: Math.floor(Math.random() * 10000) + 1000,
          engagement: Math.floor(Math.random() * 1000) + 100,
          rank: index + 1
        }))
      };

      setAnalyticsData(mockMetrics);
    };

    setIsLoading(true);
    setTimeout(() => {
      generateAnalyticsData();
      setIsLoading(false);
    }, 1000);
  }, [timeRange, platform]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const MetricCard = ({ icon, title, value, change, isPositive = true }) => (
    <motion.div
      variants={fadeInUp}
      className={`${colors.card} rounded-2xl p-6 border ${colors.border} hover:scale-105 transition-transform duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${isPositive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          <div className={isPositive ? 'text-green-400' : 'text-red-400'}>
            {icon}
          </div>
        </div>
        <div className={`flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          {change}%
        </div>
      </div>
      <h3 className={`text-sm ${colors.text.secondary} mb-1`}>{title}</h3>
      <p className={`text-2xl font-bold ${colors.text.primary}`}>{value}</p>
    </motion.div>
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <motion.div
      variants={fadeInUp}
      className={`${colors.card} rounded-2xl p-6 border ${colors.border} ${className}`}
    >
      <h3 className={`text-lg font-semibold ${colors.text.primary} mb-4`}>{title}</h3>
      {children}
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className={`min-h-screen ${colors.background} flex items-center justify-center`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

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
              <h1 className={`text-3xl font-bold ${colors.text.primary}`}>Analytics Dashboard</h1>
              <p className={`${colors.text.secondary} mt-1`}>Track your content performance and insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Time Range Filter */}
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`appearance-none ${colors.input.background} ${colors.input.border} ${colors.text.primary} px-4 py-2 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${colors.text.secondary} pointer-events-none`} />
            </div>

            {/* Platform Filter */}
            <div className="relative">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className={`appearance-none ${colors.input.background} ${colors.input.border} ${colors.text.primary} px-4 py-2 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
              >
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="tiktok">TikTok</option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${colors.text.secondary} pointer-events-none`} />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 ${colors.button.primary} text-white rounded-xl ${colors.button.hover} transition-all duration-300 flex items-center`}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-6">
        {analyticsData && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                icon={<BarChart3 className="h-6 w-6" />}
                title="Total Content"
                value={analyticsData.totalContent}
                change={12.5}
              />
              <MetricCard
                icon={<Eye className="h-6 w-6" />}
                title="Total Views"
                value={analyticsData.totalViews.toLocaleString()}
                change={18.3}
              />
              <MetricCard
                icon={<Heart className="h-6 w-6" />}
                title="Total Engagement"
                value={analyticsData.totalEngagement.toLocaleString()}
                change={25.7}
              />
              <MetricCard
                icon={<Target className="h-6 w-6" />}
                title="Avg. Engagement Rate"
                value={`${analyticsData.avgEngagementRate}%`}
                change={8.2}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Trend Chart */}
              <ChartCard title="Weekly Performance Trend">
                <div className="space-y-3">
                  {analyticsData.weeklyTrend.map((day, index) => (
                    <div key={day.day} className="flex items-center justify-between">
                      <span className={`text-sm ${colors.text.secondary} w-12`}>{day.day}</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${(day.engagement / 1200) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className={`text-sm ${colors.text.primary} font-medium w-16 text-right`}>
                        {day.engagement}
                      </span>
                    </div>
                  ))}
                </div>
              </ChartCard>

              {/* Platform Distribution */}
              <ChartCard title="Content by Platform">
                <div className="space-y-4">
                  {Object.entries(analyticsData.contentByPlatform).map(([platform, count], index) => {
                    const total = Object.values(analyticsData.contentByPlatform).reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                    const colors_map = {
                      Instagram: 'from-pink-500 to-purple-500',
                      LinkedIn: 'from-blue-600 to-blue-700',
                      Twitter: 'from-sky-400 to-blue-500',
                      TikTok: 'from-gray-800 to-gray-900'
                    };
                    
                    return (
                      <div key={platform} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors_map[platform]} mr-3`}></div>
                          <span className={`${colors.text.primary} font-medium`}>{platform}</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`${colors.text.secondary} text-sm mr-3`}>{percentage}%</span>
                          <span className={`${colors.text.primary} font-bold`}>{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ChartCard>
            </div>

            {/* Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* AI Insights */}
              <ChartCard title="AI-Powered Insights" className="lg:col-span-2">
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${colors.button.secondary} border-l-4 border-green-500`}>
                    <div className="flex items-start">
                      <Zap className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className={`font-semibold ${colors.text.primary} mb-1`}>Peak Performance Time</h4>
                        <p className={`text-sm ${colors.text.secondary}`}>
                          Your content performs best at {analyticsData.bestPerformingTime}. Consider scheduling more posts during this time.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${colors.button.secondary} border-l-4 border-blue-500`}>
                    <div className="flex items-start">
                      <TrendingUp className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className={`font-semibold ${colors.text.primary} mb-1`}>Platform Recommendation</h4>
                        <p className={`text-sm ${colors.text.secondary}`}>
                          {analyticsData.topPerformingPlatform} shows the highest engagement. Focus more content creation here.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${colors.button.secondary} border-l-4 border-purple-500`}>
                    <div className="flex items-start">
                      <Star className="h-5 w-5 text-purple-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className={`font-semibold ${colors.text.primary} mb-1`}>Content Quality Score</h4>
                        <p className={`text-sm ${colors.text.secondary}`}>
                          Your recent content averages 8.5/10 quality score. Keep maintaining this high standard!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ChartCard>

              {/* Quick Stats */}
              <ChartCard title="Quick Stats">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${colors.text.primary} mb-1`}>
                      +{analyticsData.growthRate}%
                    </div>
                    <div className={`text-sm ${colors.text.secondary}`}>Growth Rate</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${colors.text.primary} mb-1`}>
                      {analyticsData.topPerformingPlatform}
                    </div>
                    <div className={`text-sm ${colors.text.secondary}`}>Top Platform</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${colors.text.primary} mb-1`}>
                      {analyticsData.bestPerformingTime}
                    </div>
                    <div className={`text-sm ${colors.text.secondary}`}>Best Time</div>
                  </div>
                </div>
              </ChartCard>
            </div>

            {/* Top Performing Content */}
            <ChartCard title="Top Performing Content">
              <div className="space-y-4">
                {analyticsData.topContent.length > 0 ? (
                  analyticsData.topContent.map((content, index) => (
                    <motion.div
                      key={content.id}
                      variants={fadeInUp}
                      className={`p-4 rounded-xl ${colors.button.secondary} border ${colors.border} hover:scale-[1.02] transition-transform duration-300`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm mr-3`}>
                              #{content.rank}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              content.platform === 'Instagram' ? 'bg-pink-500/20 text-pink-400' :
                              content.platform === 'LinkedIn' ? 'bg-blue-500/20 text-blue-400' :
                              content.platform === 'Twitter' ? 'bg-sky-500/20 text-sky-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {content.platform}
                            </span>
                          </div>
                          <h4 className={`font-semibold ${colors.text.primary} mb-1 truncate`}>
                            {content.title || 'Untitled Content'}
                          </h4>
                          <p className={`text-sm ${colors.text.secondary} line-clamp-2`}>
                            {content.content ? content.content.substring(0, 100) + '...' : 'No description available'}
                          </p>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="flex items-center mb-1">
                            <Eye className="h-4 w-4 text-blue-400 mr-1" />
                            <span className={`text-sm font-medium ${colors.text.primary}`}>
                              {content.views?.toLocaleString() || '0'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 text-red-400 mr-1" />
                            <span className={`text-sm font-medium ${colors.text.primary}`}>
                              {content.engagement?.toLocaleString() || '0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className={`text-center py-12 ${colors.text.secondary}`}>
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No content data available</p>
                    <p className="text-sm mt-2">Start creating content to see analytics</p>
                  </div>
                )}
              </div>
            </ChartCard>

            {/* Performance Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Engagement Breakdown">
                <div className="space-y-4">
                  {[
                    { label: 'Likes', value: Math.floor(analyticsData.totalEngagement * 0.6), icon: <Heart className="h-4 w-4" />, color: 'text-red-400' },
                    { label: 'Comments', value: Math.floor(analyticsData.totalEngagement * 0.25), icon: <MessageCircle className="h-4 w-4" />, color: 'text-blue-400' },
                    { label: 'Shares', value: Math.floor(analyticsData.totalEngagement * 0.15), icon: <Share className="h-4 w-4" />, color: 'text-green-400' }
                  ].map((item, index) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`${item.color} mr-3`}>{item.icon}</div>
                        <span className={`${colors.text.primary} font-medium`}>{item.label}</span>
                      </div>
                      <span className={`${colors.text.primary} font-bold`}>{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <ChartCard title="Content Performance Score">
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="85, 100"
                        className="text-blue-500"
                      />
                      <path
                        d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="0, 100"
                        className={colors.text.secondary}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-bold ${colors.text.primary}`}>8.5</span>
                    </div>
                  </div>
                  <p className={`text-sm ${colors.text.secondary}`}>
                    Excellent performance! Your content is highly engaging.
                  </p>
                </div>
              </ChartCard>
            </div>

            {/* Recommendations */}
            <ChartCard title="AI Recommendations">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: "Optimize Posting Time",
                    description: "Post content during peak hours for better engagement",
                    action: "Schedule Posts",
                    icon: <Clock className="h-5 w-5" />,
                    color: "blue"
                  },
                  {
                    title: "Hashtag Strategy",
                    description: "Use trending hashtags to increase discoverability",
                    action: "View Trends",
                    icon: <TrendingUp className="h-5 w-5" />,
                    color: "green"
                  },
                  {
                    title: "Content Variety",
                    description: "Mix different content types for better audience retention",
                    action: "Explore Templates",
                    icon: <Star className="h-5 w-5" />,
                    color: "purple"
                  }
                ].map((rec, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl ${colors.button.secondary} border ${colors.border} cursor-pointer`}
                  >
                    <div className={`text-${rec.color}-400 mb-2`}>{rec.icon}</div>
                    <h4 className={`font-semibold ${colors.text.primary} mb-2`}>{rec.title}</h4>
                    <p className={`text-sm ${colors.text.secondary} mb-3`}>{rec.description}</p>
                    <button className={`text-sm text-blue-400 hover:text-blue-300 font-medium`}>
                      {rec.action} →
                    </button>
                  </motion.div>
                ))}
              </div>
            </ChartCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
