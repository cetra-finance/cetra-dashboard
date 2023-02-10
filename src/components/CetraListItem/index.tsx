import { SimpleGrid, Box, Text, Image, Stack } from "@chakra-ui/react";
import { FC } from "react";
import { CetraButton } from "../CetraButton";

const LOGO_SIZE_SM: number = 22;
const LOGO_SIZE_MD: number = 22;
const LOGO_SIZE_LG: number = 27;

interface CetraListItemProps {
    poolName: string;
    baseAssetIcon: string;
    quoteAssetIcon: string;
    baseFarmIcon: string;
    baseFarmName: string;
    quoteFarmIcon: string;
    quoteFarmName: string;
    apy: string;
    tvl: string;
    totalApr: string;
    dailyApr: string;
    strategy: string;
    actionText: string;
    onAction?: () => void;
}

const CetraListItem: FC<CetraListItemProps> = ({
    poolName,
    baseAssetIcon,
    quoteAssetIcon,
    baseFarmIcon,
    baseFarmName,
    quoteFarmIcon,
    quoteFarmName,
    apy,
    tvl,
    totalApr,
    dailyApr,
    strategy,
    actionText,
    onAction,
}) => {
    return (
        <SimpleGrid
            columns={6}
            borderBottom="1px"
            borderColor="#E8ECFD"
            mt="43px"
            justifyItems="center"
            alignItems="center"
            pb="37px"
        >
            <Box>
                <SimpleGrid
                    columns={2}
                    justifyItems="center"
                    alignItems="center"
                >
                    <Stack
                        direction={["column", "column", "row"]}
                        spacing="-6px"
                    >
                        <Image
                            src={baseAssetIcon}
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
                        />
                        <Image
                            src={quoteAssetIcon}
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
                        />
                    </Stack>
                    <SimpleGrid justifyItems="center" alignItems="center">
                        <Box borderBottom="1px" borderColor="#E8ECFD">
                            <Text
                                align="center"
                                color="#1F2040"
                                fontFamily="Chakra Petch"
                                fontSize={["10px", "10px", "16px"]}
                                fontWeight="bold"
                            >
                                {poolName}
                            </Text>
                        </Box>
                        <Box>
                            <Stack
                                direction="row"
                                spacing="2px"
                                alignItems="center"
                            >
                                <Image
                                    src={baseFarmIcon}
                                    w={["8px", "8px", "12px"]}
                                    h={["8px", "8px", "12px"]}
                                />
                                <Text
                                    color="#1F2040"
                                    fontFamily="Chakra Petch"
                                    fontSize={["6px", "6px", "10px"]}
                                    fontWeight="medium"
                                >
                                    {baseFarmName}
                                </Text>
                                <Text
                                    color="#E8ECFD"
                                    fontFamily="Chakra Petch"
                                    fontSize={["6px", "6px", "10px"]}
                                    fontWeight="medium"
                                >
                                    /
                                </Text>
                                <Image
                                    src={quoteFarmIcon}
                                    w={["8px", "8px", "12px"]}
                                    h={["8px", "8px", "12px"]}
                                />
                                <Text
                                    color="#1F2040"
                                    fontFamily="Chakra Petch"
                                    fontSize={["6px", "6px", "10px"]}
                                    fontWeight="medium"
                                >
                                    {quoteFarmName}
                                </Text>
                            </Stack>
                        </Box>
                    </SimpleGrid>
                </SimpleGrid>
            </Box>
            <Box>
                <Text
                    align="center"
                    color="#5555FF"
                    fontFamily="Chakra Petch"
                    fontSize={["14px", "14px", "20px"]}
                    fontWeight="bold"
                >
                    {apy}
                </Text>
            </Box>
            <Box>
                <Text
                    align="center"
                    color="#1F2040"
                    fontFamily="Chakra Petch"
                    fontSize={["12px", "12px", "16px"]}
                    fontWeight="bold"
                >
                    {tvl}
                </Text>
            </Box>
            <Box>
                <Text
                    align="center"
                    color="#1F2040"
                    fontFamily="Chakra Petch"
                    fontSize={["8px", "8px", "10px"]}
                    fontWeight="medium"
                >
                    {totalApr}
                </Text>
                <Text
                    align="center"
                    color="#1F2040"
                    fontFamily="Chakra Petch"
                    fontSize={["8px", "8px", "10px"]}
                    fontWeight="medium"
                >
                    {dailyApr}
                </Text>
            </Box>
            <Box>
                <Text
                    align="center"
                    color="#1F2040"
                    fontFamily="Chakra Petch"
                    fontSize={["10px", "10px", "14px"]}
                    fontWeight="bold"
                >
                    {strategy}
                </Text>
            </Box>
            <CetraButton
                w="80%"
                h="32px"
                onClick={() => {
                    if (onAction) onAction();
                }}
            >
                {actionText}
            </CetraButton>
        </SimpleGrid>
    );
};

export { CetraListItem, type CetraListItemProps };
