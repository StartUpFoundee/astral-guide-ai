
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, ArrowLeft, Send, Loader, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ChatMessage from '@/components/ChatMessage';
import SubscriptionDialog from '@/components/SubscriptionDialog';
import { astrologersByCategory } from '@/utils/astrologerData';
import { getRandomAstrologyResponse } from '@/utils/astrologyResponses';
import { useUserStore } from '@/store/userStore';

interface Message {
  text: string;
  isAstrologer: boolean;
  timestamp: string;
}

export default function ChatBox() {
  const { categoryId, astrologerId } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSubscription, setShowSubscription] = useState(false);
  const [isAstrologerTyping, setIsAstrologerTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Use the enhanced user store
  const { 
    incrementQuestionCount, 
    hasReachedFreeLimit, 
    remainingQuestions,
    hasSubscription
  } = useUserStore();
  
  const category = astrologersByCategory[Number(categoryId) as keyof typeof astrologersByCategory];
  const astrologer = category?.astrologers.find(
    a => a.name.toLowerCase().replace(/\s+/g, '-') === astrologerId
  );

  useEffect(() => {
    // Load messages from localStorage
    const savedMessages = localStorage.getItem(`chatMessages-${astrologerId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else if (astrologer && messages.length === 0) {
      // Send welcome message when chat opens and no saved messages
      const welcomeMessage = {
        text: `Namaste! I'm ${astrologer.name}. I specialize in ${astrologer.expertise}. Please feel free to ask your questions about your future.`,
        isAstrologer: true,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([welcomeMessage]);
      localStorage.setItem(`chatMessages-${astrologerId}`, JSON.stringify([welcomeMessage]));
    }

    // Check if user has reached free limit on initial load
    if (hasReachedFreeLimit() && !hasSubscription) {
      toast.warning("You have used all your free questions. Subscribe to continue chatting!");
    }
  }, [astrologer, astrologerId, hasReachedFreeLimit, hasSubscription]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
    
    // Save messages to localStorage whenever messages change
    if (messages.length > 0 && astrologerId) {
      localStorage.setItem(`chatMessages-${astrologerId}`, JSON.stringify(messages));
    }
  }, [messages, astrologerId]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Check if user has reached free limit
    if (hasReachedFreeLimit() && !hasSubscription) {
      setShowSubscription(true);
      return;
    }

    // Add user message
    const userMessage = {
      text: input,
      isAstrologer: false,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Increment question count
    incrementQuestionCount();

    // Show subscription dialog when limit is reached
    if (hasReachedFreeLimit() && !hasSubscription) {
      toast.warning("You have used all your free questions. Subscribe to continue chatting!");
    } else {
      const remaining = remainingQuestions();
      if (remaining <= 3 && remaining > 0 && !hasSubscription) {
        toast.info(`You have ${remaining} free questions remaining.`);
      }
    }

    // Show typing indicator
    setIsAstrologerTyping(true);

    // Simulate astrologer response after 2-3 seconds
    const typingDelay = Math.floor(Math.random() * 1000) + 2000; // 2-3 seconds
    
    setTimeout(() => {
      const astrologerMessage = {
        text: getRandomAstrologyResponse(),
        isAstrologer: true,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, astrologerMessage]);
      setIsAstrologerTyping(false);
    }, typingDelay);
  };

  const clearChat = () => {
    // Clear chat messages
    setMessages([]);
    
    if (astrologerId) {
      localStorage.removeItem(`chatMessages-${astrologerId}`);
    }
    
    // Add welcome message again
    if (astrologer) {
      const welcomeMessage = {
        text: `Namaste! I'm ${astrologer.name}. I specialize in ${astrologer.expertise}. Please feel free to ask your questions about your future.`,
        isAstrologer: true,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([welcomeMessage]);
      if (astrologerId) {
        localStorage.setItem(`chatMessages-${astrologerId}`, JSON.stringify([welcomeMessage]));
      }
    }
    
    toast.success("Chat history cleared successfully");
  };

  if (!astrologer) {
    return <div>Astrologer not found</div>;
  }

  const isDisabled = hasReachedFreeLimit() && !hasSubscription;
  const remainingQuestionsCount = remainingQuestions();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-purple-900/30 to-transparent backdrop-blur-sm border-b border-purple-500/20 z-10">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              className="text-purple-300 hover:text-purple-200 hover:bg-purple-950/30"
              onClick={() => navigate(`/category/${categoryId}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Astrologers
            </Button>
            
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
              onClick={clearChat}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Chat
            </Button>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-purple-500/30">
                <AvatarImage src={astrologer.image} />
                <AvatarFallback>
                  <UserRound className="h-6 w-6 text-purple-300" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-medium text-white">{astrologer.name}</h2>
                <p className="text-sm text-purple-300">{astrologer.expertise}</p>
              </div>
            </div>
            
            {!hasSubscription && (
              <div className="bg-purple-800/30 px-3 py-1 rounded-full text-xs text-purple-200 border border-purple-500/30">
                {isDisabled 
                  ? "0 questions left" 
                  : remainingQuestionsCount === Infinity 
                    ? "Unlimited" 
                    : `${remainingQuestionsCount} question${remainingQuestionsCount !== 1 ? 's' : ''} left`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-3xl mx-auto pt-32 pb-24 px-4">
        <ScrollArea className="h-[calc(100vh-theme(spacing.32)-theme(spacing.24))]" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                isAstrologer={message.isAstrologer}
                astrologerImage={message.isAstrologer ? astrologer.image : undefined}
                astrologerName={message.isAstrologer ? astrologer.name : undefined}
                timestamp={message.timestamp}
              />
            ))}
            
            {isAstrologerTyping && (
              <div className="flex items-center gap-2 ml-2 mb-4">
                <Avatar className="h-8 w-8 border-2 border-purple-500/30">
                  <AvatarImage src={astrologer.image} />
                  <AvatarFallback>
                    <UserRound className="h-4 w-4 text-purple-300" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gradient-to-br from-amber-700/20 to-amber-800/20 text-white border border-amber-500/20 rounded-2xl px-4 py-2">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-200 text-sm">Typing</span>
                    <Loader className="h-3 w-3 text-amber-200 animate-spin" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isDisabled ? "Subscribe to ask more questions" : "Type your question here..."}
              className="bg-purple-950/20 border-purple-500/20 text-white placeholder:text-purple-300/50"
              disabled={isDisabled}
            />
            <Button 
              onClick={handleSend}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isDisabled}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <SubscriptionDialog 
        open={showSubscription} 
        onOpenChange={setShowSubscription}
      />
    </div>
  );
}
