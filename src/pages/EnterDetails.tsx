
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
  timeOfBirth: z.string().min(1, { message: "Time of birth is required." }),
  placeOfBirth: z.string().min(2, { message: "Place of birth is required." }),
});

export default function EnterDetails() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserDetails } = useUserStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      timeOfBirth: "",
      placeOfBirth: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Save to user store
    setUserDetails({
      name: values.fullName,
      dateOfBirth: values.dateOfBirth,
      timeOfBirth: values.timeOfBirth,
      placeOfBirth: values.placeOfBirth
    });
    
    // Also save to localStorage for backward compatibility
    localStorage.setItem("userDetails", JSON.stringify(values));
    
    toast({
      title: "Details saved successfully!",
      description: "Redirecting to categories...",
    });
    setTimeout(() => navigate("/categories"), 1000);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-serif mb-2">Tell Us About Yourself</h1>
          <p className="text-purple-300/80">Enter your details for personalized astrological insights</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg border border-purple-500/20">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-200">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} 
                        className="bg-white/10 border-purple-500/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-purple-200">Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-white/10 border-purple-500/30",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="bg-black border border-purple-500/30"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-200">Time of Birth</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} 
                        className="bg-white/10 border-purple-500/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="placeOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-200">Place of Birth</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your place of birth" {...field} 
                        className="bg-white/10 border-purple-500/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500/80 to-fuchsia-600/80 hover:from-purple-600/80 hover:to-fuchsia-700/80"
              >
                Continue
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
