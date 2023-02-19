import { FC, useEffect, useCallback, useState } from "react";
import {
    Box,
    Text,
    Image,
    SimpleGrid,
    Stack,
    Input,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalBody,
} from "@chakra-ui/react";
import {
    useBalance,
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
    useContractRead,
} from "wagmi";
import { erc20ABI } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { useLocation } from "react-router-dom";
import ChamberV1ABI from "../../assets/abis/ChamberV1.json";
import CetraBuzzLogo from "../../assets/cetra-buzz.svg";
import CetraMoneyBagLogo from "../../assets/cetra-money-bag.svg";
import { CetraButton } from "../../components";
import { Pool } from "../../pools";
import { denormalizeAmount, USDC_ADDRESS } from "../../utils";

interface CardInfo {
    assetsSupplied: string[];
    assetsBorrowed: string[];
    totalAssetsInPositionValue: string[];
    amountToSwap: string[];
    netExposure: string;
    shareOfPool: string;
}

interface FarmProps {
    onLoaded?: (farmName: string) => void;
}

const Farm: FC<FarmProps> = ({ onLoaded }) => {
    const location = useLocation();

    const state = location.state as Pool;
    if (!state) {
        window.location.href = "/";
        return null;
    }

    useEffect(() => {
        onLoaded?.(state.name);
    }, [state.name]);

    const {
        isOpen: isDepositModalOpen,
        onOpen: onDepositModalOpen,
        onClose: onDepositModalClose,
    } = useDisclosure();

    const {
        isOpen: isWithdrawModalOpen,
        onOpen: onWithdrawModalOpen,
        onClose: onWithdrawModalClose,
    } = useDisclosure();

    const [inputAmount, setInputAmount] = useState("0.0");
    const denormalizedInputAmount = BigNumber.from(
        denormalizeAmount(inputAmount).toString()
    );

    // Connect user wallet
    const { address, isConnected } = useAccount();
    // Obtain user USDC amount
    const { data: balanceData } = useBalance({
        address,
        // TODO: Move deposit token address into state
        token: USDC_ADDRESS,
        watch: true,
        enabled: isConnected,
    });

    // Get user USDC allowance
    const {
        data: usdcAllowanceAmount,
        isError: isUsdcAllowanceError,
        isLoading: isUsdcAllowanceLoading,
    } = useContractRead({
        address: USDC_ADDRESS,
        abi: erc20ABI,
        functionName: "allowance",
        args: [address!, state.address],
        enabled: isConnected,
    });

    // Prepare USDC approve call
    const isApproveAvailable =
        isConnected && usdcAllowanceAmount
            ? usdcAllowanceAmount.isZero() ||
              usdcAllowanceAmount.lt(denormalizedInputAmount)
            : false;
    const { config: approveConfig } = usePrepareContractWrite({
        address: USDC_ADDRESS,
        abi: erc20ABI,
        functionName: "approve",
        args: [state.address, ethers.constants.MaxUint256],
        enabled: isApproveAvailable,
    });
    const {
        data: approveData,
        isLoading: isApproveLoading,
        isSuccess: isApproveSuccess,
        write: writeApprove,
        error: approveError,
        status: approveStatus,
    } = useContractWrite(approveConfig);

    // Prepare mint(deposit) call
    const isDepositAvailable =
        isConnected &&
        (balanceData ? !balanceData.value.isZero() : false) &&
        !denormalizedInputAmount.isZero() &&
        (balanceData ? denormalizedInputAmount <= balanceData.value : false) &&
        (usdcAllowanceAmount
            ? usdcAllowanceAmount.gte(denormalizedInputAmount)
            : false);
    const { config: depositConfig } = usePrepareContractWrite({
        address: state.address,
        abi: ChamberV1ABI,
        functionName: "mint",
        args: [denormalizedInputAmount],
        enabled: isDepositAvailable,
    });
    const {
        data: depositData,
        isLoading: isDepositLoading,
        isSuccess: isDepositSuccess,
        write: writeDeposit,
        error: depositError,
        status: depositStatus,
    } = useContractWrite({
        ...depositConfig,
        onSuccess() {
            onDepositModalOpen();
        },
    });

    // Get total shares amount
    const {
        data: totalSharesAmount,
        isError: isTotalSharesError,
        isLoading: isTotalSharesLoading,
    } = useContractRead({
        address: state.address,
        abi: ChamberV1ABI,
        functionName: "s_totalShares",
        watch: true,
        enabled: isConnected,
    });

    // Get current usd amount
    const {
        data: currentUsdAmount,
        isError: isCurrentUsdError,
        isLoading: isCurrentUsdLoading,
    } = useContractRead({
        address: state.address,
        abi: ChamberV1ABI,
        functionName: "currentUSDBalance",
        watch: true,
        enabled: isConnected,
    });

    // Get user shares amount
    const {
        data: userSharesAmount,
        isError: isUserSharesError,
        isLoading: isUserSharesLoading,
    } = useContractRead({
        address: state.address,
        abi: ChamberV1ABI,
        functionName: "s_userShares",
        args: [address],
        watch: true,
        enabled: isConnected,
    });

    // Get user shares amount in USD
    const {
        data: userSharesAmountUSD,
        isError: isUserSharesUsdError,
        isLoading: isUserSharesUsdLoading,
    } = useContractRead({
        address: state.address,
        abi: ChamberV1ABI,
        functionName: "sharesWorth",
        args: [userSharesAmount],
        watch: true,
        enabled:
            isConnected &&
            (userSharesAmount
                ? !(userSharesAmount as BigNumber).isZero()
                : false),
    });

    // Prepare burn(withdraw) call
    const burnAmount = (
        currentUsdAmount ? (currentUsdAmount as BigNumber).isZero() : true
    )
        ? BigNumber.from("0")
        : BigNumber.from(denormalizedInputAmount)
              .mul(1e6)
              .div(currentUsdAmount as BigNumber)
              .mul(totalSharesAmount as BigNumber)
              .div(1e6);
    const isWithdrawAvailable =
        isConnected &&
        !burnAmount.isZero() &&
        !denormalizedInputAmount.isZero() &&
        (userSharesAmount
            ? !(userSharesAmount as BigNumber).isZero()
            : false) &&
        (userSharesAmountUSD
            ? denormalizedInputAmount <= (userSharesAmountUSD as BigNumber)
            : false);
    const { config: withdrawConfig } = usePrepareContractWrite({
        address: state.address,
        abi: ChamberV1ABI,
        functionName: "burn",
        args: [burnAmount],
        enabled: isWithdrawAvailable,
    });
    const {
        data: withdrawData,
        isLoading: isWithdrawLoading,
        isSuccess: isWithdrawSuccess,
        write: writeWithdraw,
        error: withdrawError,
        status: withdrawStatus,
    } = useContractWrite({
        ...withdrawConfig,
        onSuccess() {
            onWithdrawModalOpen();
        },
    });

    const handleOnClickDeposit = useCallback(() => {
        writeDeposit?.();
        // setInputAmount("0.0");
    }, [depositConfig]);
    const handleOnClickApprove = useCallback(() => {
        writeApprove?.();
        // setInputAmount("0.0");
    }, [approveConfig]);
    const handleOnClickWithdraw = useCallback(() => {
        writeWithdraw?.();
        // setInputAmount("0.0");
    }, [withdrawConfig]);
    const handleOnClickMax = useCallback(() => {
        setInputAmount(balanceData?.formatted ?? "0.0");
    }, [balanceData]);

    /* console.log("==================");
    console.log(`isApproveLoading: ${isApproveLoading}`);
    console.log(`isApproveSuccess: ${isApproveSuccess}`);
    console.log(`approveError: ${approveError}`);
    console.log(`approveStatus: ${approveStatus}`); */

    /* console.log("==================");
    console.log(`isDepositLoading: ${isDepositLoading}`);
    console.log(`isDepositSuccess: ${isDepositSuccess}`);
    console.log(`isDepositAvailable: ${isDepositAvailable}`);
    console.log(`depositError: ${depositError}`);
    console.log(`depositStatus: ${depositStatus}`);
    console.log(`userSharesAmount: ${userSharesAmount}`);
    console.log(`userSharesAmountUSD: ${userSharesAmountUSD}`);
    console.log(`totalSharesAmount: ${totalSharesAmount}`);
    console.log(`currentUsdAmount: ${currentUsdAmount}`); */

    // TODO: Calculate TVL
    const tvl = "$8.05M";

    const balance = balanceData?.formatted ?? "0.0";

    // TODO: Calculate card info
    const cardInfo: CardInfo = {
        assetsSupplied: ["50", "3.71"],
        assetsBorrowed: ["50", "3.71"],
        totalAssetsInPositionValue: ["50", "3.71"],
        amountToSwap: ["1", "2"],
        netExposure: "145.99",
        shareOfPool: "0",
    };

    return (
        <>
            <Modal
                onClose={onDepositModalClose}
                isOpen={isDepositModalOpen}
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
                        Deposit successfully!
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack direction="row" justify="center" spacing={10}>
                            <Stack direction="column" spacing={5}>
                                <Text
                                    color="#4A4C76"
                                    fontFamily="Chakra Petch"
                                    fontWeight="medium"
                                    fontSize="14px"
                                >
                                    Now look up your positions in Portfolio,
                                    open a new position, or share it on Twitter
                                </Text>
                                <Stack direction="row" spacing={2.5}>
                                    <CetraButton
                                        h="8"
                                        onClick={() =>
                                            (window.location.href =
                                                "/portfolio")
                                        }
                                    >
                                        Portfolio
                                    </CetraButton>
                                    <CetraButton
                                        h="8"
                                        border="1px"
                                        borderColor="#7173FC"
                                        color="#7173FC"
                                        bgColor="transparent"
                                        _hover={{
                                            color: "#FFF",
                                            bg: "#7173FC",
                                        }}
                                        onClick={() =>
                                            (window.location.href = "/")
                                        }
                                    >
                                        New Position
                                    </CetraButton>
                                </Stack>
                            </Stack>
                            <Image w="24" h="24" src={CetraBuzzLogo} />
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Modal
                onClose={onWithdrawModalClose}
                isOpen={isWithdrawModalOpen}
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
                        Position Closed
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack direction="row" justify="center" spacing={10}>
                            <Stack direction="column" spacing={5}>
                                <Text
                                    color="#4A4C76"
                                    fontFamily="Chakra Petch"
                                    fontWeight="medium"
                                    fontSize="14px"
                                >
                                    Rewards are already in your wallet. Earned
                                    by Cetra for you with love 💝
                                </Text>
                                <Stack direction="row" spacing={2.5}>
                                    <CetraButton
                                        h="8"
                                        onClick={() =>
                                            (window.location.href =
                                                "/portfolio")
                                        }
                                    >
                                        Portfolio
                                    </CetraButton>
                                    <CetraButton
                                        h="8"
                                        border="1px"
                                        borderColor="#7173FC"
                                        color="#7173FC"
                                        bgColor="transparent"
                                        _hover={{
                                            color: "#FFF",
                                            bg: "#7173FC",
                                        }}
                                        onClick={() =>
                                            (window.location.href = "/")
                                        }
                                    >
                                        New Position
                                    </CetraButton>
                                </Stack>
                            </Stack>
                            <Image w="24" h="24" src={CetraMoneyBagLogo} />
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
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
                                Farm {state.name}
                            </Text>
                            <Image
                                src={state.baseFarmIcon}
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
                                {state.baseFarmName}
                            </Text>
                            <Text
                                color="#E8ECFD"
                                fontFamily="Chakra Petch"
                                opacity="0.7"
                            >
                                /
                            </Text>
                            <Image
                                src={state.quoteFarmIcon}
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
                                {state.quoteFarmName}
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
                                APY: --%
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
                                    {state.strategy}
                                </Text>
                            </Box>
                        </Stack>
                    </SimpleGrid>
                    <Stack direction="column" spacing="5px">
                        <Stack direction="row" justifyContent="space-between">
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
                                    {balance} {state.depositAssetName}
                                </Text>
                            </Stack>
                            {userSharesAmount ? (
                                (
                                    userSharesAmount as BigNumber
                                ).isZero() ? null : (
                                    <Stack direction="row">
                                        <Text
                                            color="#1F2040"
                                            fontFamily="Chakra Petch"
                                            fontSize="14px"
                                            fontWeight="medium"
                                        >
                                            Your position:
                                        </Text>
                                        <Text
                                            color="#1F2040"
                                            fontFamily="Chakra Petch"
                                            fontSize="14px"
                                            fontWeight="light"
                                            decoration="underline"
                                        >
                                            {userSharesAmountUSD
                                                ? (
                                                      userSharesAmountUSD as BigNumber
                                                  ).toNumber() / 1e6
                                                : 0.0}{" "}
                                            {state.depositAssetName}
                                        </Text>
                                    </Stack>
                                )
                            ) : null}
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
                            <Image
                                src={state.depositAssetIcon}
                                w="29px"
                                h="29px"
                            />
                            <Input
                                variant="unstyled"
                                type="number"
                                color="#1F2040"
                                fontFamily="Chakra Petch"
                                fontSize="20px"
                                fontWeight="medium"
                                isDisabled={!isConnected}
                                value={inputAmount}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setInputAmount(
                                        value.length === 0 ? "0.0" : value
                                    );
                                }}
                            />
                            <Button
                                variant="unstyled"
                                color="#1F2040"
                                fontFamily="Chakra Petch"
                                fontSize="16px"
                                fontWeight="medium"
                                isDisabled={!isConnected}
                                onClick={handleOnClickMax}
                            >
                                MAX
                            </Button>
                        </Stack>
                    </Stack>
                    <CetraButton
                        fontSize="22px"
                        fontWeight="bold"
                        h="45px"
                        isDisabled={!isConnected || balance === "0.0"}
                        isLoading={isDepositLoading}
                        onClick={() =>
                            isApproveAvailable
                                ? handleOnClickApprove()
                                : handleOnClickDeposit()
                        }
                    >
                        {isApproveAvailable ? "Approve" : "Farm"}
                    </CetraButton>
                    {userSharesAmount ? (
                        (userSharesAmount as BigNumber).isZero() ? null : (
                            <CetraButton
                                fontSize="22px"
                                fontWeight="bold"
                                h="45px"
                                border="1px"
                                borderColor="#7173FC"
                                color="#7173FC"
                                bgColor="transparent"
                                isDisabled={!isConnected}
                                isLoading={isWithdrawLoading}
                                onClick={handleOnClickWithdraw}
                                _hover={{
                                    color: "#FFF",
                                    bg: "#7173FC",
                                }}
                            >
                                Withdraw
                            </CetraButton>
                        )
                    ) : null}
                </SimpleGrid>
                <SimpleGrid
                    w="562px"
                    boxShadow="0px 0px 38px 5px #0000000D"
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
                                <Image
                                    src={state.baseAssetIcon}
                                    w="15px"
                                    h="15px"
                                />
                                <Text
                                    color="#1F2040"
                                    fontFamily="Chakra Petch"
                                    fontSize="18px"
                                    fontWeight="medium"
                                >
                                    {cardInfo.assetsSupplied[0]}{" "}
                                    {state.baseAssetName}
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
                                <Image
                                    src={state.quoteAssetIcon}
                                    w="15px"
                                    h="15px"
                                />
                                <Text
                                    color="#1F2040"
                                    fontFamily="Chakra Petch"
                                    fontSize="18px"
                                    fontWeight="medium"
                                >
                                    {cardInfo.assetsSupplied[1]}{" "}
                                    {state.quoteAssetName}
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
                                <Image
                                    src={state.baseAssetIcon}
                                    w="15px"
                                    h="15px"
                                />
                                <Text
                                    color="#1F2040"
                                    fontFamily="Chakra Petch"
                                    fontSize="18px"
                                    fontWeight="medium"
                                >
                                    {cardInfo.assetsBorrowed[0]}{" "}
                                    {state.baseAssetName}
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
                                <Image
                                    src={state.quoteAssetIcon}
                                    w="15px"
                                    h="15px"
                                />
                                <Text
                                    color="#1F2040"
                                    fontFamily="Chakra Petch"
                                    fontSize="18px"
                                    fontWeight="medium"
                                >
                                    {cardInfo.assetsBorrowed[1]}{" "}
                                    {state.quoteAssetName}
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
                                <Image
                                    src={state.baseAssetIcon}
                                    w="15px"
                                    h="15px"
                                />
                                <Text
                                    color="#1F2040"
                                    fontFamily="Chakra Petch"
                                    fontSize="18px"
                                    fontWeight="medium"
                                >
                                    {cardInfo.totalAssetsInPositionValue[0]}{" "}
                                    {state.baseAssetName}
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
                                <Image
                                    src={state.quoteAssetIcon}
                                    w="15px"
                                    h="15px"
                                />
                                <Text
                                    color="#1F2040"
                                    fontFamily="Chakra Petch"
                                    fontSize="18px"
                                    fontWeight="medium"
                                >
                                    {cardInfo.totalAssetsInPositionValue[1]}{" "}
                                    {state.quoteAssetName}
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
                                <Image
                                    src={state.quoteAssetIcon}
                                    w="15px"
                                    h="15px"
                                />
                                <Text
                                    color="#1F2040"
                                    fontFamily="Chakra Petch"
                                    fontSize="18px"
                                    fontWeight="medium"
                                >
                                    {cardInfo.amountToSwap[0]}{" "}
                                    {state.quoteAssetName}
                                </Text>
                            </Stack>
                            <Stack
                                direction="row"
                                spacing="5px"
                                alignItems="center"
                            >
                                <Image
                                    src={state.baseAssetIcon}
                                    w="15px"
                                    h="15px"
                                />
                                <Text
                                    color="#1F2040"
                                    fontFamily="Chakra Petch"
                                    fontSize="18px"
                                    fontWeight="medium"
                                >
                                    {cardInfo.amountToSwap[1]}{" "}
                                    {state.baseAssetName}
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
                            Long {cardInfo.netExposure} {state.baseAssetName}
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
                            {cardInfo.shareOfPool}%
                        </Text>
                    </Stack>
                </SimpleGrid>
            </SimpleGrid>
        </>
    );
};

export { Farm, type FarmProps };
