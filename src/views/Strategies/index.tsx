import { FC } from "react";
import { Box, Stack, Image, Text, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContractReads } from "wagmi";
import { BigNumber } from "ethers";
import ChamberV1ABI from "../../assets/abis/ChamberV1.json";
import { POOLS } from "../../pools";
import { CetraList, CetraListItem } from "../../components";
import CetraBetaLogo from "../../assets/cetra-beta.svg";
import Decimal from "decimal.js";
import { usePoolsStats } from "../../hooks";

const Strategies: FC = () => {
    const navigate = useNavigate();
    const poolsStats = usePoolsStats();

    // Get current usd amount for all pools
    const {
        data: currentUsdAmountResults,
        isError: isCurrentUsdError,
        isLoading: isCurrentUsdLoading,
    } = useContractReads({
        contracts: POOLS.map((pool) => {
            return {
                address: pool.address,
                abi: ChamberV1ABI,
                functionName: "currentUSDBalance",
            };
        }),
        watch: true,
    });
    const currentUsdAmounts: Decimal[] = currentUsdAmountResults
        ? currentUsdAmountResults.map((value) => {
              return value
                  ? new Decimal((value as BigNumber).toString()).div(1e6)
                  : new Decimal(0.0);
          })
        : POOLS.map(() => new Decimal(0.0));

    return (
        <Box w="full" minH="90%">
            <Stack direction="column" gap={6}>
                <Box
                    border="1px"
                    borderColor="#1F2040"
                    borderRadius="5px"
                    pt="2"
                    pb="2"
                    pl="3.5"
                    pr="3.5"
                >
                    <Stack direction="row" spacing={3.5} align="center">
                        <Image src={CetraBetaLogo} w="8" h="8" />
                        <Text
                            color="#1F2040"
                            fontSize="22px"
                            fontWeight="bold"
                            fontFamily="Chakra Petch"
                        >
                            Cetra is in beta mode on mainnet, read the
                            announcement{" "}
                            <Link textDecoration="underline">here</Link>
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

                        const apy = maybePoolStats
                            ? new Decimal(maybePoolStats.baseApy).toFixed(3)
                            : "0";
                        const weeklyApr = maybePoolStats
                            ? maybePoolStats.weeklyBasedApr === "calculating.."
                                ? maybePoolStats.weeklyBasedApr
                                : new Decimal(
                                      maybePoolStats.weeklyBasedApr
                                  ).toFixed(3)
                            : "0";
                        const dailyApr = maybePoolStats
                            ? new Decimal(maybePoolStats.dailyBasedApr).toFixed(
                                  3
                              )
                            : "0";

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
                                apy={`${apy}%`}
                                tvl={new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(currentUsdAmounts[index].toNumber())}
                                totalApr={`Total APR: ${weeklyApr}%`}
                                dailyApr={`Daily APR: ${dailyApr}%`}
                                strategy={pool.strategy}
                                actionText="Deposit"
                                divider={index < POOLS.length - 1}
                                onAction={() =>
                                    navigate("/farm", {
                                        state: { state: pool, apy },
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
