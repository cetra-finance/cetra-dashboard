import { FC } from "react";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContractReads } from "wagmi";
import { BigNumber } from "ethers";
import ChamberV1ABI from "../../assets/abis/ChamberV1.json";
import { POOLS } from "../../pools";
import { CetraList, CetraListItem } from "../../components";
import Decimal from "decimal.js";

const Strategies: FC = () => {
    const navigate = useNavigate();

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
        ? (currentUsdAmountResults as BigNumber[]).map((value) =>
              new Decimal(value.toString()).div(1e6)
          )
        : POOLS.map(() => new Decimal(0.0));

    return (
        <Box w="full" minH="90%">
            <CetraList>
                {POOLS.map((pool, index) => (
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
                        }).format(currentUsdAmounts[index].toNumber())}
                        totalApr="Total APR: --%"
                        dailyApr="Daily APR: --%"
                        strategy={pool.strategy}
                        actionText="Deposit"
                        divider={index < POOLS.length - 1}
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
