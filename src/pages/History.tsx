
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, ArrowLeft, Download, Calendar } from "lucide-react";
import { format } from 'date-fns';
import { useUserStore } from '@/store/userStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface HistoryItem {
  question: string;
  answer: string;
  timestamp: string;
  astrologer: string;
  category: string;
}

interface GroupedHistory {
  [date: string]: HistoryItem[];
}

export default function History() {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [groupedHistory, setGroupedHistory] = useState<GroupedHistory>({});
  const { name, getUserIdentifier } = useUserStore();
  
  useEffect(() => {
    // Check if user details exist
    const userIdentifier = getUserIdentifier();
    if (!userIdentifier) {
      navigate('/enter-details');
      return;
    }
    
    // Load history data
    const historyKey = `questionHistory-${userIdentifier}`;
    const savedHistory = localStorage.getItem(historyKey);
    
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory) as HistoryItem[];
      setHistoryItems(parsedHistory);
      
      // Group history items by date (YYYY-MM-DD)
      const grouped = parsedHistory.reduce((acc, item) => {
        const date = item.timestamp.split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {} as GroupedHistory);
      
      setGroupedHistory(grouped);
    }
  }, [getUserIdentifier, navigate]);
  
  const exportAsCSV = () => {
    if (historyItems.length === 0) return;
    
    // Create CSV content
    const headers = ['Date', 'Time', 'Category', 'Astrologer', 'Question', 'Answer'];
    const rows = historyItems.map(item => {
      const date = item.timestamp.split('T')[0];
      const time = new Date(item.timestamp).toLocaleTimeString();
      return [
        date,
        time,
        item.category,
        item.astrologer,
        `"${item.question.replace(/"/g, '""')}"`, // Handle quotes in text
        `"${item.answer.replace(/"/g, '""')}"` 
      ].join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `astrology-history-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };
  
  return (
    <div className="min-h-screen bg-black text-white pb-8">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-purple-900/30 to-transparent backdrop-blur-sm border-b border-purple-500/20 z-10">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              className="text-purple-300 hover:text-purple-200 hover:bg-purple-950/30"
              onClick={() => navigate('/categories')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
            
            <Button
              variant="ghost"
              className="text-green-400 hover:text-green-300 hover:bg-green-950/30"
              onClick={exportAsCSV}
              disabled={historyItems.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export as CSV
            </Button>
          </div>
          
          <h1 className="text-2xl font-medium text-white mb-2">Your Consultation History</h1>
          <p className="text-purple-300 text-sm">
            View all your past questions and astrological readings
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto pt-32 px-4">
        {historyItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-purple-900/20 p-8 rounded-lg border border-purple-500/20">
              <h3 className="text-xl text-purple-300 mb-2">No History Yet</h3>
              <p className="text-gray-400 mb-4">
                You haven't asked any questions yet. Consult with our astrologers to start building your history.
              </p>
              <Button
                onClick={() => navigate('/categories')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Find an Astrologer
              </Button>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-theme(spacing.32))]">
            <Tabs defaultValue="byDate" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="byDate">By Date</TabsTrigger>
                <TabsTrigger value="all">All Questions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="byDate" className="space-y-6">
                {Object.keys(groupedHistory).sort().reverse().map(date => (
                  <div key={date} className="bg-purple-900/10 rounded-lg border border-purple-500/20 overflow-hidden">
                    <div className="bg-purple-900/30 px-4 py-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-300" />
                      <h3 className="text-md font-medium">
                        {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                      </h3>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      {groupedHistory[date].map((item, idx) => (
                        <div key={idx} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-purple-300">
                                {format(new Date(item.timestamp), 'h:mm a')}
                              </span>
                              <span className="text-xs bg-amber-800/30 px-2 py-0.5 rounded text-amber-300 border border-amber-500/20">
                                {item.category}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              with {item.astrologer}
                            </span>
                          </div>
                          
                          <div className="bg-blue-900/10 p-3 rounded border border-blue-500/20">
                            <p className="font-medium text-blue-300">You asked:</p>
                            <p className="mt-1 text-white">{item.question}</p>
                          </div>
                          
                          <div className="bg-amber-900/10 p-3 rounded border border-amber-500/20">
                            <p className="font-medium text-amber-300">Answer:</p>
                            <p className="mt-1 text-white">{item.answer}</p>
                          </div>
                          
                          {idx < groupedHistory[date].length - 1 && (
                            <Separator className="bg-purple-500/20" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="all">
                <div className="space-y-4">
                  {historyItems.sort((a, b) => 
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                  ).map((item, idx) => (
                    <div key={idx} className="bg-purple-900/10 p-4 rounded-lg border border-purple-500/20">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-purple-300">
                            {format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}
                          </span>
                          <span className="text-xs bg-amber-800/30 px-2 py-0.5 rounded text-amber-300 border border-amber-500/20">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          with {item.astrologer}
                        </span>
                      </div>
                      
                      <div className="bg-blue-900/10 p-3 rounded border border-blue-500/20 mb-3">
                        <p className="font-medium text-blue-300">You asked:</p>
                        <p className="mt-1 text-white">{item.question}</p>
                      </div>
                      
                      <div className="bg-amber-900/10 p-3 rounded border border-amber-500/20">
                        <p className="font-medium text-amber-300">Answer:</p>
                        <p className="mt-1 text-white">{item.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
