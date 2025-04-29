
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, ArrowLeft, Send, Loader } from "lucide-react";
import { toast } from "sonner";
import ChatMessage from '@/components/ChatMessage';
import SubscriptionDialog from '@/components/SubscriptionDialog';
import { astrologersByCategory } from './CategoryDetails';
import { getRandomAstrologyResponse } from '@/utils/astrologyResponses';

interface Message {
  text: string;
  isAstrologer: boolean;
  timestamp: string;
}

const FREE_MESSAGES_LIMIT = 5;

export default function ChatBox() {
  const { categoryId, astrologerId } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSubscription, setShowSubscription] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [isAstrologerTyping, setIsAstrologerTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const category = astrologersByCategory[Number(categoryId) as keyof typeof astrologersByCategory];
  const astrologer = category?.astrologers.find(
    a => a.name.toLowerCase().replace(/\s+/g, '-') === astrologerId
  );

  useEffect(() => {
    // Load messages from localStorage
    const savedMessages = localStorage.getItem('chatMessages');
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
      localStorage.setItem('chatMessages', JSON.stringify([welcomeMessage]));
    }

    // Load message count from localStorage
    const savedCount = localStorage.getItem('userMessageCount');
    if (savedCount) {
      setUserMessageCount(parseInt(savedCount));
    }
  }, [astrologer]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
    
    // Save messages to localStorage whenever messages change
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    if (userMessageCount >= FREE_MESSAGES_LIMIT) {
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

    // Update message count
    const newCount = userMessageCount + 1;
    setUserMessageCount(newCount);
    localStorage.setItem('userMessageCount', newCount.toString());

    // Show subscription dialog when limit is reached
    if (newCount === FREE_MESSAGES_LIMIT) {
      toast.warning("You have used all your free questions. Subscribe to continue chatting!");
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

  if (!astrologer) {
    return <div>Astrologer not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-purple-900/30 to-transparent backdrop-blur-sm border-b border-purple-500/20 z-10">
        <div className="max-w-3xl mx-auto p-4">
          <Button 
            variant="ghost" 
            className="mb-4 text-purple-300 hover:text-purple-200 hover:bg-purple-950/30"
            onClick={() => navigate(`/category/${categoryId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Astrologers
          </Button>
          
          <div className="flex items-center gap-4">
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
              placeholder={userMessageCount >= FREE_MESSAGES_LIMIT ? "Subscribe to ask more questions" : "Type your question here..."}
              className="bg-purple-950/20 border-purple-500/20 text-white placeholder:text-purple-300/50"
              disabled={userMessageCount >= FREE_MESSAGES_LIMIT}
            />
            <Button 
              onClick={handleSend}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={userMessageCount >= FREE_MESSAGES_LIMIT}
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
