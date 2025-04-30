
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { History, User } from "lucide-react";

export default function NavLinks() {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-10">
      <div className="bg-purple-900/30 backdrop-blur-md rounded-full px-4 py-2 border border-purple-500/20 flex gap-2">
        <Button 
          variant="ghost"
          size="sm"
          asChild
          className={`text-sm ${location.pathname === '/categories' ? 'bg-purple-700/50 text-white' : 'text-purple-300'}`}
        >
          <Link to="/categories">
            <User className="h-4 w-4 mr-1" />
            Astrologers
          </Link>
        </Button>
        
        <Button 
          variant="ghost"
          size="sm"
          asChild
          className={`text-sm ${location.pathname === '/history' ? 'bg-purple-700/50 text-white' : 'text-purple-300'}`}
        >
          <Link to="/history">
            <History className="h-4 w-4 mr-1" />
            History
          </Link>
        </Button>
      </div>
    </div>
  );
}
