import { FC } from "react";
import {
    ChakraProvider,
    SimpleGrid,
    Container,
    Box,
    Text,
    Image,
} from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import { Sidebar, SidebarLinkType, CetraInfoCard } from "./components";
import CetraSvg from "./assets/cetra.svg";
import { ChambersFarm, DepositFarm, Portfolio, Settings } from "./views";
import UniLogo from "./assets/icons/uni.svg";
import AaveLogo from "./assets/icons/aave.svg";
import UsdcLogo from "./assets/icons/usdc.svg";
import EthLogo from "./assets/icons/eth.svg";

const App: FC = () => {
    return (
        <ChakraProvider>
            <Container maxW="100vw" maxH="100vh" p="0">
                <SimpleGrid
                    w="100vw"
                    h="100vh"
                    gridTemplateColumns={[
                        "200px 1fr",
                        "200px 1fr",
                        "300px 1fr",
                    ]}
                >
                    <Box borderRight="1px" borderColor="#E8ECFD">
                        <SimpleGrid
                            w="100%"
                            h="100%"
                            gridTemplateRows="80px 1fr"
                        >
                            <SimpleGrid
                                borderBottom="1px"
                                borderColor="#E8ECFD"
                                columns={2}
                                gridTemplateColumns="1fr 4fr"
                                alignItems="center"
                            >
                                <Box></Box>
                                <Image src={CetraSvg} />
                            </SimpleGrid>
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
                            <Box
                                pl={["0px", "0px", "35px"]}
                                pr={["0px", "0px", "35px"]}
                            >
                                <CetraInfoCard />
                            </Box>
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
                                    fontFamily="Chakra Petch"
                                    fontSize="22px"
                                    fontWeight="bold"
                                    pl="33px"
                                >
                                    Chamber`s farm
                                </Text>
                            </SimpleGrid>
                            <Box p={["0px", "0px", "20px"]} overflowY="scroll">
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
                                                baseFarmIcon={AaveLogo}
                                                quoteFarmName="UniV3"
                                                quoteFarmIcon={UniLogo}
                                                apy="65.23%"
                                                tvl="$3.73M"
                                                strategy="Delta-Neutral"
                                                assetName="USDC"
                                                assetIcon={UsdcLogo}
                                                quoteAssetName="ETH"
                                                quoteAssetIcon={EthLogo}
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
