"use client";
import React, { useState, useRef, useEffect } from "react";
import { API_BASE } from "@/lib/api";

interface ChatMessage {
  question: string;
  answer: string;
  isTyping?: boolean;
}

/**
 * Custom hook for typewriter effect
 */
const useTypewriter = (text: string, speed: number = 30) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    if (!text) return;

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayedText, isComplete };
};

/**
 * A fixed bottom chat modal for the pop-out view with collapsible functionality.
 */
const ChatModal = ({ 
  children, 
  onClose,
  isExpanded,
  onToggleExpand 
}: { 
  children: React.ReactNode; 
  onClose: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [height, setHeight] = useState<number | string>('auto');

  // Handle mouse down on the drag handle
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!modalRef.current) return;
    setIsDragging(true);
    setStartY(e.clientY);
    const currentHeight = modalRef.current.offsetHeight;
    setStartHeight(currentHeight);
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  };

  // Handle mouse move for resizing
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !modalRef.current) return;
      
      const deltaY = startY - e.clientY;
      const newHeight = Math.min(
        window.innerHeight - 50, // Max height
        Math.max(200, startHeight + deltaY) // Min height of 200px
      );
      
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startHeight, startY]);

  // Toggle between expanded and collapsed states
  const toggleExpand = () => {
    if (isExpanded) {
      setHeight(200); // Collapsed height
    } else {
      setHeight('80vh'); // Expanded height
    }
    onToggleExpand();
  };

  return (
    <div className="fixed inset-0 bottom-0 z-50 pointer-events-none">
      {/* Backdrop overlay */}
      <div 
        // className={`absolute inset-0 bg-black/10 backdrop-blur-sm transition-opacity duration-200 ${isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Fixed bottom chat container */}
      <div className="fixed bottom-0 right-6 mb-1 w-96 pointer-events-auto" style={{ height: isExpanded ? height : 'auto' }}>
        <div className="h-full flex flex-col">
          {/* Spacer to push content to bottom when not expanded */}
          {!isExpanded && <div className="flex-1" />}
          
          {/* Chat container */}
          <div 
            ref={modalRef}
            className={`backdrop-blur-xl bg-white/95 border border-white/20 shadow-2xl shadow-slate-900/20 rounded-t-2xl flex flex-col transition-all duration-200 ${
              isExpanded ? 'rounded-b-none' : 'rounded-b-2xl hover:shadow-lg cursor-pointer'
            }`}
            style={{
              height: isExpanded ? '100%' : 'auto',
              maxHeight: isExpanded ? 'calc(100vh - 2rem)' : '200px',
            }}
            onClick={!isExpanded ? onToggleExpand : undefined}
          >
            {/* Drag handle */}
            {isExpanded && (
              <div 
                className="h-2 w-full bg-transparent cursor-row-resize flex items-center justify-center group"
                onMouseDown={handleMouseDown}
              >
                <div className="w-16 h-1 rounded-full bg-slate-300 group-hover:bg-slate-400 transition-colors" />
              </div>
            )}
            
            {/* Toggle expand/collapse button */}
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand();
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100/80 transition-all duration-200"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isExpanded ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  )}
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100/80 transition-all duration-200 ml-1"
                title="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Component for rendering individual chat messages with typewriter effect
 */
const ChatMessage: React.FC<{ 
  message: ChatMessage; 
  isLast: boolean; 
  onTypingComplete?: () => void;
}> = ({ message, isLast, onTypingComplete }) => {
  const { displayedText, isComplete } = useTypewriter(
    message.isTyping ? message.answer : message.answer, 
    25
  );

  useEffect(() => {
    if (isComplete && onTypingComplete) {
      onTypingComplete();
    }
  }, [isComplete, onTypingComplete]);

  return (
    <div className="space-y-4">
      {/* User's Question */}
      <div className="flex justify-end">
        <div className="max-w-[80%] backdrop-blur-sm bg-slate-800/90 text-white text-sm rounded-2xl rounded-br-md px-4 py-3 shadow-lg">
          {message.question}
        </div>
      </div>
      
      {/* AI's Answer */}
      <div className="flex justify-start">
        <div className="max-w-[85%] backdrop-blur-sm bg-slate-100/80 border border-slate-200/50 text-slate-700 text-sm rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.isTyping ? displayedText : message.answer}
            {message.isTyping && !isComplete && (
              <span className="inline-block w-0.5 h-4 bg-slate-600 ml-0.5 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * The core UI and logic for the chat, designed to be used both in the sidebar and the pop-out modal.
 */
export interface ChatUIProps {
  publicationId: number;
  isPoppedOut?: boolean;
  onPopOutToggle: () => void;
  onExpandToggle: () => void;
  isExpanded: boolean;
  onClose?: () => void;
}

const ChatUI: React.FC<ChatUIProps> = ({ 
  publicationId, 
  isPoppedOut = false, 
  onPopOutToggle, 
  onExpandToggle, 
  isExpanded,
  onClose
}) => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const storageKey = `chat_history_${publicationId}`;

  // Auto scroll to bottom when new messages are added
  // useEffect(() => {
  //   if (chatContainerRef.current) {
  //     chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  //   }
  // }, [history]);

  // Load chat history from localStorage on mount (without typewriter effect for saved messages)
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(storageKey);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        // Ensure saved messages don't have typing effect
        const historyWithoutTyping = parsedHistory.map((msg: ChatMessage) => ({
          ...msg,
          isTyping: false
        }));
        setHistory(historyWithoutTyping);
      }
    } catch (error) {
      console.error('Failed to load chat history from localStorage:', error);
    }
  }, [storageKey]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    try {
      if (history.length > 0) {
        // Save without isTyping flag
        const historyToSave = history.map(({ isTyping, ...msg }) => msg);
        localStorage.setItem(storageKey, JSON.stringify(historyToSave));
      }
    } catch (error) {
      console.error('Failed to save chat history to localStorage:', error);
    }
  }, [history, storageKey]);

  // Function to handle the API call
  async function askQuestion() {
    if (!question.trim() || isLoading) return;
    setIsLoading(true);

    const currentQuestion = question;
    setQuestion(""); // Clear input immediately

    // Add question immediately to chat
    const newMessage: ChatMessage = {
      question: currentQuestion,
      answer: "",
      isTyping: true
    };
    
    setHistory(prev => [...prev, newMessage]);

    try {
      const res = await fetch(`${API_BASE}/qa/single-doc`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ publication_id: publicationId, question: currentQuestion, k: 6 })
      });
      
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data = await res.json();
      const answer = data.answer || "Sorry, I couldn't find an answer.";
      
      // Update the last message with the answer and enable typewriter effect
      setHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          answer,
          isTyping: true
        };
        return updated;
      });
      
    } catch (error) {
      console.error("Failed to fetch answer:", error);
      
      // Update the last message with error
      setHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          answer: "An error occurred while fetching the answer. Please try again.",
          isTyping: true
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Handle typing completion for the last message
  const handleTypingComplete = () => {
    setHistory(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          isTyping: false
        };
      }
      return updated;
    });
  };

  // Handle Enter key press to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-slate-800">
            {isPoppedOut ? 'Publication Q&A' : 'Ask Questions'}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {!isPoppedOut && (
            <>
              <button 
                onClick={onExpandToggle} 
                title={isExpanded ? "Collapse" : "Expand"}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isExpanded ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7-7m0 0l-7 7m7-7v18" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  )}
                </svg>
              </button>
              <button 
                onClick={onPopOutToggle} 
                title="Pop-out Chat"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Chat History Area */}
      <div 
        ref={chatContainerRef} 
        className={`flex-grow p-6 overflow-y-auto transition-all duration-300 ${
          isPoppedOut ? 'h-full' : isExpanded ? 'h-80' : 'h-48'
        }`}
      >
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100/80 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="font-medium text-slate-700 mb-2">Start a conversation</h4>
            <p className="text-sm text-slate-500 max-w-xs">
              Ask anything about this publication and get instant answers
            </p>
          </div>
        )}
        
        <div className="space-y-6">
          {history.map((chat, index) => (
            <ChatMessage 
              key={index}
              message={chat}
              isLast={index === history.length - 1}
              onTypingComplete={index === history.length - 1 ? handleTypingComplete : undefined}
            />
          ))}
        </div>
        
        {/* Loading indicator - only show when waiting for API response */}
        {isLoading && history.length > 0 && !history[history.length - 1].answer && (
          <div className="flex justify-start mt-6">
            <div className="backdrop-blur-sm bg-slate-100/80 border border-slate-200/50 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-6 border-t border-slate-200/30 flex-shrink-0">
        <div className="relative">
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full backdrop-blur-sm bg-white/80 border border-slate-200/50 rounded-xl px-4 py-3 pr-12 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-transparent resize-none transition-all duration-200"
            placeholder="Ask anything about this publication..."
            rows={isPoppedOut ? 3 : 2}
            disabled={isLoading}
          />
          <button
            onClick={askQuestion}
            disabled={isLoading || !question.trim()}
            title="Send message"
            className="absolute right-3 bottom-3 p-2 rounded-lg bg-slate-800 text-white disabled:bg-slate-400 disabled:cursor-not-allowed hover:bg-slate-700 transition-all duration-200 shadow-lg shadow-slate-800/25"
          >
            {isLoading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        
        {isPoppedOut && (
          <p className="text-xs text-slate-500 mt-2 text-center">
            Press Enter to send • Shift + Enter for new line
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * The main component that manages the state for expanded and pop-out views.
 */
const ChatRAG: React.FC<{ publicationId: number }> = ({ publicationId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPoppedOut, setIsPoppedOut] = useState(false);
  const [isModalExpanded, setIsModalExpanded] = useState(true);

  const toggleExpand = () => setIsExpanded((prev) => !prev);
  const togglePopOut = () => {
    setIsPoppedOut((prev) => !prev);
    // Reset modal state when closing
    if (isPoppedOut) {
      setIsModalExpanded(true);
    }
  };
  const closePopOut = () => {
    setIsPoppedOut(false);
    setIsModalExpanded(true);
  };
  
  const toggleModalExpand = () => {
    setIsModalExpanded((prev) => !prev);
  };

  return (
    <>
      {/* The default chat component in the sidebar */}
      {!isPoppedOut && (
        <div className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg shadow-slate-200/50">
          <ChatUI 
            publicationId={publicationId} 
            isExpanded={isExpanded} 
            isPoppedOut={false} 
            onExpandToggle={toggleExpand}
            onPopOutToggle={togglePopOut}
          />
        </div>
      )}

      {/* The modal for the pop-out view, rendered conditionally */}
      {isPoppedOut && (
        <ChatModal 
          onClose={closePopOut}
          isExpanded={isModalExpanded}
          onToggleExpand={toggleModalExpand}
        >
          <ChatUI 
            publicationId={publicationId} 
            isExpanded={isModalExpanded} 
            isPoppedOut={true} 
            onExpandToggle={toggleExpand}
            onPopOutToggle={togglePopOut}
            onClose={closePopOut}
          />
        </ChatModal>
      )}
    </>
  );
};

export default ChatRAG;