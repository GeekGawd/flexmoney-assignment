import { Button } from '@/components/ui/button';
import CalendarHeader from '@/components/CalendarHeader/CalendarHeader';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Suppose this is your timeslot object
const timeSlots = {
    morning: '9:00 AM - 11:00 AM',
    noon: '12:00 PM - 2:00 PM',
    afternoon: '3:00 PM - 5:00 PM',
    evening: '6:00 PM - 8:00 PM',
};

const LandingPage = () => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const navigate = useNavigate()
    const handleSlotClick = (key) => {
        setSelectedSlot(key);
    };

    const submit = () => {
        navigate('/register')
    }

    return (
        <>
            <CalendarHeader />

            <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(timeSlots).map(([key, value]) => (
                    <div
                        key={key}
                        className={`p-4 border rounded-lg shadow-sm cursor-pointer ${selectedSlot === key ? 'border-gray-700 font-semibold' : 'border-gray-300'
                            }`}
                        onClick={() => handleSlotClick(key)}
                    >
                        <div className={`font-medium capitalize`}>
                            {key}
                        </div>
                        <div>{value}</div>
                    </div>
                ))}
            </div>

            <Button className="w-full" disabled={!selectedSlot} onClick={submit}>Submit</Button>
        </>
    );
};

export default LandingPage;
