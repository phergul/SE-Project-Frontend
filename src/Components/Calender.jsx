
import './Home.css'; 
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from "date-fns";


const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  
const currentDate = new Date();
const firstDayOfMonth = startOfMonth(currentDate);
const lastDayOfMonth = endOfMonth(currentDate);

const daysInMonth = eachDayOfInterval({
  start: firstDayOfMonth,
  end: lastDayOfMonth,
});

const startingDayIndex = getDay(firstDayOfMonth);

  return ( 
    <div className="container">
        <div>
            <h2 className="calendar-title">{format(currentDate, "MMMM yyyy")}</h2>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {WEEKDAYS.map((day) => {
            return <div className='Days' key={day}>{day}</div>
          })}
          {Array.from({length: startingDayIndex }).map((_, index) => {
            return <div key={`empty-${index}`} className='border-of-days'/>
          })}
          
          {daysInMonth.map((day, index) => {
            const isToday = isSameDay(day, new Date());
            const dayClassName = isToday ?  "border-of-days today" : "border-of-days";
            return <div key={index} className={dayClassName}>
            {format(day, "d")}
            </div>
          })}
        </div>
    </div>
);
  };

export default Calendar;
