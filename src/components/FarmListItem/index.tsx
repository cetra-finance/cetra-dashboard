import { SimpleGrid, Box, Text, Image, Stack } from "@chakra-ui/react";
import { FC } from "react";
import { CetraButton } from "../CetraButton";

interface FarmListItemProps {
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
}

const FarmListItem: FC<FarmListItemProps> = ({
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
                    <Stack direction="row" spacing="-6px">
                        <Image src={baseAssetIcon} w="27px" h="27px" />
                        <Image src={quoteAssetIcon} w="27px" h="27px" />
                    </Stack>
                    <SimpleGrid justifyItems="center" alignItems="center">
                        <Box borderBottom="1px" borderColor="#E8ECFD">
                            <Text
                                align="center"
                                color="#1F2040"
                                fontSize="16px"
                                fontWeight="bold"
                            >
                                {poolName}
                            </Text>
                        </Box>
                        <Box>
                            <Stack direction="row" spacing="2px">
                                <Image src={baseFarmIcon} w="12px" h="12px" />
                                <Text
                                    color="#1F2040"
                                    fontSize="10px"
                                    fontWeight="medium"
                                >
                                    {baseFarmName}
                                </Text>
                                <Text
                                    color="#E8ECFD"
                                    fontSize="10px"
                                    fontWeight="medium"
                                >
                                    /
                                </Text>
                                <Image src={quoteFarmIcon} w="12px" h="12px" />
                                <Text
                                    color="#1F2040"
                                    fontSize="10px"
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
                    fontSize="20px"
                    fontWeight="bold"
                >
                    {apy}
                </Text>
            </Box>
            <Box>
                <Text
                    align="center"
                    color="#1F2040"
                    fontSize="16px"
                    fontWeight="bold"
                >
                    {tvl}
                </Text>
            </Box>
            <Box>
                <Text
                    align="center"
                    color="#1F2040"
                    fontSize="10px"
                    fontWeight="medium"
                >
                    Total APR: {totalApr}
                </Text>
                <Text
                    align="center"
                    color="#1F2040"
                    fontSize="10px"
                    fontWeight="medium"
                >
                    Daily APR: {dailyApr}
                </Text>
            </Box>
            <Box>
                <Text
                    align="center"
                    color="#1F2040"
                    fontSize="14px"
                    fontWeight="bold"
                >
                    {strategy}
                </Text>
            </Box>
            <CetraButton w="80%" h="32px">
                Deposit
            </CetraButton>
        </SimpleGrid>
    );
};

export { FarmListItem, type FarmListItemProps };
