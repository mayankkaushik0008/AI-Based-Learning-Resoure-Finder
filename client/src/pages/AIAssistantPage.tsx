import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, RefreshCw } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { projectService } from '../services/projectService';
import { aiService } from '../services/aiService';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: string;
}

const AIAssistantPage = () => {
  const { projects, setProjects } = useProjectStore();
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    loadChatHistory();
  }, [selectedProjectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadProjects = async () => {
    try {
      const response = await projectService.getProjects();
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  const loadChatHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await aiService.getChatHistory(
        selectedProjectId || undefined,
        50
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load chat history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    // Add user message immediately
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      role: 'USER',
      content: userMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const response = await aiService.chat(
        userMessage,
        selectedProjectId || undefined
      );

      // Add AI response
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'ASSISTANT',
        content: response.data.message,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), tempUserMsg, aiMsg]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message');
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    toast.success('Chat cleared');
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const suggestedPrompts = [
    'What should I learn first?',
    'Explain this project concept',
    'Suggest resources for this stage',
    'Help me with my learning plan',
    'What are best practices?',
  ];

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistant</h1>
        <p className="text-gray-600">Get personalized guidance for your learning journey</p>
      </div>

      {/* Project Selection */}
      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Context (Optional)
            </label>
            <select
              className="input"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <option value="">-- General Questions --</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="btn btn-secondary flex items-center space-x-2 mt-6"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 card flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loadingHistory ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Hi! I'm your LearnWise AI Assistant
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">
                {selectedProject
                  ? `I'm here to help you with "${selectedProject.title}". Ask me anything about your project, learning strategies, or resource recommendations!`
                  : "I'm here to help with your learning journey. Ask me anything about your projects, learning strategies, or resource recommendations!"}
              </p>

              {/* Suggested Prompts */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-3">Try asking:</p>
                <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(prompt)}
                      className="px-4 py-2 bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 rounded-full text-sm transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {loading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-2xl rounded-tl-none p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 input"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === 'USER';

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-primary-600'
            : 'bg-gradient-to-br from-primary-100 to-secondary-100'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-primary-600" />
        )}
      </div>

      <div className="flex-1 max-w-3xl">
        <div
          className={`rounded-2xl p-4 ${
            isUser
              ? 'bg-primary-600 text-white rounded-tr-none ml-auto'
              : 'bg-gray-100 text-gray-900 rounded-tl-none'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : ''}`}>
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
