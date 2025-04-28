
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AstrologerCard from '@/components/AstrologerCard';

// Mock data for astrologers
const astrologersByCategory = {
  1: { // Love
    title: "Love",
    astrologers: [
      { name: "Pandit Jayvant Sharma", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027", experience: "15+ Years", expertise: "Love & Relationship Expert" },
      { name: "Acharya Deepak Joshi", image: "https://images.unsplash.com/photo-1500673922987-e212871fec22", experience: "12+ Years", expertise: "Relationship Counselor" },
      { name: "Guru Priya Malhotra", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07", experience: "10+ Years", expertise: "Love Astrology Specialist" },
      { name: "Dr. Amit Khanna", image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb", experience: "8+ Years", expertise: "Relationship Guide" },
      { name: "Pandit Rajesh Kumar", image: "https://images.unsplash.com/photo-1466442929976-97f336a657be", experience: "20+ Years", expertise: "Love Life Advisor" },
    ]
  },
  2: { // Marriage
    title: "Marriage",
    astrologers: [
      { name: "Dr. Preeti Singh", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07", experience: "18+ Years", expertise: "Marriage Compatibility Expert" },
      { name: "Acharya Vikram Shastri", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027", experience: "14+ Years", expertise: "Wedding Muhurat Specialist" },
      { name: "Guru Kiran Jyotish", image: "https://images.unsplash.com/photo-1466442929976-97f336a657be", experience: "16+ Years", expertise: "Marriage Counselor" },
      { name: "Pandit Ramesh Gupta", image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb", experience: "12+ Years", expertise: "Matrimonial Astrologer" },
      { name: "Dr. Neha Sharma", image: "https://images.unsplash.com/photo-1500673922987-e212871fec22", experience: "10+ Years", expertise: "Marriage Problem Solver" },
    ]
  },
  3: { // Career
    title: "Career",
    astrologers: [
      { name: "Dr. Vijay Kapoor", image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb", experience: "20+ Years", expertise: "Career Path Analyst" },
      { name: "Guru Shanti Devi", image: "https://images.unsplash.com/photo-1466442929976-97f336a657be", experience: "15+ Years", expertise: "Professional Growth Expert" },
      { name: "Acharya Rahul Sharma", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027", experience: "12+ Years", expertise: "Job Change Specialist" },
      { name: "Pandit Suresh Kumar", image: "https://images.unsplash.com/photo-1500673922987-e212871fec22", experience: "18+ Years", expertise: "Career Astrologer" },
      { name: "Dr. Ananya Verma", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07", experience: "10+ Years", expertise: "Business Success Guide" },
    ]
  },
  4: { // Life Coach
    title: "Life Coach",
    astrologers: [
      { name: "Guru Amrit Singh", image: "https://images.unsplash.com/photo-1466442929976-97f336a657be", experience: "25+ Years", expertise: "Spiritual Life Guide" },
      { name: "Dr. Maya Sharma", image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb", experience: "15+ Years", expertise: "Holistic Life Coach" },
      { name: "Acharya Raj Malhotra", image: "https://images.unsplash.com/photo-1500673922987-e212871fec22", experience: "18+ Years", expertise: "Mindfulness Expert" },
      { name: "Pandit Vikash Joshi", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027", experience: "20+ Years", expertise: "Personal Development Guru" },
      { name: "Dr. Lakshmi Patel", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07", experience: "12+ Years", expertise: "Transformation Specialist" },
    ]
  },
  5: { // Wealth
    title: "Wealth",
    astrologers: [
      { name: "Pandit Dinesh Mehta", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027", experience: "20+ Years", expertise: "Financial Astrologer" },
      { name: "Dr. Ravi Aggarwal", image: "https://images.unsplash.com/photo-1466442929976-97f336a657be", experience: "15+ Years", expertise: "Prosperity Guide" },
      { name: "Guru Meera Patel", image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb", experience: "12+ Years", expertise: "Business Success Specialist" },
      { name: "Acharya Sundar Iyer", image: "https://images.unsplash.com/photo-1500673922987-e212871fec22", experience: "18+ Years", expertise: "Wealth Accumulation Expert" },
      { name: "Dr. Anjali Sharma", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07", experience: "16+ Years", expertise: "Financial Growth Advisor" },
    ]
  },
  6: { // General
    title: "General",
    astrologers: [
      { name: "Acharya Devendra Shastri", image: "https://images.unsplash.com/photo-1466442929976-97f336a657be", experience: "30+ Years", expertise: "Vedic Astrology Expert" },
      { name: "Guru Nirmala Devi", image: "https://images.unsplash.com/photo-1500673922987-e212871fec22", experience: "25+ Years", expertise: "Traditional Astrologer" },
      { name: "Dr. Rajeev Kapoor", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027", experience: "20+ Years", expertise: "General Life Guide" },
      { name: "Pandit Hari Om", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07", experience: "15+ Years", expertise: "Holistic Astrologer" },
      { name: "Dr. Kavita Joshi", image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb", experience: "18+ Years", expertise: "Spiritual Guide" },
    ]
  },
  7: { // Vastu
    title: "Vastu",
    astrologers: [
      { name: "Guru Ram Shankar", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027", experience: "25+ Years", expertise: "Vastu Shastra Expert" },
      { name: "Dr. Sarita Gupta", image: "https://images.unsplash.com/photo-1466442929976-97f336a657be", experience: "20+ Years", expertise: "Home & Office Vastu Specialist" },
      { name: "Acharya Mohan Das", image: "https://images.unsplash.com/photo-1500673922987-e212871fec22", experience: "15+ Years", expertise: "Commercial Vastu Consultant" },
      { name: "Pandit Vinay Tiwari", image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb", experience: "18+ Years", expertise: "Vastu & Feng Shui Master" },
      { name: "Dr. Sunita Agarwal", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07", experience: "12+ Years", expertise: "Residential Vastu Expert" },
    ]
  }
};

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
    </div>
  );
};
