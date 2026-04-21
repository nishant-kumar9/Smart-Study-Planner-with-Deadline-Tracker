import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CalendarPage() {
  const [date, setDate] = useState(new Date());

  return (
    <div style={{ color: "white" }}>
      <h1>📅 Calendar</h1>

      <Calendar onChange={setDate} value={date} />

      <p>Selected: {date.toDateString()}</p>
    </div>
  );
}

export default CalendarPage;