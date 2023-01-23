import { FC } from "react";
import { Box } from "@chakra-ui/react";
import { CetraList, CetraListItem } from "../../components";
import AaveIcon from "../../assets/icons/aave.svg";
import UniIcon from "../../assets/icons/uni.svg";
import EthIcon from "../../assets/icons/eth.svg";
import UsdcIcon from "../../assets/icons/usdc.svg";

const Portfolio: FC = () => {
    return (
        <Box w="full" minH="90%">
            <CetraList
                tabs={["Pool", "APY", "Total Position", "Farmed", "Strategy"]}
            >
                <CetraListItem
                    poolName="ETH-USDC"
                    baseAssetIcon={EthIcon}
                    quoteAssetIcon={UsdcIcon}
                    baseFarmIcon={AaveIcon}
                    baseFarmName="AAVE"
                    quoteFarmIcon={UniIcon}
                    quoteFarmName="UniV3"
                    apy="36.22%"
                    tvl="$12,412"
                    totalApr="$145.21"
                    dailyApr="12$ Since Yesterday"
                    strategy="Delta Neutral"
                    actionText="Withdraw"
                />
            </CetraList>
        </Box>
    );
};

export { Portfolio };
