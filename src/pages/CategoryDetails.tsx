import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AstrologerCard from '@/components/AstrologerCard';
import { astrologersByCategory } from '@/utils/astrologerData';
import React from 'react';
import NavLinks from '@/components/NavLinks';

export default function CategoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const categoryId = id ? parseInt(id) : 1;
  const category = astrologersByCategory[categoryId as keyof typeof astrologersByCategory];

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-8 text-purple-300 hover:text-purple-200 hover:bg-purple-950/30"
          onClick={() => navigate('/categories')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>

        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-serif mb-4">{category.title} Astrology</h1>
          <p className="text-purple-300/80">
            Consult with our expert astrologers specialized in {category.title.toLowerCase()} matters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {category.astrologers.map((astrologer, index) => (
            <AstrologerCard
              key={index}
              name={astrologer.name}
              image={astrologer.image}
              experience={astrologer.experience}
              expertise={astrologer.expertise}
            />
          ))}
        </div>
      </div>
      
      {/* Add NavLinks at the bottom */}
      <NavLinks />
    </div>
  );
}
