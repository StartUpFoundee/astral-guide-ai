
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubscriptionDialog = ({ open, onOpenChange }: SubscriptionDialogProps) => {
  const { setSubscription } = useUserStore();

  const handleSubscribe = (plan: 'monthly' | 'yearly') => {
    // In a real app, this would integrate with a payment provider
    setSubscription(true);
    toast.success(`Successfully subscribed to the ${plan} plan!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-b from-purple-900/90 to-black/90 border border-purple-500/30 shadow-[0_0_30px_10px_rgba(147,51,234,0.1)] max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-center bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent pb-2">
            Unlock Unlimited Consultations
          </DialogTitle>
          <DialogDescription className="text-purple-200/80 text-center">
            Continue your spiritual journey with unlimited access to our expert astrologers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="p-4 rounded-lg bg-purple-950/50 border border-purple-500/20 space-y-2 hover:shadow-[0_0_15px_5px_rgba(147,51,234,0.07)] transition-shadow">
            <h3 className="text-lg font-medium text-white flex items-center justify-between">
              Monthly Plan
              <span className="text-amber-300">₹250/month</span>
            </h3>
            <p className="text-sm text-purple-200/70">Perfect for regular consultations</p>
            <Button 
              onClick={() => handleSubscribe('monthly')}
              className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-none"
            >
              Subscribe Monthly
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-b from-purple-800/30 to-purple-900/30 border border-purple-400/30 space-y-2 hover:shadow-[0_0_15px_5px_rgba(147,51,234,0.07)] transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Yearly Plan</h3>
              <div className="text-right">
                <span className="text-amber-300">₹2000/year</span>
                <p className="text-xs text-green-400">Save ₹1000</p>
              </div>
            </div>
            <p className="text-sm text-purple-200/70">Best value for dedicated seekers</p>
            <Button 
              onClick={() => handleSubscribe('yearly')}
              className="w-full mt-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-none"
            >
              Subscribe Yearly
            </Button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => onOpenChange(false)}
            className="text-purple-300 hover:text-purple-200 text-sm"
          >
            Maybe Later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
