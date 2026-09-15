import { Link } from 'react-router-dom';
import { Sparkles, Search, TrendingUp, BookOpen, Users, Zap, Target, Award } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                LearnWise AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">How It Works</a>
              <a href="#about" className="text-gray-600 hover:text-primary-600 transition-colors">About</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Learning Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your AI-Powered
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Research & Learning Companion
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Discover high-quality learning resources tailored to your project needs. 
            Let AI curate the perfect content for every stage of your learning journey.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link to="/register" className="btn btn-primary text-lg px-8 py-3 inline-flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Find Resources</span>
            </Link>
            <a href="#how-it-works" className="btn btn-outline text-lg px-8 py-3 inline-flex items-center justify-center space-x-2">
              <span>See How It Works</span>
            </a>
          </div>

          {/* Preview Image Placeholder */}
          <div className="card p-4 max-w-5xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <p className="text-gray-600">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Problem Students Face
            </h2>
            <p className="text-xl text-gray-600">
              Too much time wasted searching through irrelevant content
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Irrelevant Websites', desc: 'Search results filled with outdated or off-topic content' },
              { title: 'Low-Quality Tutorials', desc: 'Difficulty finding credible, well-explained resources' },
              { title: 'Information Overload', desc: 'Too many options with no clear guidance on what to choose' },
              { title: 'Disconnected Learning', desc: 'Resources that don\'t match your project stage or skill level' },
            ].map((item, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❌</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How LearnWise AI Solves This
            </h2>
            <p className="text-xl text-gray-600">
              Intelligent resource discovery powered by AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Search, title: 'AI-Powered Search', desc: 'Advanced algorithms understand your project context and learning needs' },
              { icon: Target, title: 'Personalized Recommendations', desc: 'Resources matched to your skill level and project stage' },
              { icon: TrendingUp, title: 'Quality Ranking', desc: 'Credibility scores and relevance metrics for every resource' },
              { icon: BookOpen, title: 'Stage-Aware Curation', desc: 'Different resources for research, learning, and development phases' },
              { icon: Zap, title: 'Multiple Sources', desc: 'YouTube, GitHub, academic papers, tutorials, and more in one place' },
              { icon: Award, title: 'Smart Filtering', desc: 'Find exactly what you need with intelligent filters and sorting' },
            ].map((item, index) => (
              <div key={index} className="card p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get personalized learning resources in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Tell Us About Your Project', desc: 'Enter your project details, current stage, and learning goals' },
              { step: '2', title: 'AI Understands Your Needs', desc: 'Our AI analyzes your requirements and creates an optimized search strategy' },
              { step: '3', title: 'Resources Discovered & Ranked', desc: 'Multiple sources searched, filtered, and ranked by relevance and quality' },
              { step: '4', title: 'Learn and Build Faster', desc: 'Access curated resources perfectly matched to your learning journey' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Users Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built For Learners Like You
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, title: 'Students', desc: 'Find resources for assignments and projects' },
              { icon: BookOpen, title: 'Educators', desc: 'Discover teaching materials and references' },
              { icon: Search, title: 'Researchers', desc: 'Access academic papers and research data' },
              { icon: Award, title: 'Institutions', desc: 'Empower learners with AI-powered tools' },
            ].map((item, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-secondary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Learning Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students who are learning faster with AI-powered resource discovery
          </p>
          <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3 inline-flex items-center space-x-2">
            <span>Get Started Free</span>
            <Sparkles className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="w-6 h-6 text-primary-400" />
              <span className="text-xl font-bold text-white">LearnWise AI</span>
            </div>
            <div className="text-sm text-center">
              <p>Learn Fast. Learn Smart. Let AI Lead the Way.</p>
              <p className="mt-2 text-gray-500">© 2024 LearnWise AI. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
