
import './Home.css'; // Make sure to create a Calendar.css file for styling

const Calendar = () => {
  // Assuming you want to show the current month
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  // Generate the days of the week header
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysHeader = daysOfWeek.map((day) => <th key={day}>{day}</th>);

  // Generate the days for the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  let days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const day = new Date(currentYear, currentMonth, i).getDay();
    if (i === 1) {
      
      for (let j = 0; j < day; j++) {
        days.push(<td key={`empty-${j}`}></td>);
      }
    }
    days.push(<td key={i} className={i === currentDate ? 'current-day' : ''}>{i}</td>);
  }

  // Group days into weeks for display
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(<tr key={`week-${i}`}>{days.slice(i, i + 7)}</tr>);
  }

  return (
    <table className="calendar">
      <thead>
        <tr>{daysHeader}</tr>
      </thead>
      <tbody>{weeks}</tbody>
    </table>
  );
};

export default Calendar;
