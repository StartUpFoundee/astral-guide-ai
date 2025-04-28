import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { UserRound } from "lucide-react";

interface AstrologerCardProps {
  name: string;
  image: string;
  experience: string;
  expertise: string;
}

const AstrologerCard = ({ name, image, experience, expertise }: AstrologerCardProps) => {
  const navigate = useNavigate();
  const { id: categoryId } = useParams();
  const fullImageUrl = `${image}?auto=format&fit=crop&w=150&q=80`;
  
  const handleClick = () => {
    // For now using the name as a simple ID, in production we'd use proper IDs
    const astrologerId = name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/chat/${categoryId}/${astrologerId}`);
  };
  
  return (
    <div 
      onClick={handleClick}
      className="bg-gradient-to-br from-purple-900/10 to-indigo-900/10 backdrop-blur-sm
                border border-purple-500/20 rounded-lg p-6
                transform transition-all duration-300 hover:scale-105
                hover:shadow-lg hover:shadow-purple-500/10
                cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <HoverCard>
          <HoverCardTrigger>
            <Avatar className="h-16 w-16 border-2 border-purple-500/30">
              <AvatarImage src={fullImageUrl} alt={name} />
              <AvatarFallback>
                <UserRound className="h-8 w-8 text-purple-300" />
              </AvatarFallback>
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="bg-black/90 border-purple-500/20">
            <div className="text-white space-y-2">
              <h4 className="text-purple-200">{name}</h4>
              <p className="text-sm text-purple-300/80">{expertise}</p>
            </div>
          </HoverCardContent>
        </HoverCard>
        
        <div className="space-y-1">
          <h3 className="text-xl font-medium text-white">{name}</h3>
          <p className="text-purple-200/80 text-sm">{experience}</p>
          <p className="text-purple-300/70 text-sm">{expertise}</p>
        </div>
      </div>
    </div>
  );
};

export default AstrologerCard;
