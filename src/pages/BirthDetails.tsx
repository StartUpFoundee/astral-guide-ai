
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { z } from "zod";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  dateOfBirth: z.date({
    required_error: "Please select your date of birth.",
  }),
  timeOfBirth: z.string().min(1, "Please enter your time of birth."),
  placeOfBirth: z.string().min(1, "Please enter your place of birth."),
});

const BirthDetails = () => {
  const setUserDetails = useUserStore((state) => state.setUserDetails);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeOfBirth: "",
      placeOfBirth: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setUserDetails({
      dateOfBirth: values.dateOfBirth,
      timeOfBirth: values.timeOfBirth,
      placeOfBirth: values.placeOfBirth,
    });
    // Navigate to next page after submission
    navigate("/questions");
  };

  // Generate year options for the year selector
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 121 }, (_, i) => currentYear - i);

  const handleYearChange = (year: string) => {
    const currentDate = form.getValues("dateOfBirth") || new Date();
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(year));
    form.setValue("dateOfBirth", newDate);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F] p-4">
      <div className="w-full max-w-md space-y-8 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-white/90 mb-2">Birth Details</h2>
          <p className="text-purple-200/80">
            Enter your birth details for personalized astrological insights
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-white/80">Date of Birth</FormLabel>
                  <div className="flex gap-3 mb-2">
                    <Select onValueChange={handleYearChange}>
                      <SelectTrigger className="bg-white/5 border-purple-500/30 text-white">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[15rem]">
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-white/5 border-purple-500/30 text-white hover:bg-white/10",
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
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Time of Birth</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="time"
                        className="w-full pl-10 bg-white/5 border-purple-500/30 text-white"
                        {...field}
                      />
                      <Clock className="absolute left-3 top-2.5 h-5 w-5 text-purple-300" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="placeOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Place of Birth</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter your place of birth"
                        className="w-full pl-10 bg-white/5 border-purple-500/30 text-white"
                        {...field}
                      />
                      <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-purple-300" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500/80 to-fuchsia-600/80 
                         text-white font-medium tracking-wide
                         transform hover:scale-105 transition-all duration-300
                         shadow-lg hover:shadow-purple-500/25"
            >
              Continue
            </Button>
          </form>
        </Form>

        <p className="text-sm text-purple-200/60 text-center mt-6">
          Your birth details help us generate accurate, personalized astrological predictions
          using advanced AI technology. All information is kept secure and confidential.
        </p>
      </div>
    </div>
  );
};

export default BirthDetails;
