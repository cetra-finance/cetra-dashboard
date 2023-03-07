import { FC } from "react";
import {
    Stack,
    Box,
    Text,
    Image,
    Link,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    Button,
} from "@chakra-ui/react";
import { CetraButton } from "../../components";
import GitHubLogo from "../../assets/github.svg";
import GitBookLogo from "../../assets/gitbook.svg";
import MediumLogo from "../../assets/medium-blue.svg";
import PunkImg from "../../assets/punk.png";
import HowStratWorksLogo from "../../assets/how-strat-works.svg";
import CetraComputerLogo from "../../assets/cetra-computer.svg";
import PixelHearthLogo from "../../assets/pixel-hearth.svg";

const Onboarding: FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Stack spacing={9} direction="column" w="full" h="full">
            <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        pl={7}
                        pr={7}
                        pt={8}
                        pb={3}
                        color="#1F2040"
                        fontWeight="bold"
                        fontSize="22px"
                        fontFamily="Chakra Petch"
                    >
                        You are the GOAT!
                    </ModalHeader>
                    <ModalBody pl={7} pr={7} pt={0} pb={8}>
                        <Stack spacing={7} direction="row" align="center">
                            <Text
                                color="#4A4C76"
                                fontWeight="medium"
                                fontSize="14px"
                                fontFamily="Chakra Petch"
                            >
                                Cetra is deeply grateful for your invaluable
                                contribution and wishes to express how
                                incredible you are! Joining us in creating a new
                                financial realm brings optimism and assurance
                                that everything will turn out perfectly!
                            </Text>
                            <Image w={24} h={24} src={PixelHearthLogo} />
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Stack spacing={6} direction="row">
                <Box bg="#E8ECFD" maxW="564px" maxH="269px">
                    <Stack
                        spacing={4}
                        direction="column"
                        pt={10}
                        pb={10}
                        pl={8}
                        pr={8}
                    >
                        <Text
                            color="#1F2040"
                            fontWeight="bold"
                            fontFamily="Chakra Petch"
                            fontSize="24px"
                        >
                            Real Yield for Stablecoin Investors
                        </Text>
                        <Text
                            color="#1F2040"
                            fontWeight="medium"
                            fontFamily="Chakra Petch"
                            fontSize="18px"
                        >
                            Cetra is fully decentralized and open-sourced
                            market-neutral farming protocol. Reduce up to 90% of
                            farming risk while remaining high yields on your
                            stablecoins.
                        </Text>
                        <Stack spacing={6} direction="row">
                            <Link
                                href="https://github.com/cetra-finance"
                                isExternal
                            >
                                <Image
                                    w={12}
                                    h={12}
                                    src={GitHubLogo}
                                    fill="#7173FC"
                                />
                            </Link>
                            <Link
                                href="https://cetra.gitbook.io/welcome/"
                                isExternal
                            >
                                <Image
                                    w={12}
                                    h={12}
                                    src={GitBookLogo}
                                    fill="#7173FC"
                                />
                            </Link>
                            <Link
                                href="https://medium.com/@cetrafinance"
                                isExternal
                            >
                                <Image w={12} h={12} src={MediumLogo} />
                            </Link>
                        </Stack>
                    </Stack>
                </Box>
                <Box bg="#E8ECFD" maxW="564px" maxH="269px">
                    <Stack direction="row">
                        <Stack
                            spacing={4}
                            direction="column"
                            pt={10}
                            pb={10}
                            pl={8}
                        >
                            <Text
                                color="#1F2040"
                                fontWeight="bold"
                                fontFamily="Chakra Petch"
                                fontSize="24px"
                            >
                                Want to talk with a team?
                            </Text>
                            <Text
                                color="#1F2040"
                                fontWeight="medium"
                                fontFamily="Chakra Petch"
                                fontSize="18px"
                            >
                                We are happy to talk with our users direcrly.
                                Book a call to see a demo or ask questions about
                                Cetra.
                            </Text>

                            <CetraButton
                                w="223px"
                                asLink
                                href="https://calendly.com/cetrafinance/15min-dev-talk"
                                h="43px"
                                borderRadius="0px"
                                fontSize="20px"
                            >
                                Book a Call
                            </CetraButton>
                        </Stack>
                        <Image w="fit-content" h="269px" src={PunkImg} />
                    </Stack>
                </Box>
            </Stack>
            <Stack spacing={20} direction="row" h="full">
                <Box bg="#E8ECFD" w="full" h="full">
                    <Stack p={9} h="full">
                        <Stack spacing={3} direction="column">
                            <Text
                                color="#1F2040"
                                fontWeight="bold"
                                fontSize="24px"
                                fontFamily="Chakra Petch"
                            >
                                How Strategy{" "}
                                <Text as="span" fontFamily="sans-serif">
                                    №
                                </Text>
                                1 works
                            </Text>
                            <Text
                                maxW="337px"
                                color="#1F2040"
                                fontWeight="medium"
                                fontSize="18px"
                                fontFamily="Chakra Petch"
                            >
                                Cetra’s first strategy is Delta-Neutral Vault on
                                top of Uniswap V3 & AAVE
                            </Text>
                        </Stack>
                        <Image
                            w="full"
                            h="full"
                            alignSelf="center"
                            justifySelf="center"
                            loading="eager"
                            src={HowStratWorksLogo}
                        />
                    </Stack>
                </Box>
                <Box alignSelf="end">
                    <Image
                        onClick={() => {
                            onOpen();
                        }}
                        _hover={{
                            cursor: "pointer",
                        }}
                        w={8}
                        h={8}
                        src={CetraComputerLogo}
                    />
                </Box>
            </Stack>
        </Stack>
    );
};

export { Onboarding };
