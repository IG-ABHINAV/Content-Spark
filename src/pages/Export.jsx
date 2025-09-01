import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Database,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

const Export = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [selectedContent, setSelectedContent] = useState([]);
  const [exportFormat, setExportFormat] = useState('json');
  const [contentHistory, setContentHistory] = useState([]);
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [exportStats, setExportStats] = useState({
    totalExports: 0,
    lastExport: null
  });

  const exportFormats = [
    { id: 'json', name: 'JSON Data', icon: <Database className="h-5 w-5" />, description: 'Structured data format' },
    { id: 'csv', name: 'CSV Spreadsheet', icon: <FileSpreadsheet className="h-5 w-5" />, description: 'Comma-separated values' },
    { id: 'txt', name: 'Plain Text', icon: <FileText className="h-5 w-5" />, description: 'Simple text file' }
  ];

  // Load data on component mount
  useEffect(() => {
    loadExportData();
  }, []);

  const loadExportData = () => {
    const savedContent = JSON.parse(localStorage.getItem('contentHistory') || '[]');
    const savedDrafts = JSON.parse(localStorage.getItem('savedDrafts') || '[]');
    const savedStats = JSON.parse(localStorage.getItem('exportStats') || '{"totalExports": 0, "lastExport": null}');

    setContentHistory(savedContent);
    setSavedDrafts(savedDrafts);
    setExportStats(savedStats);
  };

  const updateExportStats = () => {
    const newStats = {
      totalExports: exportStats.totalExports + 1,
      lastExport: new Date().toISOString()
    };
    setExportStats(newStats);
    localStorage.setItem('exportStats', JSON.stringify(newStats));
  };

  const handleExport = (format) => {
    if (selectedContent.length === 0) {
      alert('Please select content to export');
      return;
    }

    const allContent = [...contentHistory, ...savedDrafts];
    const exportData = selectedContent.map(id => 
      allContent.find(item => item.id === id)
    ).filter(Boolean);

    switch (format) {
      case 'csv':
        exportToCSV(exportData);
        break;
      case 'json':
        exportToJSON(exportData);
        break;
      case 'txt':
        exportToTXT(exportData);
        break;
    }

    updateExportStats();
  };

  const exportToCSV = (data) => {
    const headers = ['Topic', 'Platform', 'Tone', 'Description', 'Hashtags', 'Created', 'Type'];
    const rows = data.map(item => [
      item.topic || '',
      item.platform || '',
      item.tone || '',
      item.description || '',
      item.hashtags?.join('; ') || '',
      new Date(item.createdAt || item.savedAt).toLocaleDateString(),
      item.type === 'draft' ? 'Draft' : 'Generated'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    downloadFile(csvContent, `content-export-${Date.now()}.csv`, 'text/csv');
  };

  const exportToJSON = (data) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `content-export-${Date.now()}.json`, 'application/json');
  };

  const exportToTXT = (data) => {
    const content = data.map(item => 
      `TOPIC: ${item.topic || 'N/A'}
PLATFORM: ${item.platform || 'N/A'}
TONE: ${item.tone || 'N/A'}
TYPE: ${item.type === 'draft' ? 'Draft' : 'Generated'}

DESCRIPTION:
${item.description || 'N/A'}

HASHTAGS:
${item.hashtags?.join(' ') || 'N/A'}

CREATED: ${new Date(item.createdAt || item.savedAt).toLocaleString()}

${'='.repeat(50)}

`
    ).join('');
    
    downloadFile(content, `content-export-${Date.now()}.txt`, 'text/plain');
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const allContent = [...contentHistory, ...savedDrafts];

  const ContentSelector = () => (
    <div className={`${colors.card} rounded-xl p-6 border ${colors.border} mb-6`}>
      <h3 className={`text-xl font-bold ${colors.text.primary} mb-4`}>Select Content to Export</h3>
      {allContent.length === 0 ? (
        <div className={`text-center py-8 ${colors.text.secondary}`}>
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg mb-2">No content available to export</p>
          <p className="text-sm">Create some content first to export it</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/generator')}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center mx-auto"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Start Creating
          </motion.button>
        </div>
      ) : (
        <>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {allContent.map(item => (
              <label key={item.id} className={`flex items-center p-3 rounded-lg ${colors.button.secondary} hover:bg-blue-500/10 transition-colors cursor-pointer`}>
                <input
                  type="checkbox"
                  checked={selectedContent.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedContent(prev => [...prev, item.id]);
                    } else {
                      setSelectedContent(prev => prev.filter(id => id !== item.id));
                    }
                  }}
                  className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <h4 className={`font-medium ${colors.text.primary}`}>{item.topic || 'Untitled'}</h4>
                  <p className={`text-sm ${colors.text.secondary}`}>
                    {item.platform || 'N/A'} • {new Date(item.createdAt || item.savedAt).toLocaleDateString()} • {item.type === 'draft' ? 'Draft' : 'Generated'}
                  </p>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setSelectedContent(allContent.map(item => item.id))}
              className={`px-4 py-2 ${colors.button.secondary} ${colors.text.primary} rounded-lg hover:bg-blue-500/10 transition-all duration-300 text-sm`}
            >
              Select All
            </button>
            <button
              onClick={() => setSelectedContent([])}
              className={`px-4 py-2 ${colors.button.secondary} ${colors.text.primary} rounded-lg hover:bg-blue-500/10 transition-all duration-300 text-sm`}
            >
              Clear Selection
            </button>
          </div>
        </>
      )}
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
              className={`mr-4 p-2 rounded-xl ${colors.button.secondary} ${colors.text.primary} hover:bg-blue-500/10 transition-all duration-300`}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className={`text-3xl font-bold ${colors.text.primary}`}>Export Content</h1>
              <p className={`${colors.text.secondary} mt-1`}>Export your generated content and saved drafts</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Export Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${colors.card} rounded-xl p-6 border ${colors.border} mb-8`}
        >
          <h2 className={`text-xl font-bold ${colors.text.primary} mb-4`}>Export Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{allContent.length}</div>
              <div className={`text-sm ${colors.text.secondary}`}>Total Items Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{exportStats.totalExports}</div>
              <div className={`text-sm ${colors.text.secondary}`}>Total Exports</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {exportStats.lastExport ? new Date(exportStats.lastExport).toLocaleDateString() : 'Never'}
              </div>
              <div className={`text-sm ${colors.text.secondary}`}>Last Export</div>
            </div>
          </div>
        </motion.div>

        {/* Content Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ContentSelector />
        </motion.div>

        {/* Export Formats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${colors.card} rounded-xl p-6 border ${colors.border}`}
        >
          <h3 className={`text-xl font-bold ${colors.text.primary} mb-4`}>Export Format</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {exportFormats.map(format => (
              <motion.div
                key={format.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setExportFormat(format.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                  exportFormat === format.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : `${colors.border} ${colors.button.secondary} hover:border-blue-500/50`
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className={`p-2 rounded-lg ${exportFormat === format.id ? 'bg-blue-500' : 'bg-gray-600'} mr-3`}>
                    <div className="text-white">{format.icon}</div>
                  </div>
                  <h4 className={`font-semibold ${colors.text.primary}`}>{format.name}</h4>
                </div>
                <p className={`text-sm ${colors.text.secondary}`}>{format.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleExport(exportFormat)}
            disabled={selectedContent.length === 0}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-5 w-5 mr-2" />
            Export {selectedContent.length} Selected Items
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Export;
