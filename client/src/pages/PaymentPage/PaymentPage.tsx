import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
    upi: z.string()
        .min(1, { message: 'UPI ID is required' })
        .regex(/[\w.-]+@[\w.-]+/, { message: 'Please enter a valid UPI ID' }), // A basic regex for UPI ID validation
    coupon: z.string().regex(/^[A-Z0-9]{5,10}$/, { message: 'Invalid coupon code' }).optional(), // An example regex for a coupon code
});

const PaymentPage = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            upi: "",
        },
    });
    const navigate = useNavigate()

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
        navigate("/success")
        // Here you would add your payment processing logic
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                    control={form.control}
                    name="upi"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>UPI ID</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your UPI ID" {...field} className="w-full" />
                            </FormControl>
                            <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="coupon"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>Coupon Code</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your coupon code" {...field} className="w-full" />
                            </FormControl>
                            <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full mt-6">
                    Proceed to pay Rs. 500
                </Button>
            </form>
        </Form>
    );
};

export default PaymentPage;
