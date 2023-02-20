import { FC } from "react";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContractRead, useAccount } from "wagmi";
import { BigNumber } from "ethers";
import ChamberV1ABI from "../../assets/abis/ChamberV1.json";
import { POOLS } from "../../pools";
import { CetraList, CetraListItem } from "../../components";

const Strategies: FC = () => {
    const navigate = useNavigate();

    const { address, isConnected } = useAccount();

    // TODO: Fetch all pools
    const pool = POOLS[0];

    // Get current usd amount
    const {
        data: currentUsdAmountResult,
        isError: isCurrentUsdError,
        isLoading: isCurrentUsdLoading,
    } = useContractRead({
        address: pool.address,
        abi: ChamberV1ABI,
        functionName: "currentUSDBalance",
        watch: true,
        enabled: isConnected,
    });
    const currentUsdAmount: BigNumber = currentUsdAmountResult
        ? (currentUsdAmountResult as BigNumber)
        : BigNumber.from(0);

    return (
        <Box w="full" minH="90%">
            <CetraList>
                {POOLS.map((pool) => (
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
                        tvl={new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                        }).format(currentUsdAmount.toNumber() / 1e6)}
                        totalApr="Total APR: --%"
                        dailyApr="Daily APR: --%"
                        strategy={pool.strategy}
                        actionText="Deposit"
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

export { Strategies };
