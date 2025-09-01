import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from '../contexts/ThemeContext';
import {
  Sparkles,
  Rocket,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  X,
  ArrowLeft,
  Home,
  History,
  Save,
  BookmarkPlus,
  Globe,
  Languages,
  BarChart3,
  Calendar,
  Users,
  Download,
} from "lucide-react";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const Generator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { colors } = useTheme();
  const [input, setInput] = useState({
    topic: "",
    platform: "youtube",
    tone: "neutral",
    contentLength: "medium",
    targetAudience: "",
    language: "english",
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [generated, setGenerated] = useState({
    titles: [],
    hashtags: [],
    description: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState({});
  const [error, setError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Real-time suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Check for template or edit content on component mount
  useEffect(() => {
    if (searchParams.get('template') === 'true') {
      const template = localStorage.getItem('selectedTemplate');
      if (template) {
        const templateData = JSON.parse(template);
        setSelectedTemplate(templateData);
        setInput(prev => ({
          ...prev,
          topic: templateData.template.title.replace(/\[[^\]]+\]/g, '').trim(),
          tone: templateData.tone.toLowerCase(),
          platform: templateData.platform.toLowerCase().split('/')[0] || 'youtube'
        }));
        // Clear the template from localStorage after use
        localStorage.removeItem('selectedTemplate');
      }
    }
    
    // Check for edit content
    if (searchParams.get('edit') === 'true') {
      const editContent = localStorage.getItem('editContent');
      if (editContent) {
        const contentData = JSON.parse(editContent);
        setInput(prev => ({
          ...prev,
          topic: contentData.topic || contentData.title || '',
          platform: contentData.platform || 'youtube',
          tone: contentData.tone || 'neutral',
          contentLength: contentData.contentLength || 'medium',
          targetAudience: contentData.targetAudience || '',
          language: contentData.language || 'english'
        }));
        
        // Pre-populate generated content if available
        if (contentData.titles || contentData.description || contentData.hashtags) {
          setGenerated({
            titles: contentData.titles || [],
            hashtags: contentData.hashtags || [],
            description: contentData.description || ''
          });
        }
        
        // Clear the edit content from localStorage after use
        localStorage.removeItem('editContent');
      }
    }
    
    // Check for suggestion from suggestions page
    if (searchParams.get('suggestion') === 'true') {
      const suggestionData = localStorage.getItem('suggestionData');
      if (suggestionData) {
        const sugData = JSON.parse(suggestionData);
        setInput(prev => ({
          ...prev,
          topic: sugData.topic || '',
          platform: sugData.platform || 'youtube',
          tone: sugData.tone || 'neutral',
          targetAudience: sugData.targetAudience || ''
        }));
        
        // Clear the suggestion data from localStorage after use
        localStorage.removeItem('suggestionData');
      }
    }
  }, [searchParams]);

  // Handle input change with real-time suggestions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));

    if (name === "topic" && value.length > 3) {
      setIsTyping(true);
      if (typingTimeout) clearTimeout(typingTimeout);
      setTypingTimeout(
        setTimeout(() => {
          fetchSuggestions(value);
          setIsTyping(false);
        }, 500)
      );
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Fetch topic suggestions
  const fetchSuggestions = async (topic) => {
    try {
      const prompt = `Suggest 3 related topics to "${topic}" for content creation. Format as plain topics, each on a new line.`;
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
      const suggestionsArray = text
        .split("\n")
        .filter((s) => s.trim())
        .slice(0, 3);
      setSuggestions(suggestionsArray);
      setShowSuggestions(suggestionsArray.length > 0);
    } catch (error) {
      console.error("Suggestions error:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Apply suggestion
  const applySuggestion = (suggestion) => {
    setInput((prev) => ({ ...prev, topic: suggestion }));
    setShowSuggestions(false);
  };

  // Generate content
  const handleGenerate = async () => {
    if (!input.topic) {
      setError("Please enter a topic!");
      return;
    }
    setIsGenerating(true);
    setGenerated({ titles: [], hashtags: [], description: "" });
    setError(null);

    try {
      const languageInstruction = input.language !== 'english' ? ` Write all content in ${input.language}.` : '';
      const prompt = `Create engaging content for a ${
        input.platform
      } post about "${input.topic}" with a ${input.tone} tone, ${
        input.contentLength
      } length, targeted at ${
        input.targetAudience || "general audience"
      }.${languageInstruction} Generate: 1. Three catchy titles (JSON array) 2. Five relevant hashtags (JSON array) 3. A compelling description (string). Format as JSON with keys: titles, hashtags, description.`;

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
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const contentJson = JSON.parse(jsonMatch[0]);
        const generatedContent = {
          titles: contentJson.titles || [],
          hashtags: contentJson.hashtags || [],
          description: contentJson.description || "",
        };
        setGenerated(generatedContent);
        
        // Save to history
        saveToHistory(generatedContent);
      } else {
        processFallbackResponse(text);
      }
    } catch (error) {
      setError(`Failed to generate: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback response processing
  const processFallbackResponse = (text) => {
    const titles = (text.match(/titles?:?\s*\n*(.*\n.*\n.*)/i)?.[1] || "")
      .split("\n")
      .map((t) => t.replace(/^[-*\d.)\s]+/, "").trim())
      .filter((t) => t)
      .slice(0, 3);
    const hashtags =
      (
        text.match(
          /hashtags?:?\s*\n*((?:#[a-z0-9_]+(?:\s|,\s*|$)\n*)+)/i
        )?.[1] || ""
      )
        .match(/#[a-z0-9_]+/gi)
        ?.slice(0, 5) || [];
    const description =
      text
        .match(/description:?\s*\n*((?:(?!titles|hashtags).+\n*)+)/i)?.[1]
        .trim() || "";
    const generatedContent = { titles, hashtags, description };
    setGenerated(generatedContent);
    
    // Save to history
    saveToHistory(generatedContent);
  };

  // Reset inputs
  const handleReset = () => {
    setInput({
      topic: "",
      platform: "youtube",
      tone: "neutral",
      contentLength: "medium",
      targetAudience: "",
      language: "english",
    });
    setGenerated({ titles: [], hashtags: [], description: "" });
    setError(null);
  };

  // Save to history
  const saveToHistory = (generatedContent) => {
    const historyItem = {
      id: Date.now().toString(),
      topic: input.topic,
      platform: input.platform,
      tone: input.tone,
      contentLength: input.contentLength,
      targetAudience: input.targetAudience,
      language: input.language,
      titles: generatedContent.titles,
      hashtags: generatedContent.hashtags,
      description: generatedContent.description,
      createdAt: new Date().toISOString()
    };
    
    const existingHistory = JSON.parse(localStorage.getItem('contentHistory') || '[]');
    const updatedHistory = [historyItem, ...existingHistory].slice(0, 100); // Keep only last 100 items
    localStorage.setItem('contentHistory', JSON.stringify(updatedHistory));
  };

  // Save as draft
  const saveDraft = () => {
    const draftItem = {
      id: Date.now().toString(),
      topic: input.topic,
      platform: input.platform,
      tone: input.tone,
      contentLength: input.contentLength,
      targetAudience: input.targetAudience,
      titles: generated.titles,
      hashtags: generated.hashtags,
      description: generated.description,
      savedAt: new Date().toISOString(),
      type: 'draft'
    };
    
    const existingDrafts = JSON.parse(localStorage.getItem('savedDrafts') || '[]');
    const updatedDrafts = [draftItem, ...existingDrafts];
    localStorage.setItem('savedDrafts', JSON.stringify(updatedDrafts));
    
    // Show success feedback
    setCopied(prev => ({ ...prev, 'draft': true }));
    setTimeout(() => setCopied(prev => ({ ...prev, 'draft': false })), 2000);
  };

  // Copy to clipboard
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 2000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };
  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className={`min-h-screen transition-all duration-500`}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`text-4xl md:text-5xl font-extrabold ${colors.text.primary} mb-4`}
            >
              Content Generator
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-xl ${colors.text.secondary} max-w-2xl mx-auto`}
            >
              Transform your ideas into viral content with AI-powered generation
            </motion.p>
          </div>

          {/* Template Info */}
          {selectedTemplate && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30 mb-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Using Template: {selectedTemplate.name}</h3>
                  <p className="text-gray-300 text-sm">{selectedTemplate.description}</p>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <motion.div className={`${colors.card} rounded-2xl p-6 sm:p-8 border ${colors.border}`}>
          <div className="space-y-6">
            {/* Topic Input */}
            <div className="relative">
              <label
                htmlFor="topic"
                className={`flex items-center text-sm font-medium ${colors.text.primary} mb-2`}
              >
                <Lightbulb className="h-4 w-4 mr-2 text-blue-400" />
                Topic
              </label>
              <input
                id="topic"
                name="topic"
                type="text"
                value={input.topic}
                onChange={handleInputChange}
                placeholder="e.g., Content creation tips"
                className={`w-full px-4 py-3 rounded-lg border ${colors.input.border} ${colors.input.background} ${colors.input.text} ${colors.input.borderFocus} ${colors.input.hover} transition-colors`}
              />
              {isTyping && (
                <div className="absolute right-3 top-9">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <svg
                      className="w-5 h-5 text-indigo-500"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </motion.div>
                </div>
              )}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex absolute z-10 w-full mt-1 bg-slate-800/95 backdrop-blur-sm rounded-md shadow-lg border border-white/20"
                  >
                    <div className="px-4 py-2 absolute right-2 top-2">
                      <X
                        className="h-6 w-6 text-gray-500 cursor-pointer"
                        onClick={() => setShowSuggestions(false)}
                      />
                    </div>
                    <ul className="py-1">
                      {suggestions.map((suggestion, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <button
                            onClick={() => applySuggestion(suggestion)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/10"
                          >
                            {suggestion}
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Platform, Tone, and Language */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="platform"
                  className={`flex items-center text-sm font-medium ${colors.text.primary} mb-2`}
                >
                  <Rocket className="h-4 w-4 mr-2 text-blue-400" />
                  Platform
                </label>
                <select
                  id="platform"
                  name="platform"
                  value={input.platform}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${colors.input.border} ${colors.input.background} ${colors.input.text} ${colors.input.borderFocus} ${colors.input.hover} transition-colors`}
                >
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="tone"
                  className={`flex items-center text-sm font-medium ${colors.text.primary} mb-2`}
                >
                  <Sparkles className="h-4 w-4 mr-2 text-blue-400" />
                  Tone
                </label>
                <select
                  id="tone"
                  name="tone"
                  value={input.tone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${colors.input.border} ${colors.input.background} ${colors.input.text} ${colors.input.borderFocus} ${colors.input.hover} transition-colors`}
                >
                  <option value="neutral">Neutral</option>
                  <option value="funny">Funny</option>
                  <option value="professional">Professional</option>
                  <option value="exciting">Exciting</option>
                  <option value="casual">Casual</option>
                  <option value="informative">Informative</option>
                  <option value="inspirational">Inspirational</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="language"
                  className={`flex items-center text-sm font-medium ${colors.text.primary} mb-2`}
                >
                  <Languages className="h-4 w-4 mr-2 text-blue-400" />
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={input.language}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${colors.input.border} ${colors.input.background} ${colors.input.text} ${colors.input.borderFocus} ${colors.input.hover} transition-colors`}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="italian">Italian</option>
                  <option value="portuguese">Portuguese</option>
                  <option value="chinese">Chinese</option>
                  <option value="japanese">Japanese</option>
                  <option value="korean">Korean</option>
                  <option value="arabic">Arabic</option>
                  <option value="hindi">Hindi</option>
                  <option value="russian">Russian</option>
                </select>
              </div>
            </div>

            {/* Advanced Options */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center text-sm ${colors.text.accent} hover:${colors.text.primary} transition-colors`}
            >
              <ChevronDown
                className={`h-4 w-4 mr-1 transition-transform ${
                  showAdvanced ? "rotate-180" : ""
                }`}
              />
              Advanced Options
            </button>
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div>
                    <label
                      htmlFor="contentLength"
                      className={`block text-sm font-medium ${colors.text.primary} mb-2`}
                    >
                      Content Length
                    </label>
                    <select
                      id="contentLength"
                      name="contentLength"
                      value={input.contentLength}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${colors.input.border} ${colors.input.background} ${colors.input.text} ${colors.input.borderFocus} ${colors.input.hover} transition-colors`}
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="targetAudience"
                      className={`block text-sm font-medium ${colors.text.primary} mb-2`}
                    >
                      Target Audience
                    </label>
                    <input
                      id="targetAudience"
                      name="targetAudience"
                      type="text"
                      value={input.targetAudience}
                      onChange={handleInputChange}
                      placeholder="e.g., Marketing pros"
                      className={`w-full px-4 py-3 rounded-lg border ${colors.input.border} ${colors.input.background} ${colors.input.text} ${colors.input.borderFocus} ${colors.input.hover} transition-colors`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={handleGenerate}
                disabled={isGenerating}
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300"
              >
                {isGenerating ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                      />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Generate Now
                  </>
                )}
              </motion.button>
              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-4 px-6 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <RotateCcw className="h-5 w-5 mr-2 inline" />
                Reset
              </motion.button>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-500/20 backdrop-blur-sm text-red-200 rounded-xl border border-red-500/30"
              >
                {error}
              </motion.div>
            )}
          </div>

          {/* Generated Content */}
          <AnimatePresence>
            {generated.titles.length > 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerVariants}
                className="mt-8 pt-6 border-t border-white/20"
              >
                <h2 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center">
                  <Sparkles className="h-6 w-6 mr-2 text-blue-400" />
                  Generated Content
                </h2>
                {/* Titles */}
                <motion.div variants={staggerVariants} className="mb-8">
                  <h3 className="text-xl font-semibold text-white flex items-center mb-6">
                    <Sparkles className="h-5 w-5 mr-2 text-cyan-400" />
                    Titles
                  </h3>
                  <div className="space-y-3">
                    {generated.titles.map((title, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-all duration-300"
                      >
                        <p className="text-white font-medium">
                          {title}
                        </p>
                        <button
                          onClick={() => handleCopy(title, `title-${index}`)}
                          className="p-2 text-gray-300 hover:text-blue-300 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:scale-110 transition-all duration-300"
                        >
                          {copied[`title-${index}`] ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Hashtags */}
                <motion.div variants={staggerVariants} className="mb-8">
                  <h3 className="text-xl font-semibold text-white flex items-center mb-6">
                    <Rocket className="h-5 w-5 mr-2 text-blue-400" />
                    Hashtags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {generated.hashtags.map((hashtag, index) => (
                      <motion.span
                        key={index}
                        variants={itemVariants}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 backdrop-blur-sm text-white rounded-full text-sm flex items-center border border-blue-400/30 hover:scale-105 transition-all duration-300"
                      >
                        {hashtag}
                        <button
                          onClick={() =>
                            handleCopy(hashtag, `hashtag-${index}`)
                          }
                          className="ml-2 p-1 text-gray-300 hover:text-blue-200 hover:scale-110 transition-all duration-300"
                        >
                          {copied[`hashtag-${index}`] ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div variants={staggerVariants}>
                  <h3 className="text-xl font-semibold text-white flex items-center mb-6">
                    <FileText className="h-5 w-5 mr-2 text-blue-400" />
                    Description
                  </h3>
                  <motion.div
                    variants={itemVariants}
                    className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 relative hover:bg-white/20 transition-all duration-300"
                  >
                    <p className="text-white whitespace-pre-line leading-relaxed">
                      {generated.description}
                    </p>
                    <button
                      onClick={() =>
                        handleCopy(generated.description, "description")
                      }
                      className="absolute top-3 right-3 p-2 text-gray-300 hover:text-blue-300 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:scale-110 transition-all duration-300"
                    >
                      {copied["description"] ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </motion.div>
                </motion.div>

                {/* Export and Save */}
                <motion.div variants={itemVariants} className="mt-8 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => {
                        const content = `# Content Spark Generated Content\n\nTopic: ${
                          input.topic
                        }\nPlatform: ${input.platform}\nTone: ${
                          input.tone
                        }\n\n### Titles\n${generated.titles
                          .map((t) => `- ${t}`)
                          .join("\n")}\n\n### Hashtags\n${generated.hashtags.join(
                          " "
                        )}\n\n### Description\n${generated.description}`;
                        handleCopy(content, "all");
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Copy className="h-5 w-5 mr-2" />
                      {copied["all"] ? "Copied!" : "Copy All"}
                    </button>
                    <button
                      onClick={saveDraft}
                      className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      {copied["draft"] ? "Saved!" : "Save Draft"}
                    </button>
                    <button
                      onClick={() => {
                        const content = `# Content Spark Generated Content\n\nTopic: ${
                          input.topic
                        }\nPlatform: ${input.platform}\nTone: ${
                          input.tone
                        }\n\n### Titles\n${generated.titles
                          .map((t) => `- ${t}`)
                          .join("\n")}\n\n### Hashtags\n${generated.hashtags.join(
                          " "
                        )}\n\n### Description\n${generated.description}`;
                        const blob = new Blob([content], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `content-${new Date()
                          .toISOString()
                          .slice(0, 10)}.md`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl flex items-center justify-center font-semibold border border-white/20 transition-all duration-300"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Download
                    </button>
                  </div>
                  
                  {/* View History Button */}
                  <div className="text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/history')}
                      className="px-6 py-3 bg-white/5 backdrop-blur-sm text-blue-300 rounded-xl font-semibold border border-blue-400/30 hover:bg-blue-400/10 transition-all duration-300 flex items-center justify-center mx-auto"
                    >
                      <History className="h-5 w-5 mr-2" />
                      View All History & Drafts
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

          {/* Footer */}
          <div className={`mt-12 text-center text-sm ${colors.text.muted}`}>
            <div className="flex items-center justify-center mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-2">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className={`font-semibold ${colors.text.primary}`}>Content Spark</span>
            </div>
            <p>© {new Date().getFullYear()} Content Spark. All rights reserved. • Powered by Gemini AI</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Generator;
