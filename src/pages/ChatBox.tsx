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
import NavLinks from '@/components/NavLinks';
import { astrologersByCategory } from '@/utils/astrologerData';
import { getRandomAstrologyResponse } from '@/utils/astrologyResponses';
import { useUserStore } from '@/store/userStore';

interface Message {
  text: string;
  isAstrologer: boolean;
  timestamp: string;
}

interface HistoryItem {
  question: string;
  answer: string;
  timestamp: string;
  astrologer: string;
  category: string;
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
    hasSubscription,
    name,
    dateOfBirth,
    timeOfBirth
  } = useUserStore();
  
  const category = astrologersByCategory[Number(categoryId) as keyof typeof astrologersByCategory];
  const astrologer = category?.astrologers.find(
    a => a.name.toLowerCase().replace(/\s+/g, '-') === astrologerId
  );

  useEffect(() => {
    // Check if we have user details
    if (!name || !dateOfBirth || !timeOfBirth) {
      toast.error("Please enter your details first");
      navigate("/enter-details");
      return;
    }

    // Store last active session
    localStorage.setItem('lastAstrologer', astrologerId || '');
    localStorage.setItem('lastCategory', categoryId || '');

    // Load messages from localStorage
    const savedMessages = localStorage.getItem(`chatMessages-${astrologerId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else if (astrologer && messages.length === 0) {
      // Send welcome message when chat opens and no saved messages
      let welcomeMessage = '';
      
      // Personalize welcome message based on astrologer
      switch(astrologer.name.split(' ')[0]) { // Use first name for matching
        case 'Jayvant':
          welcomeMessage = `Namaste! I'm ${astrologer.name}, a friendly astrologer specializing in ${astrologer.expertise}. How may I assist you today?`;
          break;
        case 'Aarya':
          welcomeMessage = `Namaste! I'm ${astrologer.name}, a traditional astrologer following ancient Vedic principles. I specialize in ${astrologer.expertise}. What guidance do you seek?`;
          break;
        case 'Ved':
          welcomeMessage = `Om Shanti! I'm ${astrologer.name}, a spiritual guide with expertise in ${astrologer.expertise}. Let's explore your cosmic journey together.`;
          break;
        case 'Tara':
          welcomeMessage = `Hello! I'm ${astrologer.name}, a logical and analytical astrologer specializing in ${astrologer.expertise}. I use precise calculations for accurate readings.`;
          break;
        case 'Omkar':
          welcomeMessage = `Greetings! I'm ${astrologer.name}, a practical astrologer focused on ${astrologer.expertise}. I provide actionable insights you can apply to your life.`;
          break;
        default:
          welcomeMessage = `Namaste! I'm ${astrologer.name}. I specialize in ${astrologer.expertise}. Please feel free to ask your questions about your future.`;
      }
      
      const welcomeMsg = {
        text: welcomeMessage,
        isAstrologer: true,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages([welcomeMsg]);
      localStorage.setItem(`chatMessages-${astrologerId}`, JSON.stringify([welcomeMsg]));
    }

    // Check if user has reached free limit on initial load
    if (hasReachedFreeLimit()) {
      setShowSubscription(true);
    }
    
    // Check if user is returning after 24+ hours
    const lastVisit = localStorage.getItem('lastVisitTime');
    const currentTime = new Date().getTime();
    
    if (lastVisit) {
      const hoursDiff = (currentTime - parseInt(lastVisit)) / (1000 * 60 * 60);
      
      // If returning after 24+ hours and still has questions
      if (hoursDiff >= 24 && !hasReachedFreeLimit() && remainingQuestions() > 0) {
        toast.info(`Welcome back! You still have ${remainingQuestions()} free question${remainingQuestions() !== 1 ? 's' : ''} left.`);
      }
    }
    
    // Update last visit time
    localStorage.setItem('lastVisitTime', currentTime.toString());
    
  }, [astrologer, astrologerId, categoryId, hasReachedFreeLimit, hasSubscription, name, dateOfBirth, timeOfBirth, navigate, remainingQuestions]);

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

    // Current timestamp
    const timestamp = new Date().toLocaleTimeString();
    const fullTimestamp = new Date().toISOString();
    
    // Add user message
    const userMessage = {
      text: input,
      isAstrologer: false,
      timestamp
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Increment question count
    incrementQuestionCount();

    // Show subscription dialog when limit is reached
    if (hasReachedFreeLimit() && !hasSubscription) {
      setShowSubscription(true);
    } else {
      const remaining = remainingQuestions();
      if (remaining <= 3 && remaining > 0 && !hasSubscription) {
        toast.info(`You have ${remaining} free questions remaining.`);
      }
    }

    // Show typing indicator
    setIsAstrologerTyping(true);

    // Personalize response based on astrologer personality and category focus
    const getPersonalizedResponse = () => {
      if (!astrologer) return getRandomAstrologyResponse();
      
      const personality = astrologer.name.split(' ')[0]; // Get first name
      const expertise = astrologer.expertise;
      const userQuestion = input.trim();
      
      // Get response with personalization based on astrologer personality
      let response = '';
      
      switch(personality) {
        case 'Jayvant':
          // Friendly tone
          response = getRandomAstrologyResponse() + " I'm happy to provide more insight on this if you'd like!";
          break;
        case 'Aarya':
          // Traditional tone
          response = "According to ancient Vedic teachings, " + getRandomAstrologyResponse();
          break;
        case 'Ved':
          // Spiritual tone
          response = getRandomAstrologyResponse() + " Remember that your spiritual journey is unique and divinely guided.";
          break;
        case 'Tara':
          // Logical tone
          response = "Based on astrological calculations, " + getRandomAstrologyResponse() + " This is supported by planetary positions in your chart.";
          break;
        case 'Omkar':
          // Practical tone
          response = getRandomAstrologyResponse() + " Here's what you can do about it: reflect on your priorities, take small but consistent actions, and remain patient.";
          break;
        default:
          response = getRandomAstrologyResponse();
      }
      
      return response;
    };
    
    // Simulate astrologer response after 2-3 seconds
    const typingDelay = Math.floor(Math.random() * 1000) + 2000; // 2-3 seconds
    
    setTimeout(() => {
      const astrologerResponse = getPersonalizedResponse();
      const astrologerMessage = {
        text: astrologerResponse,
        isAstrologer: true,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, astrologerMessage]);
      setIsAstrologerTyping(false);
      
      // Store this Q&A pair in history
      const userIdentifier = getUserIdentifier();
      if (userIdentifier) {
        // Get existing history or initialize new array
        const historyKey = `questionHistory-${userIdentifier}`;
        const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
        
        // Add new question-answer pair
        const historyItem: HistoryItem = {
          question: input.trim(),
          answer: astrologerResponse,
          timestamp: fullTimestamp,
          astrologer: astrologer?.name || 'Unknown',
          category: category?.name || 'General'
        };
        
        // Update localStorage with new history item
        localStorage.setItem(historyKey, JSON.stringify([...existingHistory, historyItem]));
      }
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
      // Personalize welcome message based on astrologer
      let welcomeMessage = '';
      
      switch(astrologer.name.split(' ')[0]) { // Use first name for matching
        case 'Jayvant':
          welcomeMessage = `Namaste! I'm ${astrologer.name}, a friendly astrologer specializing in ${astrologer.expertise}. How may I assist you today?`;
          break;
        case 'Aarya':
          welcomeMessage = `Namaste! I'm ${astrologer.name}, a traditional astrologer following ancient Vedic principles. I specialize in ${astrologer.expertise}. What guidance do you seek?`;
          break;
        case 'Ved':
          welcomeMessage = `Om Shanti! I'm ${astrologer.name}, a spiritual guide with expertise in ${astrologer.expertise}. Let's explore your cosmic journey together.`;
          break;
        case 'Tara':
          welcomeMessage = `Hello! I'm ${astrologer.name}, a logical and analytical astrologer specializing in ${astrologer.expertise}. I use precise calculations for accurate readings.`;
          break;
        case 'Omkar':
          welcomeMessage = `Greetings! I'm ${astrologer.name}, a practical astrologer focused on ${astrologer.expertise}. I provide actionable insights you can apply to your life.`;
          break;
        default:
          welcomeMessage = `Namaste! I'm ${astrologer.name}. I specialize in ${astrologer.expertise}. Please feel free to ask your questions about your future.`;
      }
      
      const welcomeMsg = {
        text: welcomeMessage,
        isAstrologer: true,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages([welcomeMsg]);
      
      if (astrologerId) {
        localStorage.setItem(`chatMessages-${astrologerId}`, JSON.stringify([welcomeMsg]));
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
              <div className="bg-purple-800/30 px-3 py-1 rounded-full text-xs text-purple-200 border border-purple-500/30 flex items-center gap-1">
                <span className="text-purple-200">Status: </span>
                <span className="font-medium">Free User</span>
                {remainingQuestionsCount !== Infinity && (
                  <span className="ml-1">({remainingQuestionsCount} question{remainingQuestionsCount !== 1 ? 's' : ''} left)</span>
                )}
              </div>
            )}
            
            {hasSubscription && (
              <div className="bg-green-800/30 px-3 py-1 rounded-full text-xs text-green-200 border border-green-500/30 flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-green-400 rounded-full"></span>
                <span className="text-green-200">Status: </span>
                <span className="font-medium">Premium</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-3xl mx-auto pt-32 pb-32 px-4">
        <ScrollArea className="h-[calc(100vh-theme(spacing.32)-theme(spacing.32))]" ref={scrollAreaRef}>
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
      <div className="fixed bottom-16 left-0 right-0 bg-gradient-to-t from-black to-transparent">
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
      
      {/* Navigation Links */}
      <NavLinks />

      <SubscriptionDialog 
        open={showSubscription} 
        onOpenChange={setShowSubscription}
      />
    </div>
  );
}
