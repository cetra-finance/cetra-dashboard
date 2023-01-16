import { FC } from "react";
import {
    ChakraProvider,
    SimpleGrid,
    Container,
    Box,
    Center,
    List,
    Text,
    ListItem,
    Image,
    Link,
} from "@chakra-ui/react";
import { Sidebar, SidebarLinkType } from "./components";
import TwitterSvg from "./assets/twitter.svg";
import DiscordSvg from "./assets/discord.svg";
import MediumSvg from "./assets/medium.svg";
import CetraSvg from "./assets/cetra.svg";

const App: FC = () => {
    return (
        <ChakraProvider>
            <Container maxW="100vw" maxH="100vh" p="0">
                <SimpleGrid w="100vw" h="100vh" gridTemplateColumns="350px 1fr">
                    <Box borderRight="1px" borderColor="#E8ECFD">
                        <SimpleGrid
                            w="100%"
                            h="100%"
                            gridTemplateRows="80px 1fr"
                        >
                            <Box borderBottom="1px" borderColor="#E8ECFD">
                                <Center h="100%">
                                    <Image src={CetraSvg} />
                                </Center>
                            </Box>
                            <Box mt="48px">
                                <Sidebar
                                    links={[
                                        {
                                            linkText: "Chamber`s farm",
                                            linkType: SidebarLinkType.Main,
                                        },
                                        {
                                            linkText: "Portfolio",
                                            linkType: SidebarLinkType.Main,
                                        },
                                        {
                                            linkText: "Docs",
                                            linkType: SidebarLinkType.Sub,
                                        },
                                        {
                                            linkText: "Settings",
                                            linkType: SidebarLinkType.Sub,
                                        },
                                    ]}
                                />
                            </Box>
                            <Center>
                                <Box minW="280px" h="224px" bg="#7173FC">
                                    <Center h="100%">
                                        <SimpleGrid spacing="25px">
                                            <Center>
                                                <SimpleGrid
                                                    columns={3}
                                                    spacing="30px"
                                                >
                                                    <Box>
                                                        <Link
                                                            href="https://twitter.com/CetraFinance"
                                                            isExternal={true}
                                                        >
                                                            <Image
                                                                src={TwitterSvg}
                                                                color="white"
                                                            />
                                                        </Link>
                                                    </Box>
                                                    <Box>
                                                        <Link
                                                            href="https://discord.gg/22WBP95dKF"
                                                            isExternal={true}
                                                        >
                                                            <Image
                                                                src={DiscordSvg}
                                                                color="white"
                                                            />
                                                        </Link>
                                                    </Box>
                                                    <Box>
                                                        <Link
                                                            href="https://medium.com/@cetrafinance"
                                                            isExternal={true}
                                                        >
                                                            <Image
                                                                src={MediumSvg}
                                                                color="white"
                                                            />
                                                        </Link>
                                                    </Box>
                                                </SimpleGrid>
                                            </Center>
                                            <List>
                                                <ListItem>
                                                    <Link
                                                        fontWeight="bold"
                                                        fontSize="26px"
                                                        color="white"
                                                    >
                                                        How it works
                                                    </Link>
                                                </ListItem>
                                                <ListItem>
                                                    <Link
                                                        fontWeight="bold"
                                                        fontSize="26px"
                                                        color="white"
                                                    >
                                                        Contact us
                                                    </Link>
                                                </ListItem>
                                            </List>
                                            <Text fontSize="18px" color="white">
                                                Cetra Labs, 2023
                                            </Text>
                                        </SimpleGrid>
                                    </Center>
                                </Box>
                            </Center>
                        </SimpleGrid>
                    </Box>
                    <Box>
                        <SimpleGrid
                            w="100%"
                            h="100%"
                            gridTemplateRows="80px 1fr"
                        >
                            <Box borderBottom="1px" borderColor="#E8ECFD">
                                Header
                            </Box>
                            <Box>View</Box>
                        </SimpleGrid>
                    </Box>
                </SimpleGrid>
            </Container>
        </ChakraProvider>
    );
};

export default App;
