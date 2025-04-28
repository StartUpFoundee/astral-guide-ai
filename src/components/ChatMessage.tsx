
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
          ? "bg-gradient-to-br from-purple-900/20 to-indigo-900/20 text-white border border-purple-500/20"
          : "bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-white border border-purple-400/20"
      )}>
        <p className="text-sm">{message}</p>
        {timestamp && (
          <p className="text-[10px] mt-1 opacity-50">{timestamp}</p>
        )}
      </div>
      {!isAstrologer && (
        <Avatar className="h-8 w-8 bg-purple-500/20 border-2 border-purple-500/30">
          <AvatarFallback>
            <UserRound className="h-4 w-4 text-purple-300" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
