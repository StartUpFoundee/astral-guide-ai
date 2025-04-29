
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isAstrologer: boolean;
  astrologerImage?: string;
  astrologerName?: string;
  timestamp?: string;
}

const ChatMessage = ({ message, isAstrologer, astrologerImage, astrologerName, timestamp }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex w-full gap-2 mb-4",
      isAstrologer ? "justify-start" : "justify-end"
    )}>
      {isAstrologer && (
        <Avatar className="h-8 w-8 border-2 border-purple-500/30">
          <AvatarImage src={astrologerImage} />
          <AvatarFallback>
            <UserRound className="h-4 w-4 text-purple-300" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-2",
        isAstrologer 
          ? "bg-gradient-to-br from-amber-700/20 to-amber-800/20 text-white border border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]"
          : "bg-gradient-to-br from-blue-600/20 to-indigo-600/20 text-white border border-blue-400/20 shadow-[0_0_8px_rgba(96,165,250,0.1)]"
      )}>
        <p className="text-sm">{message}</p>
        {timestamp && (
          <p className="text-[10px] mt-1 opacity-50">{timestamp}</p>
        )}
      </div>
      {!isAstrologer && (
        <Avatar className="h-8 w-8 bg-blue-500/20 border-2 border-blue-500/30">
          <AvatarFallback>
            <UserRound className="h-4 w-4 text-blue-300" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
