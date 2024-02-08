import "./Home.css";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getFunctions, httpsCallable } from "firebase/functions";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = ({ tasks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });
  const startingDayIndex = getDay(firstDayOfMonth);

  const functions = getFunctions();
  const getUserTasks = httpsCallable(functions, 'getUserTasks');

  useEffect(() => {
    getUserTasks().then((result) => {
      const data = result.data;
      console.log(data);
    }).catch(error => {
      console.error("Error fetching tasks:", error);
    });
  }, []);


  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
  };

  return (
    <div className="container">
      <div>
        <h2 className="calendar-title">{format(currentMonth, "MMMM yyyy")}</h2>
        <button className="previous" onClick={handlePreviousMonth}>
          Previous
        </button>
        <button className="next" onClick={handleNextMonth}>
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {WEEKDAYS.map((day) => (
          <div className="Days" key={day}>
            {day}
          </div>
        ))}
        {Array.from({ length: startingDayIndex }).map((_, index) => (
          <div key={`empty-${index}`} className="border-of-days" />
        ))}
        {daysInMonth.map((day, index) => {
          const isToday = isSameDay(day, new Date());
          const dayClassName = isToday
            ? "border-of-days today"
            : "border-of-days";
          const tasksForDay = tasks.filter((task) =>
            isSameDay(new Date(task.date), day)
          );

          return (
            <div key={index} className={dayClassName}>
              {format(day, "d")}
              {tasksForDay.map((task, taskIndex) => (
                <div key={taskIndex} className="task">
                  {task.name}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Calendar.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
        .isRequired,
    })
  ).isRequired,
};

export default Calendar;
