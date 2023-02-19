import { FC } from "react";
import { Box } from "@chakra-ui/react";
import { useAccount, useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { useNavigate } from "react-router-dom";
import { CetraList, CetraListItem } from "../../components";
import ChamberV1ABI from "../../assets/abis/ChamberV1.json";
import { Pool, POOLS } from "../../pools";

interface UserPosition {
    pool: Pool;
    usd: number;
}

const Portfolio: FC = () => {
    const navigate = useNavigate();

    const { address, isConnected } = useAccount();

    // TODO: Fetch all pools
    const pool = POOLS[0];

    // Get user shares amount
    const {
        data: userSharesAmountResult,
        isError: isUserSharesError,
        isLoading: isUserSharesLoading,
    } = useContractRead({
        address: pool.address,
        abi: ChamberV1ABI,
        functionName: "s_userShares",
        args: [address],
        watch: true,
        enabled: isConnected,
    });
    const userSharesAmount: BigNumber = userSharesAmountResult
        ? (userSharesAmountResult as BigNumber)
        : BigNumber.from(0);

    // Get user shares amount in USD
    const {
        data: userSharesAmountUsdResult,
        isError: isUserSharesUsdError,
        isLoading: isUserSharesUsdLoading,
    } = useContractRead({
        address: pool.address,
        abi: ChamberV1ABI,
        functionName: "sharesWorth",
        args: [userSharesAmount],
        watch: true,
        enabled: isConnected && !userSharesAmount.isZero(),
    });
    const userSharesAmountUsd: BigNumber = userSharesAmountUsdResult
        ? (userSharesAmountUsdResult as BigNumber)
        : BigNumber.from(0);

    const userPositions: UserPosition[] = [
        {
            pool,
            usd: userSharesAmountUsd.toNumber() / 1e6,
        },
    ].filter((p) => p.usd > 0);

    return (
        <Box w="full" minH="90%">
            <CetraList
                tabs={["Pool", "APY", "Total Position", "Farmed", "Strategy"]}
            >
                {userPositions.map(({ pool, usd }) => (
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
                        tvl={`$${usd}`}
                        totalApr="$--"
                        dailyApr="--$ Since Yesterday"
                        strategy={pool.strategy}
                        actionText="Manage"
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
