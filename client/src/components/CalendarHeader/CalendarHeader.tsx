import { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { Button } from '../ui/button';

const CalendarHeader = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  return (
    <div className="flex items-center justify-between p-2 border-b mb-2">
      <Button variant={"outline"} onClick={handlePrevMonth}>&lt;</Button>
      <span className="text-lg font-semibold">
        {format(currentDate, 'MMMM yyyy')}
      </span>
      <Button variant={"outline"} onClick={handleNextMonth}>&gt;</Button>
    </div>
  );
};

export default CalendarHeader;
