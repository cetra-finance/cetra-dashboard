import { FC, useState } from "react";
import {
    ChakraProvider,
    SimpleGrid,
    Container,
    Box,
    Text,
    Image,
} from "@chakra-ui/react";
import { Routes, Route, useLocation } from "react-router-dom";
import {
    Sidebar,
    SidebarLinkType,
    CetraInfoCard,
    SidebarLink,
} from "./components";
import CetraSvg from "./assets/cetra.svg";
import { ChambersFarm, DepositFarm, Portfolio, Settings } from "./views";
import UniLogo from "./assets/icons/uni.svg";
import AaveLogo from "./assets/icons/aave.svg";
import UsdcLogo from "./assets/icons/usdc.svg";
import EthLogo from "./assets/icons/eth.svg";

const DEFAULT_SIDEBAR_LINKS: SidebarLink[] = [
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
];

const App: FC = () => {
    const location = useLocation();
    let actualPageTitleIndex = DEFAULT_SIDEBAR_LINKS.findIndex(
        (value) => value.href === location.pathname
    );
    if (actualPageTitleIndex === -1) actualPageTitleIndex = 0;
    const [activePageTitle, setActivePageTitle] = useState(
        DEFAULT_SIDEBAR_LINKS[actualPageTitleIndex].linkText
    );

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
                                    links={DEFAULT_SIDEBAR_LINKS}
                                    onClickLink={(linkText: string) =>
                                        setActivePageTitle(linkText)
                                    }
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
                                    {activePageTitle}
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
                                                onLoaded={(farmName) =>
                                                    setActivePageTitle(
                                                        `Chamber\`s farm / ${farmName}`
                                                    )
                                                }
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
