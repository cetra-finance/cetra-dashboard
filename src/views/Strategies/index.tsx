import { FC } from "react";
import { Box, Stack, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContractReads } from "wagmi";
import { BigNumber } from "ethers";
import IChamberV1ABI from "../../assets/abis/IChamberV1.json";
import { CetraList, CetraListItem } from "../../components";
import HandEmojiImg from "../../assets/hand-emoji.png";
import Decimal from "decimal.js";
import { useChainPoolsData } from "../../hooks";
import { USDC_DEPOSIT_LIMIT } from "../../utils";

const Strategies: FC = () => {
    const navigate = useNavigate();
    const chainPoolsData = useChainPoolsData();

    const POOLS = chainPoolsData.pools;
    const APYs = chainPoolsData.apys;
    const poolsStats = chainPoolsData.stats;

    // Get current USD amount for all pools
    const {
        data: currentUsdAmountResults,
        isError: isCurrentUsdError,
        isSuccess: isCurrentUsdSuccess,
        isLoading: isCurrentUsdLoading,
    } = useContractReads({
        contracts: POOLS.map((pool) => {
            return {
                address: pool.address,
                abi: IChamberV1ABI,
                functionName: "currentUSDBalance",
            };
        }),
        watch: true,
    });
    let currentUsdAmounts: Decimal[];
    if (isCurrentUsdSuccess && currentUsdAmountResults !== undefined) {
        currentUsdAmounts = POOLS.map((pool, index) => {
            const value = currentUsdAmountResults[index] as
                | BigNumber
                | undefined;

            return value
                ? new Decimal(value.toString()).div(1e6)
                : new Decimal(0);
        });
    } else {
        currentUsdAmounts = POOLS.map(() => new Decimal(0));
    }
    console.log(`currentUsdAmounts: ${currentUsdAmounts}`);

    return (
        <Box w="full" minH="90%">
            <Stack direction="column" gap={6}>
                <Box border="2px" borderColor="#E8ECFD" pt="2" pb="2">
                    <Stack direction="row" spacing={3.5} align="center">
                        <Image src={HandEmojiImg} w={10} h={10} />
                        <Text
                            color="#1F2040"
                            fontSize="22px"
                            fontWeight="bold"
                            fontFamily="Chakra Petch"
                        >
                            Cetra live on Optimism & Polygon Mainnet! Try real
                            yield on your stablecoins now
                        </Text>
                    </Stack>
                </Box>
                <CetraList>
                    {POOLS.map((pool, index) => {
                        const maybePoolStats = poolsStats.find(
                            (stats) =>
                                stats.address.toLowerCase() ===
                                pool.address.toLowerCase()
                        );

                        let projectedApy = APYs[index];
                        let apy = "0%";
                        if (maybePoolStats !== undefined) {
                            if (maybePoolStats.baseApy === "calculating..") {
                                apy = "calculating..";
                            } else {
                                apy = `${new Decimal(
                                    maybePoolStats.baseApy
                                ).toFixed(3)}%`;
                            }
                        }

                        let weeklyApr = "0%";
                        if (maybePoolStats !== undefined) {
                            if (
                                maybePoolStats.weeklyBasedApr ===
                                "calculating.."
                            ) {
                                weeklyApr = "calculating..";
                            } else {
                                weeklyApr = `${new Decimal(
                                    maybePoolStats.weeklyBasedApr
                                ).toFixed(3)}%`;
                            }
                        }

                        let dailyApr = "0%";
                        if (maybePoolStats !== undefined) {
                            if (
                                maybePoolStats.dailyBasedApr === "calculating.."
                            ) {
                                dailyApr = "calculating..";
                            } else {
                                dailyApr = `${new Decimal(
                                    maybePoolStats.dailyBasedApr
                                ).toFixed(3)}%`;
                            }
                        }

                        return (
                            <CetraListItem
                                key={pool.address}
                                poolName={pool.name}
                                baseAssetIcon={pool.baseAssetIcon}
                                quoteAssetIcon={pool.quoteAssetIcon}
                                baseFarmIcon={pool.baseFarmIcon}
                                baseFarmName={pool.baseFarmName}
                                quoteFarmIcon={pool.quoteFarmIcon}
                                quoteFarmName={pool.quoteFarmName}
                                apy={`${projectedApy}`}
                                tvl={`${new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(
                                    currentUsdAmounts[index].toNumber()
                                )} / ${new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(USDC_DEPOSIT_LIMIT)}`}
                                totalApr={`Weekly APR: ${weeklyApr}`}
                                dailyApr={`Daily APR: ${dailyApr}`}
                                strategy={pool.strategy}
                                actionText="Deposit"
                                divider={index < POOLS.length - 1}
                                onAction={() =>
                                    navigate("/farm", {
                                        state: {
                                            state: pool,
                                            apy,
                                            projectedApy,
                                        },
                                    })
                                }
                            />
                        );
                    })}
                </CetraList>
            </Stack>
        </Box>
    );
};

export { Strategies };
