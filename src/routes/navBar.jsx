import "../styles.css"
import {AppShell, Box, Burger, Button, createTheme, Drawer, Group, List, Text} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {Link} from "react-router-dom";
import { GiBrain } from "react-icons/gi";


function Navbar() {
    const [ burger, toggle ] = useDisclosure();

    const burgerClicked = () => {
        if(burger)toggle.close();
        else toggle.open();
    }


    return (
        <AppShell header={{ height: 60 }}>
            <AppShell.Header size='md'>
                <header style={{ height: 60}}>
                    <Group justify="space-between" align="center" style={{ height: '100%', margin: '0 30px' }}>
                        <Group gap={5} align="center">
                            <GiBrain size='27'/>
                            <Text fw={700} size={'lg'}>TaskMaster</Text>
                        </Group>
                        <Group gap={5} visibleFrom="sm">
                            <Link to="/addfriend">
                                <Button variant="subtle" color="black" size={'md'}>Add Friend</Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="subtle" color="black" size={'md'}>Login</Button>
                            </Link>
                        </Group>

                        <Burger opened={burger} onClick={burgerClicked} hiddenFrom='sm'>
                            <Drawer opened={burger} title={"TaskMaster"} onClose={burgerClicked} size={"30%"} titleProps={{ className: 'taskMasterLogo'}}>
                                <Box mt={30}>
                                    <Link to="/addfriend">
                                        <Button variant="subtle" color="black" size={'md'}>Add Friend</Button>
                                    </Link>
                                    <Link to="/login">
                                        <Button variant="subtle" color="black" size={'md'}>Login</Button>
                                    </Link>
                                </Box>
                            </Drawer>
                        </Burger>
                    </Group>
                </header>
            </AppShell.Header>
        </AppShell>
    );
}

export default Navbar;