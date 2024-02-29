import "../styles.css";
import {
  AppShell,
  Box,
  Burger,
  Button,
  Drawer,
  Group,
  Text,
  Modal,
  Menu,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { GiBrain } from "react-icons/gi";
import { useState } from "react";
import PropTypes from "prop-types";
import { addTaskToFirestore, searchForTask } from "../scripts/task";

const Navbar = ({ onAddTask }) => {
  const [burger, toggle] = useDisclosure();

  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState(0);

  const [opened, { open, close }] = useDisclosure(false);

  const [searchOpened, setSearchOpened] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const searchTaskResults = await searchForTask(searchTerm);
      
      setSearchResults(searchTaskResults);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickLow = () => setPriority(1);
  const handleClickMedium = () => setPriority(2);
  const handleClickHigh = () => setPriority(3);

  const handleAddClick = async (event) => {
    event.preventDefault();

    const newTask = {
      name: inputValue,
      time: time,
      date: date,
      priority: priority,
    };

    onAddTask(newTask);

    try {
      const docRef = await addTaskToFirestore({
        task: inputValue,
        time,
        date,
        priority,
      });
      setTasks([...tasks, { ...newTask, id: docRef.id }]);

      if (onAddTask) {
        onAddTask(newTask);
      }
    } catch (error) {
      console.log(error);
    }

    setInputValue("");
    setTime("");
    setDate("");
  };

  const burgerClicked = () => {
    if (burger) toggle.close();
    else toggle.open();
  };

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header size="md">
        <header style={{ height: 60 }}>
          <Group
            justify="space-between"
            align="center"
            style={{ height: "100%", margin: "0 30px" }}
          >
            <Group gap={5} align="center">
              <GiBrain size="27" />
              <Text fw={700} size={"lg"}>
                TaskMaster
              </Text>
            </Group>
            <Group gap={5} visibleFrom="sm">
              <Button
                onClick={() => setSearchOpened(true)}
                variant="subtle"
                color="black"
                size={"md"}
              >
                Search Task
              </Button>
              <Button onClick={open} variant="subtle" color="black" size={"md"}>
                Add Task
              </Button>
              <Link to="/addfriend">
                <Button variant="subtle" color="black" size={"md"}>
                  Add Friend
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="subtle" color="black" size={"md"}>
                  Login
                </Button>
              </Link>
            </Group>

            <Modal
              opened={opened}
              onClose={close}
              size="70%"
              title="addingTask"
              centered
            >
              {
                <div className="sidebar">
                  <form onSubmit={handleAddClick}>
                    <label htmlFor="event-task" type="text">
                      Enter Task:
                    </label>
                    <input
                      type="text"
                      id="event-name"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      required
                    />

                    <label htmlFor="time">Time:</label>
                    <input
                      type="time"
                      id="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />

                    <label htmlFor="day">Day:</label>
                    <input
                      type="date"
                      id="day"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />

                    <Menu>
                      <Menu.Target>
                        <Button>Priority</Button>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item>
                          <Button variant="filled" onClick={handleClickLow}>
                            Low
                          </Button>
                          ;
                        </Menu.Item>
                        <Menu.Item>
                          <Button variant="filled" onClick={handleClickMedium}>
                            Meduim
                          </Button>
                          ;
                        </Menu.Item>
                        <Menu.Item>
                          <Button variant="filled" onClick={handleClickHigh}>
                            High
                          </Button>
                          ;
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>

                    <button type="submit">Create Task</button>
                  </form>
                </div>
              }
            </Modal>

            <Modal
              opened={searchOpened}
              onClose={() => setSearchOpened(false)}
              size="70%"
              title="Search Task"
              centered
            >
              <form onSubmit={handleSearch}>
                <Text>Enter task name:</Text>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  required
                />
                <Button type="submit" onClick={handleSearch}>
                  Search
                </Button>
              </form>
              <div>
                {searchResults.length > 0 ? (
                  searchResults.map((task, index) => (
                    <div key={index}>{task.task}</div>
                  ))
                ) : (
                  <Text>No results found.</Text>
                )}
              </div>
            </Modal>

            <Burger opened={burger} onClick={burgerClicked} hiddenFrom="sm">
              <Drawer
                opened={burger}
                title={"TaskMaster"}
                onClose={burgerClicked}
                size={"30%"}
                titleProps={{ className: "taskMasterLogo" }}
              >
                <Box mt={30}>
                  <Link to="/addfriend">
                    <Button variant="subtle" color="black" size={"md"}>
                      Add Friend
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="subtle" color="black" size={"md"}>
                      Login
                    </Button>
                  </Link>
                </Box>
              </Drawer>
            </Burger>
          </Group>
        </header>
      </AppShell.Header>
    </AppShell>
  );
};

Navbar.propTypes = {
  onAddTask: PropTypes.func.isRequired,
  onUpdateTasks: PropTypes.func,
};

export default Navbar;
