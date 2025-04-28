
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Briefcase, LifeBuoy, DollarSign, HelpCircle, Home } from 'lucide-react';
import { Card } from "@/components/ui/card";

const categories = [
  { id: 1, name: 'Love', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { id: 2, name: 'Marriage', icon: Users, color: 'from-red-500 to-orange-500' },
  { id: 3, name: 'Career', icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
  { id: 4, name: 'Life Coach', icon: LifeBuoy, color: 'from-green-500 to-emerald-500' },
  { id: 5, name: 'Wealth', icon: DollarSign, color: 'from-yellow-500 to-amber-500' },
  { id: 6, name: 'General', icon: HelpCircle, color: 'from-purple-500 to-violet-500' },
  { id: 7, name: 'Vastu', icon: Home, color: 'from-indigo-500 to-blue-500' },
];

export default function Categories() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-serif mb-4">Choose Your Path</h1>
          <p className="text-purple-300/80">Select a category to explore your astrological insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className={`
                  relative overflow-hidden p-6 cursor-pointer
                  bg-gradient-to-br ${category.color}/10 hover:${category.color}/20
                  border border-purple-500/20 backdrop-blur-sm
                  transform transition-all duration-300 ease-out
                  hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10
                  flex flex-col items-center justify-center gap-4
                  text-center h-48
                `}
                onClick={() => navigate(`/category/${category.id}`)}
              >
                <Icon className="w-12 h-12" />
                <h3 className="text-xl font-medium">{category.name}</h3>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
