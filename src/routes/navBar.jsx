import "../styles.css";
import {
  AppShell,
  Box,
  Burger,
  Button,
  Drawer,
  Group,
  Text,
  Menu,
  Paper,
  TextInput,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { GiBrain } from "react-icons/gi";
import { IoMdArrowDropright } from "react-icons/io";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { addTaskToFirestore, searchForTask } from "../scripts/task";
import { checkAuthStatus, signOUT } from "../scripts/auth";
import { auth } from "../config/firebase";

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

  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  useEffect(() => {
    checkAuthStatus().then(({ isSignedIn, user }) => {
      setIsUserSignedIn(isSignedIn);
      if (isSignedIn) {
        console.log(`User is signed in as ${user.displayName}`);
        // You can do something with the user object here
      } else {
        console.log("User is not signed in");
      }
    });
  }, []);

  const handleLogout = async () => {
    await signOUT(auth);
    // Optionally handle redirection or state update after logout
  };

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

              {isUserSignedIn ? (
                <Button
                  onClick={handleLogout}
                  variant="subtle"
                  color="black"
                  size={"md"}
                >
                  Sign Out
                </Button>
              ) : (
                <Link to="/login">
                  <Button variant="subtle" color="black" size={"md"}>
                    Login
                  </Button>
                </Link>
              )}
            </Group>

            <Modal
              opened={opened}
              onClose={close}
              size="xl"
              title={<Text fw={"700"}>Add Your Task Details</Text>}
              centered
            >
              {
                <Paper className="sidebar">
                  <form onSubmit={handleAddClick}>
                    <TextInput
                      label="Enter Task Name"
                      type="text"
                      id="event-name"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      required
                    />

                    <TextInput
                      label="Time"
                      type="time"
                      id="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />

                    <TextInput
                      label="Day"
                      type="date"
                      id="day"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />

                    <Menu
                      position="right-start"
                      withArrow
                      arrowPosition={"center"}
                    >
                      <Menu.Target>
                        <Button
                          mt={"15"}
                          variant="outline"
                          size="xs"
                          color="Grey"
                          rightSection={<IoMdArrowDropright />}
                        >
                          <Text size="sm" fw={"700"}>
                            Priority
                          </Text>
                        </Button>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item>
                          <Button
                            variant="transparent"
                            onClick={handleClickLow}
                          >
                            <Text fw={"700"} color="LightGreen">
                              Low
                            </Text>
                          </Button>
                        </Menu.Item>
                        <Menu.Item>
                          <Button
                            variant="transparent"
                            onClick={handleClickMedium}
                          >
                            <Text fw={"700"} color="Orange">
                              Medium
                            </Text>
                          </Button>
                        </Menu.Item>
                        <Menu.Item>
                          <Button
                            variant="transparent"
                            onClick={handleClickHigh}
                          >
                            <Text fw={"700"} color="Red">
                              High
                            </Text>
                          </Button>
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>

                    <Button type="submit" mt={"40"} fullWidth>
                      Create Task
                    </Button>
                  </form>
                </Paper>
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
