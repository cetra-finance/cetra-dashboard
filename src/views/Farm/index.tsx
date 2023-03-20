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
    Address,
} from "wagmi";
import { erc20ABI, useNetwork } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { useLocation } from "react-router-dom";
import Decimal from "decimal.js";
import IChamberV1ABI from "../../assets/abis/IChamberV1.json";
import IVariableDebtTokenABI from "../../assets/abis/IVariableDebtToken.json";
import ILendingPoolABI from "../../assets/abis/ILendingPool.json";
import CetraBuzzLogo from "../../assets/cetra-buzz.svg";
import CetraMoneyBagLogo from "../../assets/cetra-money-bag.svg";
import { CetraButton } from "../../components";
import { Pool } from "../../pools";
import {
    denormalizeAmount,
    USDC_DEPOSIT_LIMIT,
    ZERO_ADDRESS,
    DEFAULT_CHAINS,
} from "../../utils";
import { useChainPoolsData } from "../../hooks";

interface CardInfo {
    assetsInPool: string[];
    assetsBorrowed: string[];
    assetsSupplied: string;
    netExp: string;
    shareOfPool: string;
    netApy: string;
}

interface FarmProps {
    onLoaded?: (farmName: string) => void;
}

const Farm: FC<FarmProps> = ({ onLoaded }) => {
    const location = useLocation();

    const { state, apy, projectedApy } = location.state as {
        state: Pool;
        apy: string;
        projectedApy: string;
    };
    if (!state) {
        window.location.href = "/";
        return null;
    }

    const poolsData = useChainPoolsData();
    if (
        !poolsData.pools
            .map((pool) => pool.address.toLowerCase())
            .includes(state.address.toLowerCase())
    ) {
        window.location.href = "/";
        return null;
    }

    const { chain } = useNetwork();

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
    const denormalizedInputAmount = denormalizeAmount(
        inputAmount.length === 0 ? "0.0" : inputAmount
    );

    // Connect user wallet
    const { address, isConnected } = useAccount();
    // Obtain user USDC amount
    const { data: balanceData } = useBalance({
        address,
        token: state.depositAssetAddress,
        watch: true,
        enabled: isConnected,
    });

    // Get user USDC allowance
    const {
        data: usdcAllowanceAmount,
        isError: isUsdcAllowanceError,
        isLoading: isUsdcAllowanceLoading,
    } = useContractRead({
        address: state.depositAssetAddress,
        abi: erc20ABI,
        functionName: "allowance",
        args: [address!, state.address],
        enabled: isConnected,
        watch: true,
    });

    // Prepare USDC approve call
    const isApproveAvailable =
        isConnected && usdcAllowanceAmount
            ? usdcAllowanceAmount.isZero() ||
              usdcAllowanceAmount.lt(denormalizedInputAmount)
            : false;
    const { config: approveConfig } = usePrepareContractWrite({
        address: state.depositAssetAddress,
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
    // TODO: Improve deposit availability checker
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
        abi: IChamberV1ABI,
        functionName: "mint",
        args: [denormalizedInputAmount],
        enabled: isConnected,
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
        data: totalSharesAmountResult,
        isError: isTotalSharesError,
        isLoading: isTotalSharesLoading,
    } = useContractRead({
        address: state.address,
        abi: IChamberV1ABI,
        functionName: "get_s_totalShares",
        watch: true,
        enabled: isConnected,
    });
    const totalSharesAmount: BigNumber = totalSharesAmountResult
        ? (totalSharesAmountResult as BigNumber)
        : BigNumber.from(0);
    const totalSharesAmountScaled = new Decimal(
        totalSharesAmount.toString()
    ).div(1e6);

    // Get current usd amount
    const {
        data: currentUsdAmountResult,
        isError: isCurrentUsdError,
        isLoading: isCurrentUsdLoading,
    } = useContractRead({
        address: state.address,
        abi: IChamberV1ABI,
        functionName: "currentUSDBalance",
        watch: true,
    });
    const currentUsdAmount: BigNumber = currentUsdAmountResult
        ? (currentUsdAmountResult as BigNumber)
        : BigNumber.from(0);
    const currentUsdAmountScaled = new Decimal(currentUsdAmount.toString()).div(
        1e6
    );

    // Get current pool reserves
    const {
        data: currentPoolReservesResult,
        isError: isCurrentPoolReservesError,
        isLoading: isCurrentPoolReservesLoading,
    } = useContractRead({
        address: state.address,
        abi: IChamberV1ABI,
        functionName: "calculateCurrentPoolReserves",
        watch: true,
        enabled: isConnected,
    });
    const currentPoolReserves: BigNumber[] = currentPoolReservesResult
        ? (currentPoolReservesResult as BigNumber[])
        : [BigNumber.from(0), BigNumber.from(0)];

    // Get base aave token address
    const {
        data: aaveVtoken0Result,
        isError: isAaveVtoken0Error,
        isLoading: isAaveVtoken0Loading,
    } = useContractRead({
        address: state.address,
        abi: IChamberV1ABI,
        functionName: "get_i_aaveVToken0",
        watch: true,
        // TODO: Fix arbitrum interface issue
        enabled:
            isConnected && (chain ? chain.id !== DEFAULT_CHAINS[2].id : true),
    });
    const aaveVtoken0: Address = aaveVtoken0Result as Address;

    // Get quote aave token address
    const {
        data: aaveVtoken1Result,
        isError: isAaveVtoken1Error,
        isLoading: isAaveVtoken1Loading,
    } = useContractRead({
        address: state.address,
        abi: IChamberV1ABI,
        functionName: "get_i_aaveVToken1",
        watch: true,
        // TODO: Fix arbitrum interface issue
        enabled:
            isConnected && (chain ? chain.id !== DEFAULT_CHAINS[2].id : true),
    });
    const aaveVtoken1: Address = aaveVtoken1Result as Address;

    // Get base aave token scaled balance
    const {
        data: aaveVtoken0ScaledBalanceResult,
        isError: isAaveVtoken0ScaledBalanceError,
        isLoading: isAaveVtoken0ScaledBalanceLoading,
    } = useContractRead({
        address: aaveVtoken0,
        abi: IVariableDebtTokenABI,
        functionName: "scaledBalanceOf",
        args: [state.address],
        watch: true,
        enabled: isConnected && state.aavePool !== ZERO_ADDRESS,
    });
    const aaveVtoken0ScaledBalance: BigNumber = aaveVtoken0ScaledBalanceResult
        ? (aaveVtoken0ScaledBalanceResult as BigNumber)
        : BigNumber.from(0);

    // Get quote aave token scaled balance
    const {
        data: aaveVtoken1ScaledBalanceResult,
        isError: isAaveVtoken1ScaledBalanceError,
        isLoading: isAaveVtoken1ScaledBalanceLoading,
    } = useContractRead({
        address: aaveVtoken1,
        abi: IVariableDebtTokenABI,
        functionName: "scaledBalanceOf",
        args: [state.address],
        watch: true,
        enabled: isConnected && state.aavePool !== ZERO_ADDRESS,
    });
    const aaveVtoken1ScaledBalance: BigNumber = aaveVtoken1ScaledBalanceResult
        ? (aaveVtoken1ScaledBalanceResult as BigNumber)
        : BigNumber.from(0);

    // Get base aave normalized variable debt
    const {
        data: baseNormalizedVariableDebtResult,
        isError: isBaseNormalizedVariableDebtError,
        isLoading: isBaseNormalizedVariableDebtLoading,
    } = useContractRead({
        address: state.aavePool,
        abi: ILendingPoolABI,
        functionName: "getReserveNormalizedVariableDebt",
        args: [state.baseAssetAddress],
        watch: true,
        enabled: isConnected && state.aavePool !== ZERO_ADDRESS,
    });
    const baseNormalizedVariableDebt: BigNumber =
        baseNormalizedVariableDebtResult
            ? (baseNormalizedVariableDebtResult as BigNumber)
            : BigNumber.from(0);

    // Get quote aave normalized variable debt
    const {
        data: quoteNormalizedVariableDebtResult,
        isError: isQuoteNormalizedVariableDebtError,
        isLoading: isQuoteNormalizedVariableDebtLoading,
    } = useContractRead({
        address: state.aavePool,
        abi: ILendingPoolABI,
        functionName: "getReserveNormalizedVariableDebt",
        args: [state.quoteAssetAddress],
        watch: true,
        enabled: isConnected && state.aavePool !== ZERO_ADDRESS,
    });
    const quoteNormalizedVariableDebt: BigNumber =
        quoteNormalizedVariableDebtResult
            ? (quoteNormalizedVariableDebtResult as BigNumber)
            : BigNumber.from(0);

    const x1 = new Decimal(baseNormalizedVariableDebt.toString());
    const y1 = new Decimal(quoteNormalizedVariableDebt.toString());
    const k1 = new Decimal(aaveVtoken0ScaledBalance.toString());
    const j1 = new Decimal(aaveVtoken1ScaledBalance.toString());

    const a = k1.mul(x1).div(1e27).div(1e18);
    const b = j1.mul(y1).div(1e27).div(1e18);

    const vWmaticTokenBalance = a;
    const vWethTokenBalance = b;

    // Get user shares amount
    const {
        data: userSharesAmountResult,
        isError: isUserSharesError,
        isLoading: isUserSharesLoading,
    } = useContractRead({
        address: state.address,
        abi: IChamberV1ABI,
        functionName: "get_s_userShares",
        args: [address],
        watch: true,
        enabled: isConnected,
    });
    const userSharesAmount: BigNumber = userSharesAmountResult
        ? (userSharesAmountResult as BigNumber)
        : BigNumber.from(0);
    const userSharesAmountScaled = new Decimal(userSharesAmount.toString()).div(
        1e6
    );

    // Get user shares amount in USD
    const userSharesAmountUsdScaledResult = userSharesAmountScaled
        .mul(currentUsdAmountScaled)
        .div(totalSharesAmountScaled);
    const userSharesAmountUsdScaled = userSharesAmountUsdScaledResult.isNaN()
        ? new Decimal(0)
        : userSharesAmountUsdScaledResult;

    const userSharesAmountUSD = BigNumber.from(
        userSharesAmountUsdScaled.mul(1e6).toFixed(0)
    );

    // Prepare burn(withdraw) call
    const burnAmount = currentUsdAmount.isZero()
        ? BigNumber.from("0")
        : BigNumber.from(denormalizedInputAmount)
              .mul(1e6)
              .div(currentUsdAmount)
              .mul(totalSharesAmount)
              .div(1e6);

    // TODO: Improve withdraw availability checker
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
        abi: IChamberV1ABI,
        functionName: "burn",
        args: [burnAmount],
        enabled: isConnected,
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
    }, [depositConfig]);
    const handleOnClickApprove = useCallback(() => {
        writeApprove?.();
    }, [approveConfig]);
    const handleOnClickWithdraw = useCallback(() => {
        writeWithdraw?.();
    }, [withdrawConfig]);
    const handleOnClickMax = useCallback(() => {
        setInputAmount(balanceData?.formatted ?? "0.0");
    }, [balanceData]);

    const normalizedInputAmount: Decimal = new Decimal(
        denormalizedInputAmount.toString()
    ).div(1e6);

    const normalizedTotalSharesAmount: Decimal = new Decimal(
        totalSharesAmount.toString()
    ).div(1e6);

    const normalizedCurrentUsdAmount: Decimal = new Decimal(
        currentUsdAmount.toString()
    ).div(1e6);

    const calcUserSharesAmount: Decimal = totalSharesAmount.isZero()
        ? normalizedInputAmount
        : normalizedInputAmount
              .div(normalizedCurrentUsdAmount)
              .mul(normalizedTotalSharesAmount);

    const calcShareOfPool: Decimal = totalSharesAmount.isZero()
        ? new Decimal(1.0)
        : calcUserSharesAmount.div(normalizedTotalSharesAmount);

    const calcAssetsInPool: Decimal[] = [
        new Decimal(currentPoolReserves[0].toString())
            .div(new Decimal(1e18))
            .mul(calcShareOfPool),
        new Decimal(currentPoolReserves[1].toString())
            .div(new Decimal(1e18))
            .mul(calcShareOfPool),
    ];

    const calcAssetsBorrowed: Decimal[] = [
        vWmaticTokenBalance.mul(calcShareOfPool),
        vWethTokenBalance.mul(calcShareOfPool),
    ];

    const calcNetExp: Decimal[] = [
        calcAssetsInPool[0].sub(calcAssetsBorrowed[0]),
        calcAssetsInPool[1].sub(calcAssetsBorrowed[1]),
    ];

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

    const tvl = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(normalizedCurrentUsdAmount.toNumber());

    const balance = balanceData?.formatted ?? "0.0";

    const cardInfo: CardInfo = {
        assetsInPool: [
            calcAssetsInPool[0].toFixed(6),
            calcAssetsInPool[1].toFixed(6),
        ],
        assetsBorrowed: [
            calcAssetsBorrowed[0].toFixed(6),
            calcAssetsBorrowed[1].toFixed(6),
        ],
        assetsSupplied: normalizedInputAmount.toString(),
        netExp: `${
            calcNetExp[0].toDecimalPlaces(6).isZero()
                ? "Neutral"
                : calcNetExp[0].toDecimalPlaces(6).isPositive()
                ? "Long " + calcNetExp[0].toFixed(6)
                : "Short " + calcNetExp[0].toFixed(6)
        } ${state.baseAssetName}, ${
            calcNetExp[1].toDecimalPlaces(6).isZero()
                ? "Neutral"
                : calcNetExp[1].toDecimalPlaces(6).isPositive()
                ? "Long " + calcNetExp[1].toFixed(6)
                : "Short " + calcNetExp[1].toFixed(6)
        } ${state.quoteAssetName}`,
        shareOfPool: calcShareOfPool.mul(100).greaterThanOrEqualTo(100)
            ? ">=100"
            : calcShareOfPool.mul(100).toFixed(3),
        netApy: apy,
    };

    const isExceedsDepositLimit =
        normalizedInputAmount.toNumber() > USDC_DEPOSIT_LIMIT ||
        normalizedInputAmount.toNumber() +
            userSharesAmountUsdScaled.toNumber() >
            USDC_DEPOSIT_LIMIT;

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
                                Projected APY: {projectedApy}
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
                            borderColor={
                                isExceedsDepositLimit ? "#F56565" : "#E8ECFD"
                            }
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
                                    setInputAmount(value);
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
                        isDisabled={
                            !isConnected ||
                            balance === "0.0" ||
                            isExceedsDepositLimit
                        }
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
                    pl="20px"
                    pr="20px"
                    pt="30px"
                    pb="30px"
                    gap="6px"
                    border="1px solid"
                    borderColor="#E8ECFD"
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
                            Assets in pool
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
                                    {cardInfo.assetsInPool[0]}{" "}
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
                                    {cardInfo.assetsInPool[1]}{" "}
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
                            Assets Supplied
                        </Text>
                        <Stack
                            direction="row"
                            spacing="5px"
                            alignItems="center"
                        >
                            <Image
                                src={state.depositAssetIcon}
                                w="15px"
                                h="15px"
                            />
                            <Text
                                color="#1F2040"
                                fontFamily="Chakra Petch"
                                fontSize="18px"
                                fontWeight="medium"
                            >
                                {cardInfo.assetsSupplied}{" "}
                                {state.depositAssetName}
                            </Text>
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
                            {cardInfo.netExp}
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
                            Share of Pool ({state.quoteFarmName})
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
                    <Stack
                        direction="row"
                        pb="3px"
                        justifyContent="space-between"
                    >
                        <Text
                            color="#1F2040"
                            fontFamily="Chakra Petch"
                            fontSize="18px"
                            fontWeight="medium"
                        >
                            APY since inception:
                        </Text>
                        <Text
                            color="#63637A"
                            fontFamily="Chakra Petch"
                            fontSize="18px"
                            fontWeight="medium"
                        >
                            {cardInfo.netApy}
                        </Text>
                    </Stack>
                </SimpleGrid>
            </SimpleGrid>
        </>
    );
};

export { Farm, type FarmProps };
