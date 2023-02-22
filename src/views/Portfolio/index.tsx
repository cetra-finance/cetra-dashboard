import { FC } from "react";
import { Box } from "@chakra-ui/react";
import { useAccount, useContractReads } from "wagmi";
import { BigNumber } from "ethers";
import { useNavigate } from "react-router-dom";
import { CetraList, CetraListItem } from "../../components";
import ChamberV1ABI from "../../assets/abis/ChamberV1.json";
import { Pool, POOLS } from "../../pools";
import Decimal from "decimal.js";

interface UserPosition {
    pool: Pool;
    usd: Decimal;
}

const Portfolio: FC = () => {
    const navigate = useNavigate();

    const { address, isConnected } = useAccount();

    // Get user shares amount from all pools
    const {
        data: userSharesAmountResults,
        isError: isUserSharesError,
        isLoading: isUserSharesLoading,
    } = useContractReads({
        contracts: POOLS.map((pool) => {
            return {
                address: pool.address,
                abi: ChamberV1ABI,
                functionName: "s_userShares",
                args: [address],
            };
        }),
        watch: true,
        enabled: isConnected,
    });
    const userSharesAmounts: BigNumber[] = userSharesAmountResults
        ? (userSharesAmountResults as BigNumber[])
        : POOLS.map(() => BigNumber.from(0));

    // Get user shares amount in USD for all pools
    const {
        data: userSharesAmountUsdResults,
        isError: isUserSharesUsdError,
        isLoading: isUserSharesUsdLoading,
    } = useContractReads({
        contracts: POOLS.map((pool, index) => {
            return {
                address: pool.address,
                abi: ChamberV1ABI,
                functionName: "sharesWorth",
                args: [userSharesAmounts[index]],
            };
        }),
        watch: true,
        enabled: isConnected,
    });
    const userSharesAmountUsds: BigNumber[] = userSharesAmountUsdResults
        ? (userSharesAmountUsdResults as BigNumber[])
        : POOLS.map(() => BigNumber.from(0));

    const userPositions: UserPosition[] = POOLS.map((pool, index) => {
        return {
            pool,
            usd: new Decimal(userSharesAmountUsds[index].toString()).div(1e6),
        };
    }).filter((p) => !p.usd.isZero());

    return (
        <Box w="full" minH="90%">
            <CetraList
                tabs={["Pool", "APY", "Total Position", "Farmed", "Strategy"]}
            >
                {userPositions.map(({ pool, usd }, index) => (
                    <CetraListItem
                        key={pool.address}
                        poolName={pool.name}
                        baseAssetIcon={pool.baseAssetIcon}
                        quoteAssetIcon={pool.quoteAssetIcon}
                        baseFarmIcon={pool.baseFarmIcon}
                        baseFarmName={pool.baseFarmName}
                        quoteFarmIcon={pool.quoteFarmIcon}
                        quoteFarmName={pool.quoteFarmName}
                        apy="--%"
                        tvl={`$${usd.toFixed(6)}`}
                        totalApr="$--"
                        dailyApr="--$ Since Yesterday"
                        strategy={pool.strategy}
                        actionText="Manage"
                        divider={index < userPositions.length - 1}
                        onAction={() =>
                            navigate("/farm", {
                                state: pool,
                            })
                        }
                    />
                ))}
            </CetraList>
        </Box>
    );
};

export { Portfolio };
