import { FC } from "react";
import { Image, SimpleGrid, Stack, Link, Text } from "@chakra-ui/react";
import TwitterLogo from "../../assets/twitter.svg";
import DiscordLogo from "../../assets/discord.svg";
import MediumLogo from "../../assets/medium.svg";

const LOGO_SIZE_SM: number = 30;
const LOGO_SIZE_MD: number = 30;
const LOGO_SIZE_LG: number = 40;

const FONT_SIZE_SM: number = 18;
const FONT_SIZE_MD: number = 18;
const FONT_SIZE_LG: number = 20;

const SUB_FONT_SIZE_SM: number = 13;
const SUB_FONT_SIZE_MD: number = 13;
const SUB_FONT_SIZE_LG: number = 14;

const PL_PR_SM: number = 24;
const PL_PR_MD: number = 24;
const PL_PR_LG: number = 28;

const PT_PB_SM: number = 16;
const PT_PB_MD: number = 16;
const PT_PB_LG: number = 18;

const GAP_SM: number = 18;
const GAP_MD: number = 18;
const GAP_LG: number = 22;

const CetraInfoCard: FC = () => {
    return (
        <SimpleGrid
            bg="#7173FC"
            borderTopLeftRadius="5px"
            borderTopRightRadius="5px"
            gap={[`${GAP_SM}px`, `${GAP_MD}px`, `${GAP_LG}px`]}
            pl={[`${PL_PR_SM}px`, `${PL_PR_MD}px`, `${PL_PR_LG}px`]}
            pr={[`${PL_PR_SM}px`, `${PL_PR_MD}px`, `${PL_PR_LG}px`]}
            pt={[`${PT_PB_SM}px`, `${PT_PB_MD}px`, `${PT_PB_LG}px`]}
            pb={[`${PT_PB_SM}px`, `${PT_PB_MD}px`, `${PT_PB_LG}px`]}
        >
            <Stack direction="row" spacing="auto">
                <Link href="https://twitter.com/CetraFinance" isExternal>
                    <Image
                        w={[
                            `${LOGO_SIZE_SM}px`,
                            `${LOGO_SIZE_MD}px`,
                            `${LOGO_SIZE_LG}px`,
                        ]}
                        h={[
                            `${LOGO_SIZE_SM}px`,
                            `${LOGO_SIZE_MD}px`,
                            `${LOGO_SIZE_LG}px`,
                        ]}
                        src={TwitterLogo}
                    />
                </Link>
                <Link href="https://discord.gg/22WBP95dKF" isExternal>
                    <Image
                        w={[
                            `${LOGO_SIZE_SM}px`,
                            `${LOGO_SIZE_MD}px`,
                            `${LOGO_SIZE_LG}px`,
                        ]}
                        h={[
                            `${LOGO_SIZE_SM}px`,
                            `${LOGO_SIZE_MD}px`,
                            `${LOGO_SIZE_LG}px`,
                        ]}
                        src={DiscordLogo}
                    />
                </Link>
                <Link href="https://medium.com/@cetrafinance" isExternal>
                    <Image
                        w={[
                            `${LOGO_SIZE_SM}px`,
                            `${LOGO_SIZE_MD}px`,
                            `${LOGO_SIZE_LG}px`,
                        ]}
                        h={[
                            `${LOGO_SIZE_SM}px`,
                            `${LOGO_SIZE_MD}px`,
                            `${LOGO_SIZE_LG}px`,
                        ]}
                        src={MediumLogo}
                    />
                </Link>
            </Stack>
            <Stack spacing="4px">
                <Link
                    color="#FFF"
                    fontFamily="Chakra Petch"
                    fontSize={[
                        `${FONT_SIZE_SM}px`,
                        `${FONT_SIZE_MD}px`,
                        `${FONT_SIZE_LG}px`,
                    ]}
                    fontWeight="bold"
                    href="https://cetra.gitbook.io/welcome/"
                    isExternal
                >
                    How it works
                </Link>
                <Link
                    color="#FFF"
                    fontFamily="Chakra Petch"
                    fontSize={[
                        `${FONT_SIZE_SM}px`,
                        `${FONT_SIZE_MD}px`,
                        `${FONT_SIZE_LG}px`,
                    ]}
                    fontWeight="bold"
                    href="mailto:artemy@cetra.finance"
                    isExternal
                >
                    Contact Us
                </Link>
            </Stack>
            <Text
                color="#FFF"
                fontFamily="Chakra Petch"
                fontSize={[
                    `${SUB_FONT_SIZE_SM}px`,
                    `${SUB_FONT_SIZE_MD}px`,
                    `${SUB_FONT_SIZE_LG}px`,
                ]}
                fontWeight="medium"
            >
                Cetra Labs, 2023
            </Text>
        </SimpleGrid>
    );
};

export { CetraInfoCard };
