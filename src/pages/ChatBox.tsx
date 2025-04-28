
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, ArrowLeft, Send } from "lucide-react";
import ChatMessage from '@/components/ChatMessage';
import { astrologersByCategory } from './CategoryDetails';

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Find the astrologer based on the URL params
  const category = astrologersByCategory[Number(categoryId) as keyof typeof astrologersByCategory];
  const astrologer = category?.astrologers.find(
    a => a.name.toLowerCase().replace(/\s+/g, '-') === astrologerId
  );

  useEffect(() => {
    // Send welcome message when chat opens
    if (astrologer && messages.length === 0) {
      const welcomeMessage = {
        text: `Namaste! I'm ${astrologer.name}. I specialize in ${astrologer.expertise}. Please feel free to ask your questions about your future.`,
        isAstrologer: true,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([welcomeMessage]);
    }
  }, [astrologer]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      text: input,
      isAstrologer: false,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate astrologer response after 1 second
    setTimeout(() => {
      const astrologerMessage = {
        text: "Thank you for your question. I'll carefully analyze your birth chart and provide you with insights shortly.",
        isAstrologer: true,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, astrologerMessage]);
    }, 1000);
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
              placeholder="Type your question here..."
              className="bg-purple-950/20 border-purple-500/20 text-white placeholder:text-purple-300/50"
            />
            <Button 
              onClick={handleSend}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
