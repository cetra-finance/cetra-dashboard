import { FC, useCallback } from "react";
import {
    Box,
    Text,
    Image,
    SimpleGrid,
    Stack,
    Input,
    Button,
} from "@chakra-ui/react";
import { CetraButton } from "../../components";

interface DepositFarmProps {
    farmName: string;
    baseFarmName: string;
    baseFarmIcon: string;
    quoteFarmName: string;
    quoteFarmIcon: string;
    apy: string;
    tvl: string;
    strategy: string;
    assetName: string;
    assetIcon: string;
    quoteAssetName: string;
    quoteAssetIcon: string;
    balance: string;
    onClickFarm?: () => void;
}

const DepositFarm: FC<DepositFarmProps> = ({
    farmName,
    baseFarmName,
    baseFarmIcon,
    quoteFarmName,
    quoteFarmIcon,
    apy,
    tvl,
    strategy,
    assetName,
    assetIcon,
    quoteAssetName,
    quoteAssetIcon,
    balance,
    onClickFarm,
}) => {
    const handleOnClick = useCallback(() => {
        if (onClickFarm) onClickFarm();
    }, [onClickFarm]);

    return (
        <SimpleGrid gap="56px">
            <SimpleGrid gap="22px">
                <SimpleGrid columns={2} justifyContent="space-evenly">
                    <Stack direction="row" alignItems="center">
                        <Text
                            color="#1F2040"
                            fontFamily="Chakra Petch"
                            fontSize="20px"
                            fontWeight="bold"
                            pr="12px"
                        >
                            Farm {farmName}
                        </Text>
                        <Image
                            src={baseFarmIcon}
                            opacity="0.7"
                            w="16px"
                            h="16px"
                        />
                        <Text
                            color="#1F2040"
                            fontFamily="Chakra Petch"
                            fontSize="14px"
                            fontWeight="medium"
                            opacity="0.7"
                        >
                            {baseFarmName}
                        </Text>
                        <Text
                            color="#E8ECFD"
                            fontFamily="Chakra Petch"
                            opacity="0.7"
                        >
                            /
                        </Text>
                        <Image
                            src={quoteFarmIcon}
                            opacity="0.7"
                            w="16px"
                            h="16px"
                        />
                        <Text
                            color="#1F2040"
                            fontFamily="Chakra Petch"
                            fontSize="14px"
                            fontWeight="medium"
                            opacity="0.7"
                        >
                            {quoteFarmName}
                        </Text>
                    </Stack>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        spacing="28px"
                    >
                        <Text
                            color="#5555FF"
                            fontFamily="Chakra Petch"
                            fontSize="20px"
                            fontWeight="bold"
                        >
                            APY: {apy}
                        </Text>
                        <Text
                            color="#1F2040"
                            fontFamily="Chakra Petch"
                            fontSize="20px"
                            fontWeight="bold"
                        >
                            TVL: {tvl}
                        </Text>
                        <Box
                            border="1px"
                            borderColor="#E8ECFD"
                            pr="12px"
                            pl="12px"
                            pt="3px"
                            pb="3px"
                            borderRadius="7px"
                        >
                            <Text
                                color="#1F2040"
                                fontFamily="Chakra Petch"
                                fontSize="20px"
                                fontWeight="bold"
                            >
                                {strategy}
                            </Text>
                        </Box>
                    </Stack>
                </SimpleGrid>
                <Stack direction="column" spacing="5px">
                    <Stack direction="row">
                        <Text
                            color="#1F2040"
                            fontFamily="Chakra Petch"
                            fontSize="14px"
                            fontWeight="medium"
                        >
                            Available balance:
                        </Text>
                        <Text
                            color="#1F2040"
                            fontFamily="Chakra Petch"
                            fontSize="14px"
                            fontWeight="light"
                            decoration="underline"
                        >
                            {balance} {assetName}
                        </Text>
                    </Stack>
                    <Stack
                        direction="row"
                        border="1px"
                        borderColor="#E8ECFD"
                        borderRadius="7px"
                        alignItems="center"
                        pl="8px"
                        pr="8px"
                        pt="4px"
                        pb="4px"
                    >
                        <Image src={assetIcon} w="29px" h="29px" />
                        <Input
                            variant="unstyled"
                            type="number"
                            color="#1F2040"
                            fontFamily="Chakra Petch"
                            fontSize="20px"
                            fontWeight="medium"
                        />
                        <Button
                            variant="unstyled"
                            color="#1F2040"
                            fontFamily="Chakra Petch"
                            fontSize="16px"
                            fontWeight="medium"
                        >
                            MAX
                        </Button>
                    </Stack>
                </Stack>
                <CetraButton
                    onClick={handleOnClick}
                    fontSize="22px"
                    fontWeight="bold"
                    h="45px"
                >
                    Farm
                </CetraButton>
            </SimpleGrid>
            <SimpleGrid
                w="562px"
                shadow="lg"
                pl="20px"
                pr="20px"
                pt="30px"
                pb="30px"
                gap="6px"
                borderRadius="5px"
            >
                <Stack
                    direction="row"
                    borderBottom="1px"
                    borderColor="#E8ECFD"
                    pb="3px"
                    justifyContent="space-between"
                >
                    <Text
                        color="#1F2040"
                        fontFamily="Chakra Petch"
                        fontSize="18px"
                        fontWeight="medium"
                    >
                        Assets Supplied
                    </Text>
                    <Stack direction="row" spacing="7px">
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing="5px"
                        >
                            <Image src={assetIcon} w="15px" h="15px" />
                            <Text
                                color="#1F2040"
                                fontFamily="Chakra Petch"
                                fontSize="18px"
                                fontWeight="medium"
                            >
                                50 {assetName}
                            </Text>
                        </Stack>
                        <Text
                            color="#1F2040"
                            fontFamily="Chakra Petch"
                            fontSize="18px"
                            fontWeight="medium"
                        >
                            +
                        </Text>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing="5px"
                        >
                            <Image src={quoteAssetIcon} w="15px" h="15px" />
                            <Text
                                color="#1F2040"
                                fontFamily="Chakra Petch"
                                fontSize="18px"
                                fontWeight="medium"
                            >
                                3.71 {quoteAssetName}
                            </Text>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack
                    direction="row"
                    borderBottom="1px"
                    borderColor="#E8ECFD"
                    pb="3px"
                    justifyContent="space-between"
                >
                    <Text
                        color="#1F2040"
                        fontFamily="Chakra Petch"
                        fontSize="18px"
                        fontWeight="medium"
                    >
                        Assets Borrowed
                    </Text>
                    <Stack direction="row" spacing="7px">
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing="5px"
                        >
                            <Image src={assetIcon} w="15px" h="15px" />
                            <Text
                                color="#1F2040"
                                fontFamily="Chakra Petch"
                                fontSize="18px"
                                fontWeight="medium"
                            >
                                50 {assetName}
                            </Text>
                        </Stack>
                        <Text
                            color="#1F2040"
                            fontFamily="Chakra Petch"
                            fontSize="18px"
                            fontWeight="medium"
                        >
                            +
                        </Text>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing="5px"
                        >
                            <Image src={quoteAssetIcon} w="15px" h="15px" />
                            <Text
                                color="#1F2040"
                                fontFamily="Chakra Petch"
                                fontSize="18px"
                                fontWeight="medium"
                            >
                                3.71 {quoteAssetName}
                            </Text>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack
                    direction="row"
                    borderBottom="1px"
                    borderColor="#E8ECFD"
                    pb="3px"
                    justifyContent="space-between"
                >
                    <Text
                        color="#1F2040"
                        fontFamily="Chakra Petch"
                        fontSize="18px"
                        fontWeight="medium"
                    >
                        Total Assets in Position Value
                    </Text>
                    <Stack direction="row" spacing="7px">
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing="5px"
                        >
                            <Image src={assetIcon} w="15px" h="15px" />
                            <Text
                                color="#1F2040"
                                fontFamily="Chakra Petch"
                                fontSize="18px"
                                fontWeight="medium"
                            >
                                50 {assetName}
                            </Text>
                        </Stack>
                        <Text
                            color="#1F2040"
                            fontFamily="Chakra Petch"
                            fontSize="18px"
                            fontWeight="medium"
                        >
                            +
                        </Text>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing="5px"
                        >
                            <Image src={quoteAssetIcon} w="15px" h="15px" />
                            <Text
                                color="#1F2040"
                                fontFamily="Chakra Petch"
                                fontSize="18px"
                                fontWeight="medium"
                            >
                                3.71 {quoteAssetName}
                            </Text>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack
                    direction="row"
                    borderBottom="1px"
                    borderColor="#E8ECFD"
                    pb="3px"
                    justifyContent="space-between"
                >
                    <Text
                        color="#1F2040"
                        fontFamily="Chakra Petch"
                        fontSize="18px"
                        fontWeight="medium"
                    >
                        Amount to Swap
                    </Text>
                    <Stack direction="row" spacing="30px">
                        <Stack
                            direction="row"
                            spacing="5px"
                            alignItems="center"
                        >
                            <Image src={quoteAssetIcon} w="15px" h="15px" />
                            <Text
                                color="#1F2040"
                                fontFamily="Chakra Petch"
                                fontSize="18px"
                                fontWeight="medium"
                            >
                                1 {quoteAssetName}
                            </Text>
                        </Stack>
                        <Stack
                            direction="row"
                            spacing="5px"
                            alignItems="center"
                        >
                            <Image src={assetIcon} w="15px" h="15px" />
                            <Text
                                color="#1F2040"
                                fontFamily="Chakra Petch"
                                fontSize="18px"
                                fontWeight="medium"
                            >
                                2 {assetName}
                            </Text>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack
                    direction="row"
                    borderBottom="1px"
                    borderColor="#E8ECFD"
                    pb="3px"
                    justifyContent="space-between"
                >
                    <Text
                        color="#1F2040"
                        fontFamily="Chakra Petch"
                        fontSize="18px"
                        fontWeight="medium"
                    >
                        Net Exposure:
                    </Text>
                    <Text
                        color="#63637A"
                        fontFamily="Chakra Petch"
                        fontSize="18px"
                        fontWeight="medium"
                    >
                        Long 145.99 {assetName}
                    </Text>
                </Stack>
                <Stack
                    direction="row"
                    borderBottom="1px"
                    borderColor="#E8ECFD"
                    pb="3px"
                    justifyContent="space-between"
                >
                    <Text
                        color="#1F2040"
                        fontFamily="Chakra Petch"
                        fontSize="18px"
                        fontWeight="medium"
                    >
                        Share of Pool()
                    </Text>
                    <Text
                        color="#63637A"
                        fontFamily="Chakra Petch"
                        fontSize="18px"
                        fontWeight="medium"
                    >
                        0%
                    </Text>
                </Stack>
            </SimpleGrid>
        </SimpleGrid>
    );
};

export { DepositFarm, type DepositFarmProps };
