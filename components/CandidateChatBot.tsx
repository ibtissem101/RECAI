import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Sparkles,
  ChevronRight,
  Loader2,
  Search,
  Users,
  Zap,
  ExternalLink,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { Candidate } from "../types";
import { searchCandidatesWithAI, ChatMessage } from "../services/groqService";

interface CandidateChatBotProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
}

const SUGGESTED_QUERIES = [
  "Find candidates who scaled databases at fintech companies",
  "Who has experience with both Python and Go?",
  "Show me candidates who could start immediately",
  "Which candidate would be best for a leadership role?",
  "Who has the strongest online portfolio?",
  "Show me top scorers with AWS experience",
  "Which candidates have startup experience?",
];

const CandidateChatBot: React.FC<CandidateChatBotProps> = ({
  candidates,
  onSelectCandidate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        '👋 Hi! I\'m your AI recruiting assistant powered by Gemini. I can help you search for candidates using natural language. Try asking me things like:\n\n• "Who has Python and cloud experience?"\n• "Find candidates from FAANG companies"\n• "Which candidate is best for a senior role?"\n\nWhat would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (query?: string) => {
    const messageText = query || inputValue.trim();
    if (!messageText || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Search candidates using Gemini AI
      const result = await searchCandidatesWithAI(
        messageText,
        candidates.map((c) => ({
          id: c.id,
          name: c.name,
          role: c.role,
          score: c.score,
          skills: c.skills,
          experienceYears: c.experienceYears,
          previousCompanies: c.previousCompanies,
          webVerification: c.webVerification,
          matchReason: c.matchReason,
          missingSkills: c.missingSkills,
          status: c.status,
          applicationStatus: c.applicationStatus,
        })),
        messages
      );

      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: result.explanation,
        candidates: result.matchedCandidates,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Add follow-up suggestions if available
      if (result.suggestedFollowUp && result.suggestedFollowUp.length > 0) {
        setTimeout(() => {
          const followUpMessage: ChatMessage = {
            role: "assistant",
            content: `💡 **You might also want to ask:**\n${result.suggestedFollowUp
              .map((q) => `• ${q}`)
              .join("\n")}`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, followUpMessage]);
        }, 500);
      }
    } catch (error) {
      console.error("Search failed:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          "I'm sorry, I encountered an error while searching. Please try again or rephrase your query.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCandidateClick = (candidateId: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (candidate) {
      onSelectCandidate(candidate);
    }
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isUser = message.role === "user";

    return (
      <div
        key={index}
        className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} mb-4`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser
              ? "bg-[#3f5ecc] text-white"
              : "bg-gradient-to-br from-[#3f5ecc] to-[#E9C7DB] text-white"
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Content */}
        <div className={`max-w-[80%] ${isUser ? "text-right" : ""}`}>
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? "bg-[#3f5ecc] text-white rounded-tr-md"
                : "bg-white border border-[#BDDEF3] text-slate-700 rounded-tl-md shadow-sm"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>

          {/* Matched Candidates Cards */}
          {message.candidates && message.candidates.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.candidates.slice(0, 5).map((candidate, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCandidateClick(candidate.id)}
                  className="w-full bg-white border border-[#BDDEF3] rounded-xl p-3 text-left hover:border-[#3f5ecc] hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#3f5ecc] font-bold text-xs">
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm group-hover:text-[#3f5ecc]">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Relevance: {candidate.relevanceScore}%
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-[#3f5ecc]" />
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {candidate.matchReason}
                  </p>
                </button>
              ))}
              {message.candidates.length > 5 && (
                <p className="text-xs text-slate-500 text-center">
                  +{message.candidates.length - 5} more candidates match your
                  query
                </p>
              )}
            </div>
          )}

          {/* Timestamp */}
          <p
            className={`text-[10px] text-slate-400 mt-1 ${
              isUser ? "text-right" : ""
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    );
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#3f5ecc] to-[#3552b8] text-white rounded-full shadow-lg shadow-[#3f5ecc]/30 flex items-center justify-center hover:scale-105 transition-transform z-50 group"
      >
        <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E9C7DB] rounded-full flex items-center justify-center text-[10px] font-bold text-slate-700">
          AI
        </span>
      </button>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 w-72 bg-white rounded-xl shadow-xl border border-[#BDDEF3] z-50">
        <div
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#3f5ecc] to-[#E9C7DB] rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm text-slate-800">AI Search</p>
              <p className="text-xs text-slate-500">Click to expand</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-400 hover:text-red-500" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full chat interface
  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-[#BDDEF3] z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3f5ecc] to-[#3552b8] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">AI Candidate Search</h3>
            <p className="text-xs text-white/70">Powered by Gemini</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Minimize2 className="w-4 h-4 text-white/70" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-[#f5f7ff] px-4 py-2 border-b border-[#BDDEF3] flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Users className="w-3.5 h-3.5 text-[#3f5ecc]" />
          <span>{candidates.length} candidates</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Zap className="w-3.5 h-3.5 text-[#E9C7DB]" />
          <span>Semantic search enabled</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#F5F9FC]">
        {messages.map((message, index) => renderMessage(message, index))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3f5ecc] to-[#E9C7DB] flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-[#BDDEF3] rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching with AI...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Queries (show only at start) */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-[#BDDEF3] bg-white">
          <p className="text-xs text-slate-500 mb-2 font-medium">
            Quick searches:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUERIES.slice(0, 3).map((query, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(query)}
                className="text-xs px-2.5 py-1.5 bg-[#eef2ff] text-[#3f5ecc] rounded-full hover:bg-[#3f5ecc] hover:text-white transition-colors"
              >
                {query.length > 30 ? query.substring(0, 30) + "..." : query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-[#BDDEF3] bg-white">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about candidates..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#F5F9FC] border border-[#BDDEF3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3f5ecc]/20 focus:border-[#3f5ecc]"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 bg-[#3f5ecc] text-white rounded-xl hover:bg-[#3552b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#3f5ecc]/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          AI-powered semantic search • Press Enter to send
        </p>
      </div>
    </div>
  );
};

export default CandidateChatBot;
