import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from 'react-toastify';
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
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BaseURL } from "@/Constant";

const formSchema = z.object({
    fullName: z.string().min(1, { message: "Full Name is required" }),
    dateOfBirth: z.date({
      required_error: "Date of birth is required",
    }),
    mobileNumber: z.string().min(10, { message: "Invalid mobile number" }),
    email: z
      .string()
      .email({ message: "Invalid email" })
      .refine((value) => !!value.trim(), { message: "Email is required" }),
    coupon_code: z.string().optional()
  });
  

export function Signup() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      mobileNumber: "",
      email: "",
      coupon_code: "",
    },
  });

  const location = useLocation();
  const state = location.state as { id: string };

  const navigate = useNavigate();

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { fullName, email, dateOfBirth, coupon_code } = values;
    const formattedDateOfBirth = format(dateOfBirth, 'dd-MM-yyyy');
    const formattedData = {
        yoga_timing: state?.id,     
        name: fullName,
        email: email,
        date_of_birth: formattedDateOfBirth,
        coupon_code: coupon_code,
    };
    console.log(formattedData);
    axios.post(`${BaseURL}yoga-booking/`, formattedData)
        .then((res) => {
            navigate("/pay" , {state: { order: res?.data?.order , proceed_to_pay : res?.data?.proceed_to_pay  }}); 
        }).catch((err) => {
            if (err.response && err.response.status >= 400) {
                console.log("hello world")
                toast.error("An error occurred: " + err.response.data);
            }
            console.error(err);
        });
}

  return (
    <div>
      <div>
        <ToastContainer />
      </div>
      <div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Full Name" {...field} />
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
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                    variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
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
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Mobile Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coupon_code"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Coupon Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your coupon code"
                  {...field}
                  className="w-full"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  </div>
  );
}
