//

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  addMonths,
  subMonths,
  parse,
} from "date-fns";
import { auth } from "../config/firebase";
import { fetchTasksFromFirestore } from "../scripts/task";
import "./Home.css";
import {Modal, Button, SimpleGrid, Text, Group} from "@mantine/core";
import { FaArrowRight, FaArrowLeft  } from "react-icons/fa6";
import {useDisclosure} from "@mantine/hooks";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);     //opening add task box


  const handleDayClick = (day) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDay(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        //the user is signed in so fetch thier tasks
        try {
          const fetchedTasks = await fetchTasksFromFirestore();
          setTasks(fetchedTasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      } else {
        console.log("No user is signed in");
      }
    });
  
    return () => unsubscribe();
  }, []);

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });
  const startingDayIndex = getDay(firstDayOfMonth);

  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
  };

  return (
    <>

      <div className="container">
        <div>
          <h2 className="calendar-title">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <Button className="previous" onClick={handlePreviousMonth} variant="default">
            <FaArrowLeft size={16} />
            <Text fw={700} size={'md'}>Previous</Text>
          </Button>

          <Button className="next" onClick={handleNextMonth} variant="default">
            <Text fw={700} size={'md'}>Next</Text>
            <FaArrowRight size={16} />
          </Button>
        </div>

        <SimpleGrid cols={7} spacing="xs" verticalSpacing="xs">
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
            const tasksForDay = tasks.filter((task) => {
              const dateFormat = "yyyy-MM-dd";
              const taskDate = parse(task.date, dateFormat, new Date());
              return isSameDay(taskDate, day);
            });

            return (
              <Button
                key={index}
                className={dayClassName}
                onClick={() => handleDayClick(day)}
              >
                <div>
                  <span> {format(day, "d")} </span>
                  <div>
                    {tasksForDay.map((task, taskIndex) => (
                      <div key={taskIndex} className="task">
                        {task.task} {/* where the task name is displayed*/}
                      </div>
                    ))}
                  </div>
                </div>
              </Button>
            );
          })}
        </SimpleGrid>
      </div>
      <Modal
        opened={isModalOpen}
        onClose={handleCloseModal}
        size="sm"
        title={
          selectedDay ? `Tasks for ${format(selectedDay, "MMMM d, yyyy")}` : ""
        }
        centered
      >
        {selectedDay &&
          tasks
            .filter((task) =>
              isSameDay(parse(task.date, "yyyy-MM-dd", new Date()), selectedDay)
            )
            .map((task) => (
              <div key={task.id} className="task">
                {task.task}
              </div>
            ))}
      </Modal>
    </>
  );
};

export default Calendar;
