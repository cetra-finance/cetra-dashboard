import { FC } from "react";
import { Box } from "@chakra-ui/react";
import { useAccount, useContractReads } from "wagmi";
import { BigNumber } from "ethers";
import { useNavigate } from "react-router-dom";
import { CetraList, CetraListItem } from "../../components";
import IChamberV1ABI from "../../assets/abis/IChamberV1.json";
import { Pool, POOLS } from "../../pools";
import Decimal from "decimal.js";
import { usePoolsStats } from "../../hooks";

interface UserPosition {
    pool: Pool;
    usd: Decimal;
    shares: Decimal;
}

const Portfolio: FC = () => {
    const navigate = useNavigate();
    const poolsStats = usePoolsStats();

    const { address, isConnected } = useAccount();

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
        enabled: isConnected,
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

    // Get current total shares amount for all pools
    const {
        data: totalSharesAmountsResults,
        isError: isTotalSharesError,
        isSuccess: isTotalSharesSuccess,
        isLoading: isTotalSharesLoading,
    } = useContractReads({
        contracts: POOLS.map((pool) => {
            return {
                address: pool.address,
                abi: IChamberV1ABI,
                functionName: "get_s_totalShares",
            };
        }),
        watch: true,
        enabled: isConnected,
    });
    let totalSharesAmounts: Decimal[];
    if (isTotalSharesSuccess && totalSharesAmountsResults !== undefined) {
        totalSharesAmounts = POOLS.map((pool, index) => {
            const value = totalSharesAmountsResults[index] as
                | BigNumber
                | undefined;

            return value
                ? new Decimal(value.toString()).div(1e6)
                : new Decimal(0);
        });
    } else {
        totalSharesAmounts = POOLS.map(() => new Decimal(0));
    }
    console.log(`totalSharesAmounts: ${totalSharesAmounts}`);

    // Get user shares amount from all pools
    const {
        data: userSharesAmountResults,
        isError: isUserSharesError,
        isSuccess: isUserSharesSuccess,
        isLoading: isUserSharesLoading,
    } = useContractReads({
        contracts: POOLS.map((pool) => {
            return {
                address: pool.address,
                abi: IChamberV1ABI,
                functionName: "get_s_userShares",
                args: [address],
            };
        }),
        watch: true,
        enabled: isConnected,
    });
    let userSharesAmounts: Decimal[];
    if (isUserSharesSuccess && userSharesAmountResults !== undefined) {
        userSharesAmounts = POOLS.map((pool, index) => {
            const value = userSharesAmountResults[index] as
                | BigNumber
                | undefined;

            return value
                ? new Decimal(value.toString()).div(1e6)
                : new Decimal(0);
        });
    } else {
        userSharesAmounts = POOLS.map(() => new Decimal(0));
    }
    console.log(`userSharesAmounts: ${userSharesAmounts}`);

    const userPositions: UserPosition[] = POOLS.map((pool, index) => {
        const usd = userSharesAmounts[index]
            .mul(currentUsdAmounts[index])
            .div(totalSharesAmounts[index]);

        return {
            pool,
            usd: usd.isNaN() ? new Decimal(0) : usd,
            shares: userSharesAmounts[index],
        };
    }).filter((p) => !p.usd.isZero());

    return (
        <Box w="full" minH="90%">
            <CetraList
                tabs={["Pool", "APY", "Total Position", "Farmed", "Strategy"]}
            >
                {userPositions.map(({ pool, usd, shares }, index) => {
                    const maybePoolStats = poolsStats.find(
                        (stats) =>
                            stats.address.toLowerCase() ===
                            pool.address.toLowerCase()
                    );

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

                    let earnMultiplier = new Decimal(0);
                    if (maybePoolStats !== undefined) {
                        earnMultiplier = new Decimal(
                            maybePoolStats.earnMultiplier
                        );
                    }

                    const farmedSinceYesterday = earnMultiplier
                        .mul(shares)
                        .toFixed(6);

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
                            apy={`${apy}`}
                            tvl={`$${usd.toFixed(6)}`}
                            totalApr="$--"
                            dailyApr={`${farmedSinceYesterday}$ Since Yesterday`}
                            strategy={pool.strategy}
                            actionText="Manage"
                            divider={index < userPositions.length - 1}
                            onAction={() =>
                                navigate("/farm", {
                                    state: { state: pool, apy },
                                })
                            }
                        />
                    );
                })}
            </CetraList>
        </Box>
    );
};

export { Portfolio };
