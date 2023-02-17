import { FC } from "react";
import { Box } from "@chakra-ui/react";
import { CetraList, CetraListItem } from "../../components";
import { useNavigate } from "react-router-dom";
import { POOLS } from "../../pools";

const ChambersFarm: FC = () => {
    const navigate = useNavigate();

    // TODO: Calculate TVL
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
                        tvl="$8.05M"
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

export { ChambersFarm };
