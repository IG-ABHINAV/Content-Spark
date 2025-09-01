# 🚀 Content Spark

A modern, AI-powered content creation platform with smart scheduling, analytics, and multi-platform publishing capabilities.

## ✨ Features

### 🎯 **Content Generation**
- AI-powered content creation with customizable tones and platforms
- Support for YouTube, Instagram, TikTok, Twitter, LinkedIn, and more
- Real-time content preview and editing
- Smart hashtag suggestions

### 📅 **Content Calendar**
- Interactive calendar view with drag-and-drop scheduling
- Recurring post scheduling
- Platform-specific content filtering
- Visual content status tracking (Scheduled, Published, Draft)
- Bulk operations and content planning

### 📊 **Content Insights & Analytics**
- **Performance Dashboard**: Track views, engagement, and performance scores
- **Trending Topics**: AI-powered trend analysis with growth indicators  
- **Audience Analytics**: Demographics, interests, and engagement patterns
- **Content Performance**: Top performing content ranking and analytics
- **Time-based Insights**: Best posting times and optimal scheduling

### 📝 **Content Management**
- **Content History**: Organized history of all generated content
- **Draft System**: Save and manage content drafts
- **Bookmarking**: Bookmark favorite content for easy access
- **Search & Filter**: Advanced filtering by platform, date, and type

### 🎨 **Templates System**
- Pre-built content templates for various platforms
- Customizable template library
- Template categorization and search
- Quick template-based content generation

### 💡 **Smart Suggestions**
- AI-powered content suggestions by category
- Trending topic recommendations  
- Content optimization tips
- Platform-specific best practices

### 📤 **Export & Integration**
- Export content in multiple formats (JSON, CSV, Plain Text)
- Content statistics and analytics export
- Local data management with localStorage
- Batch export capabilities

### 🎨 **User Experience**
- **Dark/Light Theme**: Seamless theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Modern UI**: Clean, intuitive interface with gradient accents

## 🛠️ Technologies Used

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS with custom theme system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Data Persistence**: localStorage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Content-Spark.git
cd Content-Spark
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:3001` to view the application.

### Build for Production

```bash
npm run build
```

## 📱 Application Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.jsx   # Main navigation bar
│   └── ThemeToggle.jsx  # Dark/light theme toggle
├── contexts/            # React contexts
│   └── ThemeContext.jsx # Theme management
├── pages/               # Main application pages
│   ├── Landing.jsx      # Landing/home page
│   ├── Generator.jsx    # Content generation
│   ├── ContentHistory.jsx # Content history & drafts
│   ├── Calendar.jsx     # Content calendar
│   ├── Suggestions.jsx  # AI suggestions
│   ├── Templates.jsx    # Content templates
│   ├── ContentInsights.jsx # Analytics & insights
│   └── Export.jsx       # Data export
└── App.jsx              # Main app component
```

## 🎯 Key Features Deep Dive

### Content Generation Engine
- **Multi-platform Support**: Optimized content creation for each social platform
- **Tone Customization**: Professional, casual, humorous, inspirational tones
- **Real-time Preview**: See your content as you create it
- **Smart Editing**: Edit and refine generated content

### Advanced Calendar System
- **Visual Scheduling**: Interactive calendar with post scheduling
- **Status Management**: Track scheduled, published, draft, and failed posts
- **Recurring Posts**: Set up automatic recurring content
- **Platform Filtering**: View content by specific platforms
- **Bulk Operations**: Manage multiple posts at once

### Comprehensive Analytics
- **Performance Metrics**: Track content success with detailed analytics
- **Trend Analysis**: Identify trending topics and optimize content strategy
- **Audience Insights**: Understand your audience demographics and preferences
- **Growth Tracking**: Monitor content performance over time

### Smart Data Management
- **Auto-save**: Never lose your work with automatic saving
- **Export Options**: Export your data in multiple formats
- **Search & Filter**: Quickly find specific content
- **Backup & Restore**: Secure local data storage

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (`from-blue-500 to-cyan-500`)
- **Secondary**: Platform-specific colors (Instagram pink, LinkedIn blue, etc.)
- **Theme Support**: Dark/light mode with smooth transitions

### Typography
- **Primary Font**: System fonts for optimal performance
- **Hierarchy**: Clear typography scale from headers to body text
- **Accessibility**: High contrast ratios for better readability

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects  
- **Forms**: Clean input fields with focus states
- **Navigation**: Sticky navigation with active state indicators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Lucide** for beautiful icons
- **Vite** for fast development experience

## 📞 Support

If you have any questions or need help with the project, please open an issue on GitHub or contact the development team.

---

<div align="center">
  <p>Made with ❤️ for content creators everywhere</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
