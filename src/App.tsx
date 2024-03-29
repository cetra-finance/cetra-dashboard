import { FC, useState } from "react";
import {
    ChakraProvider,
    Box,
    Text,
    Image,
    SimpleGrid,
    Stack,
    Button,
    Container,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Link,
} from "@chakra-ui/react";
import {
    useConnect,
    useAccount,
    useDisconnect,
    useSwitchNetwork,
    useNetwork,
} from "wagmi";
import { Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import {
    Sidebar,
    SidebarLinkType,
    CetraInfoCard,
    SidebarLink,
    CetraButton,
    CetraNetworkSwitch,
} from "./components";
import { Strategies, Farm, Portfolio, Onboarding } from "./views";
import { getTruncatedAddress, DEFAULT_CHAINS } from "./utils";
import CetraSvg from "./assets/cetra.svg";

const DEFAULT_SIDEBAR_LINKS: SidebarLink[] = [
    {
        linkText: "Strategies",
        href: "/",
        linkType: SidebarLinkType.Main,
    },
    {
        linkText: "Portfolio",
        href: "/portfolio",
        linkType: SidebarLinkType.Main,
    },
    {
        linkText: "Onboarding",
        href: "/onboarding",
        linkType: SidebarLinkType.Sub,
    },
    {
        linkText: "Docs",
        href: "https://cetra.gitbook.io/welcome/",
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

    ReactGA.send({ hitType: "pageview", page: location.pathname });

    const {
        isOpen: isSwitchNetworkModalOpen,
        onOpen: onSwitchNetworkModalOpen,
        onClose: onSwitchNetworkModalClose,
    } = useDisclosure();

    // TODO: Add error handler
    const { connect, connectors, error, isLoading, pendingConnector } =
        useConnect();
    const metaMaskConnector = connectors[0];
    const { address, connector, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    const { chain } = useNetwork();
    const {
        chains: switchNetworkChains,
        error: switchNetworkError,
        isLoading: isSwitchNetworkLoading,
        pendingChainId,
        switchNetwork,
    } = useSwitchNetwork({ chainId: DEFAULT_CHAINS[0].id });
    const isSwitchNetworkNeeded = chain
        ? !DEFAULT_CHAINS.map((defaultChain) => defaultChain.id).includes(
              chain.id
          )
        : false;

    return (
        <ChakraProvider>
            <Modal
                onClose={onSwitchNetworkModalClose}
                isOpen={isSwitchNetworkModalOpen || isSwitchNetworkNeeded}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        color="#1F2040"
                        fontFamily="Chakra Petch"
                        fontWeight="bold"
                        fontSize="22px"
                    >
                        Wrong Network!
                    </ModalHeader>
                    <ModalBody>
                        <Stack direction="row" justify="center" spacing={10}>
                            <Stack direction="column" spacing={5}>
                                <Text
                                    color="#4A4C76"
                                    fontFamily="Chakra Petch"
                                    fontWeight="medium"
                                    fontSize="14px"
                                >
                                    Sorry, but we are not deployed here yet.
                                    Please, switch your network to one of
                                    supported
                                </Text>
                                <CetraButton
                                    h="8"
                                    onClick={() => switchNetwork?.()}
                                    isLoading={isSwitchNetworkLoading}
                                >
                                    {/* TODO: Possible error if default network changed */}
                                    Switch to Polygon Network
                                </CetraButton>
                                <CetraButton
                                    h="8"
                                    onClick={() =>
                                        switchNetwork?.(DEFAULT_CHAINS[1].id)
                                    }
                                    isLoading={isSwitchNetworkLoading}
                                >
                                    {/* TODO: Possible error if default network changed */}
                                    Switch to Optimism Network
                                </CetraButton>
                                <CetraButton
                                    h="8"
                                    onClick={() =>
                                        switchNetwork?.(DEFAULT_CHAINS[2].id)
                                    }
                                    isLoading={isSwitchNetworkLoading}
                                >
                                    {/* TODO: Possible error if default network changed */}
                                    Switch to Arbitrum Network
                                </CetraButton>
                            </Stack>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
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
                                <Link href="/">
                                    <Image src={CetraSvg} />
                                </Link>
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
                                columns={2}
                                pl="8"
                                pr="8"
                            >
                                <Text
                                    color="#1F2040"
                                    fontFamily="Chakra Petch"
                                    fontSize="22px"
                                    fontWeight="bold"
                                >
                                    {activePageTitle}
                                </Text>
                                <Stack direction="row" justify="end">
                                    {isConnected &&
                                    DEFAULT_CHAINS.length > 1 ? (
                                        <CetraNetworkSwitch
                                            isDisabled={isSwitchNetworkLoading}
                                            onChange={(index) => {
                                                switchNetwork?.(
                                                    DEFAULT_CHAINS[index].id
                                                );
                                            }}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                    <Button
                                        isLoading={isLoading}
                                        w="200px"
                                        color="#7173FC"
                                        fontFamily="Chakra Petch"
                                        fontWeight="bold"
                                        border="1px"
                                        borderColor="#7173FC"
                                        bgColor="transparent"
                                        justifySelf="end"
                                        onClick={() => {
                                            if (!isConnected) {
                                                connect({
                                                    connector:
                                                        metaMaskConnector,
                                                });
                                            } else {
                                                disconnect();
                                            }
                                        }}
                                    >
                                        {isConnected
                                            ? getTruncatedAddress(address!)
                                            : "Connect Wallet"}
                                    </Button>
                                </Stack>
                            </SimpleGrid>
                            <Box p={["0px", "0px", "8"]} overflowY="auto">
                                <Routes>
                                    <Route index element={<Strategies />} />
                                    <Route path="*" element={<Strategies />} />
                                    <Route
                                        path="/portfolio"
                                        element={<Portfolio />}
                                    />
                                    <Route
                                        path="/onboarding"
                                        element={<Onboarding />}
                                    />
                                    <Route
                                        path="/farm"
                                        element={
                                            <Farm
                                                onLoaded={(farmName) =>
                                                    setActivePageTitle(
                                                        `Strategies / ${farmName}`
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
