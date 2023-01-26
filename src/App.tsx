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
import { Routes, Route } from "react-router-dom";
import { Sidebar, SidebarLinkType } from "./components";
import TwitterSvg from "./assets/twitter.svg";
import DiscordSvg from "./assets/discord.svg";
import MediumSvg from "./assets/medium.svg";
import CetraSvg from "./assets/cetra.svg";
import { ChambersFarm, DepositFarm, Portfolio, Settings } from "./views";
import UniSvg from "./assets/icons/uni.svg";
import AaveSvg from "./assets/icons/aave.svg";
import UsdcSvg from "./assets/icons/usdc.svg";
import EthSvg from "./assets/icons/eth.svg";

const App: FC = () => {
    return (
        <ChakraProvider>
            <Container maxW="100vw" maxH="100vh" p="0">
                <SimpleGrid w="100vw" h="100vh" gridTemplateColumns="300px 1fr">
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
                                            href: "/",
                                            linkType: SidebarLinkType.Main,
                                        },
                                        {
                                            linkText: "Portfolio",
                                            href: "/portfolio",
                                            linkType: SidebarLinkType.Main,
                                        },
                                        {
                                            linkText: "Docs",
                                            href: "https://cetra.gitbook.io/welcome/",
                                            linkType: SidebarLinkType.Sub,
                                        },
                                        {
                                            linkText: "Settings",
                                            href: "/settings",
                                            linkType: SidebarLinkType.Sub,
                                        },
                                    ]}
                                />
                            </Box>
                            <Center>
                                <Box
                                    minW="230px"
                                    h="210px"
                                    bg="#7173FC"
                                    roundedTop="md"
                                >
                                    <Center h="100%">
                                        <SimpleGrid w="full" gap="30px">
                                            <Center>
                                                <SimpleGrid
                                                    w="full"
                                                    columns={3}
                                                    justifyContent="space-between"
                                                    justifyItems="center"
                                                >
                                                    <Box>
                                                        <Link
                                                            href="https://twitter.com/CetraFinance"
                                                            isExternal={true}
                                                        >
                                                            <Image
                                                                w="35px"
                                                                h="35px"
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
                                                                w="35px"
                                                                h="35px"
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
                                                                w="35px"
                                                                h="35px"
                                                                src={MediumSvg}
                                                                color="white"
                                                            />
                                                        </Link>
                                                    </Box>
                                                </SimpleGrid>
                                            </Center>
                                            <List textAlign="center">
                                                <ListItem>
                                                    <Link
                                                        fontWeight="bold"
                                                        fontSize="22px"
                                                        color="white"
                                                        href="https://cetra.gitbook.io/welcome/"
                                                        isExternal
                                                    >
                                                        How it works
                                                    </Link>
                                                </ListItem>
                                                <ListItem>
                                                    <Link
                                                        fontWeight="bold"
                                                        fontSize="22px"
                                                        color="white"
                                                        href="mailto:artemy@cetra.finance"
                                                        isExternal
                                                    >
                                                        Contact us
                                                    </Link>
                                                </ListItem>
                                            </List>
                                            <Text
                                                align="center"
                                                fontSize="16px"
                                                color="white"
                                            >
                                                Cetra Labs, 2023
                                            </Text>
                                        </SimpleGrid>
                                    </Center>
                                </Box>
                            </Center>
                        </SimpleGrid>
                    </Box>
                    <Box overflow="hidden">
                        <SimpleGrid
                            w="100%"
                            h="100%"
                            gridTemplateRows="80px 1fr"
                        >
                            <SimpleGrid
                                borderBottom="1px"
                                borderColor="#E8ECFD"
                                alignItems="center"
                            >
                                <Text
                                    color="#1F2040"
                                    fontSize="22px"
                                    fontWeight="bold"
                                    pl="33px"
                                >
                                    Chamber`s farm
                                </Text>
                            </SimpleGrid>
                            <Box p="10" overflowY="scroll">
                                <Routes>
                                    <Route
                                        path="/"
                                        element={<ChambersFarm />}
                                    />
                                    <Route
                                        path="/portfolio"
                                        element={<Portfolio />}
                                    />
                                    <Route
                                        path="/settings"
                                        element={<Settings />}
                                    />
                                    <Route
                                        path="/deposit"
                                        element={
                                            <DepositFarm
                                                farmName="ETH-USDC"
                                                baseFarmName="AAVE"
                                                baseFarmIcon={AaveSvg}
                                                quoteFarmName="UniV3"
                                                quoteFarmIcon={UniSvg}
                                                apy="65.23%"
                                                tvl="$3.73M"
                                                strategy="Delta-Neutral"
                                                assetName="USDC"
                                                assetIcon={UsdcSvg}
                                                quoteAssetName="ETH"
                                                quoteAssetIcon={EthSvg}
                                                balance="341.15"
                                            />
                                        }
                                    />
                                </Routes>
                            </Box>
                        </SimpleGrid>
                    </Box>
                </SimpleGrid>
            </Container>
        </ChakraProvider>
    );
};

export default App;
