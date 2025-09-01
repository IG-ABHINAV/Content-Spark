import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
  TrendingUp, Eye, Heart, Share, MessageSquare, Calendar,
  BarChart3, PieChart, LineChart, Users, Clock, Target,
  ArrowLeft, Filter, Download, RefreshCw, Zap, Star,
  Award, TrendingDown, AlertTriangle, CheckCircle,
  Hash, Globe, Sparkles, Activity, BookOpen, Lightbulb
} from 'lucide-react';

const ContentInsights = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState({});

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'performance', name: 'Performance', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 'topics', name: 'Topics', icon: <Hash className="h-5 w-5" /> },
    { id: 'audience', name: 'Audience', icon: <Users className="h-5 w-5" /> }
  ];

  useEffect(() => {
    loadInsightsData();
  }, [timeRange]);

  const loadInsightsData = () => {
    setIsLoading(true);
    
    // Simulate loading and generate mock analytics data
    setTimeout(() => {
      const mockInsights = {
        overview: {
          totalContent: 156,
          totalViews: 45231,
          totalEngagement: 8934,
          avgPerformance: 78,
          topPerformer: "10 Tips for Better Content Creation",
          growthRate: 12.5,
          contentTypes: [
            { type: 'Blog Posts', count: 45, percentage: 28.8 },
            { type: 'Social Media', count: 67, percentage: 43.0 },
            { type: 'Emails', count: 23, percentage: 14.7 },
            { type: 'Videos', count: 21, percentage: 13.5 }
          ]
        },
        performance: {
          topContent: [
            { title: "10 Tips for Better Content Creation", views: 5234, engagement: 892, score: 94 },
            { title: "Social Media Marketing Guide", views: 4876, engagement: 756, score: 91 },
            { title: "Email Campaign Best Practices", views: 3992, engagement: 634, score: 88 },
            { title: "Content Strategy for 2024", views: 3445, engagement: 567, score: 85 },
            { title: "SEO Optimization Checklist", views: 2998, engagement: 445, score: 82 }
          ],
          weeklyStats: [
            { week: 'Week 1', views: 8932, engagement: 1234 },
            { week: 'Week 2', views: 9456, engagement: 1456 },
            { week: 'Week 3', views: 8734, engagement: 1167 },
            { week: 'Week 4', views: 10234, engagement: 1789 }
          ]
        },
        topics: {
          trending: [
            { topic: 'AI Content Creation', mentions: 234, growth: 45.2, trend: 'up' },
            { topic: 'Social Media Strategy', mentions: 198, growth: 23.1, trend: 'up' },
            { topic: 'Email Marketing', mentions: 167, growth: -8.5, trend: 'down' },
            { topic: 'SEO Best Practices', mentions: 145, growth: 12.7, trend: 'up' },
            { topic: 'Video Content', mentions: 134, growth: 67.9, trend: 'up' },
            { topic: 'Brand Storytelling', mentions: 123, growth: 34.6, trend: 'up' }
          ],
          categories: [
            { name: 'Marketing', percentage: 35, color: 'blue' },
            { name: 'Technology', percentage: 28, color: 'purple' },
            { name: 'Business', percentage: 22, color: 'green' },
            { name: 'Lifestyle', percentage: 15, color: 'pink' }
          ]
        },
        audience: {
          demographics: [
            { segment: '25-34 years', percentage: 42, growth: 8.3 },
            { segment: '35-44 years', percentage: 28, growth: 5.7 },
            { segment: '18-24 years', percentage: 18, growth: 15.2 },
            { segment: '45-54 years', percentage: 12, growth: -2.1 }
          ],
          interests: [
            { interest: 'Digital Marketing', score: 89 },
            { interest: 'Content Creation', score: 84 },
            { interest: 'Social Media', score: 78 },
            { interest: 'Business Growth', score: 72 },
            { interest: 'Technology', score: 67 }
          ],
          engagement: {
            bestTimes: ['9:00 AM', '1:00 PM', '6:00 PM'],
            bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
            avgSession: '3m 24s',
            bounceRate: '32%'
          }
        }
      };

      setInsights(mockInsights);
      setIsLoading(false);
    }, 1500);
  };

  const StatCard = ({ icon, title, value, change, color = 'blue' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`${colors.card} rounded-xl p-6 border ${colors.border} hover:border-${color}-500/50 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r from-${color}-500 to-${color}-600`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        {change && (
          <div className={`flex items-center text-sm ${
            change > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {change > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <h3 className={`text-sm ${colors.text.secondary} mb-1`}>{title}</h3>
      <p className={`text-2xl font-bold ${colors.text.primary}`}>{value}</p>
    </motion.div>
  );

  const ContentItem = ({ content, rank }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center justify-between p-4 ${colors.card} rounded-lg border ${colors.border} mb-3`}
    >
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm mr-4`}>
          {rank}
        </div>
        <div>
          <h4 className={`font-semibold ${colors.text.primary} mb-1`}>{content.title}</h4>
          <div className="flex items-center space-x-4 text-sm">
            <span className={`${colors.text.secondary} flex items-center`}>
              <Eye className="h-3 w-3 mr-1" />
              {content.views.toLocaleString()} views
            </span>
            <span className={`${colors.text.secondary} flex items-center`}>
              <Heart className="h-3 w-3 mr-1" />
              {content.engagement} engagements
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-lg font-bold ${colors.text.primary}`}>{content.score}</div>
        <div className={`text-xs ${colors.text.secondary}`}>Score</div>
      </div>
    </motion.div>
  );

  const TopicCard = ({ topic }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${colors.card} rounded-lg p-4 border ${colors.border}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className={`font-semibold ${colors.text.primary}`}>{topic.topic}</h4>
        <div className={`flex items-center text-sm ${
          topic.trend === 'up' ? 'text-green-400' : 'text-red-400'
        }`}>
          {topic.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-sm ${colors.text.secondary}`}>{topic.mentions} mentions</span>
        <span className={`text-sm font-semibold ${
          topic.growth > 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {topic.growth > 0 ? '+' : ''}{topic.growth}%
        </span>
      </div>
    </motion.div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          title="Total Content"
          value={insights.overview?.totalContent?.toLocaleString() || '0'}
          change={12.5}
          color="blue"
        />
        <StatCard
          icon={<Eye className="h-5 w-5" />}
          title="Total Views"
          value={insights.overview?.totalViews?.toLocaleString() || '0'}
          change={8.7}
          color="green"
        />
        <StatCard
          icon={<Heart className="h-5 w-5" />}
          title="Total Engagement"
          value={insights.overview?.totalEngagement?.toLocaleString() || '0'}
          change={15.3}
          color="purple"
        />
        <StatCard
          icon={<Target className="h-5 w-5" />}
          title="Avg Performance"
          value={`${insights.overview?.avgPerformance || 0}%`}
          change={5.2}
          color="orange"
        />
      </div>

      {/* Content Types Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${colors.card} rounded-xl p-6 border ${colors.border}`}
      >
        <h3 className={`text-xl font-bold ${colors.text.primary} mb-6 flex items-center`}>
          <PieChart className="h-5 w-5 mr-2" />
          Content Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {insights.overview?.contentTypes?.map((type, index) => (
            <div key={type.type} className={`p-4 rounded-lg ${colors.button.secondary}`}>
              <div className={`text-2xl font-bold ${colors.text.primary} mb-1`}>{type.count}</div>
              <div className={`text-sm ${colors.text.secondary} mb-2`}>{type.type}</div>
              <div className={`text-xs ${colors.text.secondary}`}>{type.percentage}% of total</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Performer Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${colors.card} rounded-xl p-6 border ${colors.border} bg-gradient-to-r from-blue-500/10 to-cyan-500/10`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-xl font-bold ${colors.text.primary} mb-2 flex items-center`}>
              <Award className="h-5 w-5 mr-2 text-yellow-400" />
              Top Performer
            </h3>
            <p className={`text-lg ${colors.text.primary} font-semibold`}>{insights.overview?.topPerformer}</p>
            <p className={`text-sm ${colors.text.secondary} mt-1`}>Your best performing content this month</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold text-green-400`}>94</div>
            <div className={`text-sm ${colors.text.secondary}`}>Performance Score</div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const PerformanceTab = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${colors.card} rounded-xl p-6 border ${colors.border}`}
      >
        <h3 className={`text-xl font-bold ${colors.text.primary} mb-6 flex items-center`}>
          <TrendingUp className="h-5 w-5 mr-2" />
          Top Performing Content
        </h3>
        <div>
          {insights.performance?.topContent?.map((content, index) => (
            <ContentItem key={content.title} content={content} rank={index + 1} />
          ))}
        </div>
      </motion.div>
    </div>
  );

  const TopicsTab = () => (
    <div className="space-y-6">
      {/* Trending Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${colors.card} rounded-xl p-6 border ${colors.border}`}
      >
        <h3 className={`text-xl font-bold ${colors.text.primary} mb-6 flex items-center`}>
          <Hash className="h-5 w-5 mr-2" />
          Trending Topics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.topics?.trending?.map((topic, index) => (
            <TopicCard key={topic.topic} topic={topic} />
          ))}
        </div>
      </motion.div>

      {/* Topic Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${colors.card} rounded-xl p-6 border ${colors.border}`}
      >
        <h3 className={`text-xl font-bold ${colors.text.primary} mb-6 flex items-center`}>
          <PieChart className="h-5 w-5 mr-2" />
          Content Categories
        </h3>
        <div className="space-y-4">
          {insights.topics?.categories?.map((category, index) => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full bg-${category.color}-500 mr-3`}></div>
                <span className={`font-medium ${colors.text.primary}`}>{category.name}</span>
              </div>
              <div className="flex items-center">
                <div className={`w-32 h-2 bg-gray-200 rounded-full mr-3`}>
                  <div 
                    className={`h-2 bg-${category.color}-500 rounded-full`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <span className={`text-sm ${colors.text.secondary} w-12`}>{category.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const AudienceTab = () => (
    <div className="space-y-6">
      {/* Demographics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${colors.card} rounded-xl p-6 border ${colors.border}`}
      >
        <h3 className={`text-xl font-bold ${colors.text.primary} mb-6 flex items-center`}>
          <Users className="h-5 w-5 mr-2" />
          Audience Demographics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className={`font-semibold ${colors.text.primary} mb-4`}>Age Groups</h4>
            <div className="space-y-3">
              {insights.audience?.demographics?.map((demo, index) => (
                <div key={demo.segment} className="flex items-center justify-between">
                  <span className={`${colors.text.primary}`}>{demo.segment}</span>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                      <div 
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${demo.percentage}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm ${colors.text.secondary} w-12`}>{demo.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className={`font-semibold ${colors.text.primary} mb-4`}>Top Interests</h4>
            <div className="space-y-3">
              {insights.audience?.interests?.map((interest, index) => (
                <div key={interest.interest} className="flex items-center justify-between">
                  <span className={`${colors.text.primary}`}>{interest.interest}</span>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 rounded-full mr-3">
                      <div 
                        className="h-2 bg-purple-500 rounded-full"
                        style={{ width: `${interest.score}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm ${colors.text.secondary} w-8`}>{interest.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Engagement Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${colors.card} rounded-xl p-6 border ${colors.border}`}
      >
        <h3 className={`text-xl font-bold ${colors.text.primary} mb-6 flex items-center`}>
          <Activity className="h-5 w-5 mr-2" />
          Engagement Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-4 rounded-lg ${colors.button.secondary}`}>
            <div className={`text-sm ${colors.text.secondary} mb-2`}>Best Times</div>
            <div className={`font-semibold ${colors.text.primary}`}>
              {insights.audience?.engagement?.bestTimes?.join(', ')}
            </div>
          </div>
          <div className={`p-4 rounded-lg ${colors.button.secondary}`}>
            <div className={`text-sm ${colors.text.secondary} mb-2`}>Best Days</div>
            <div className={`font-semibold ${colors.text.primary}`}>
              {insights.audience?.engagement?.bestDays?.join(', ')}
            </div>
          </div>
          <div className={`p-4 rounded-lg ${colors.button.secondary}`}>
            <div className={`text-sm ${colors.text.secondary} mb-2`}>Avg Session</div>
            <div className={`font-semibold ${colors.text.primary}`}>
              {insights.audience?.engagement?.avgSession}
            </div>
          </div>
          <div className={`p-4 rounded-lg ${colors.button.secondary}`}>
            <div className={`text-sm ${colors.text.secondary} mb-2`}>Bounce Rate</div>
            <div className={`font-semibold ${colors.text.primary}`}>
              {insights.audience?.engagement?.bounceRate}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
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
              onClick={() => navigate(-1)}
              className={`mr-4 p-2 rounded-xl ${colors.button.secondary} ${colors.text.primary} hover:bg-blue-500/20 transition-all duration-300`}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className={`text-3xl font-bold ${colors.text.primary} flex items-center`}>
                <Sparkles className="h-8 w-8 mr-3 text-blue-500" />
                Content Insights
              </h1>
              <p className={`${colors.text.secondary} mt-1`}>Analyze your content performance and discover trends</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${colors.input.border} ${colors.input.background} ${colors.text.primary}`}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadInsightsData}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : `${colors.button.secondary} ${colors.text.primary} hover:bg-blue-500/20 border ${colors.border}`
              }`}
            >
              <div className={activeTab === tab.id ? 'text-white' : colors.text.secondary}>
                {tab.icon}
              </div>
              <span className="ml-2">{tab.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className={`text-lg ${colors.text.primary}`}>Loading insights...</span>
            </div>
          </motion.div>
        )}

        {/* Content */}
        {!isLoading && (
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <OverviewTab key="overview" />}
            {activeTab === 'performance' && <PerformanceTab key="performance" />}
            {activeTab === 'topics' && <TopicsTab key="topics" />}
            {activeTab === 'audience' && <AudienceTab key="audience" />}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ContentInsights;
