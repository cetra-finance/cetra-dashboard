import { FC } from "react";
import { Box } from "@chakra-ui/react";
import { FarmList, FarmListItem } from "../../components";
import AaveIcon from "../../assets/icons/aave.svg";
import UniIcon from "../../assets/icons/uni.svg";
import EthIcon from "../../assets/icons/eth.svg";
import UsdcIcon from "../../assets/icons/usdc.svg";

const ChambersFarm: FC = () => {
    return (
        <Box w="full" minH="90%">
            <FarmList>
                <FarmListItem
                    poolName="ETH-USDC"
                    baseAssetIcon={EthIcon}
                    quoteAssetIcon={UsdcIcon}
                    baseFarmIcon={AaveIcon}
                    baseFarmName="AAVE"
                    quoteFarmIcon={UniIcon}
                    quoteFarmName="UniV3"
                    apy="36.22%"
                    tvl="$8.05M"
                    totalApr="31.17%"
                    dailyApr="0.07%"
                    strategy="Delta Neutral"
                />
            </FarmList>
        </Box>
    );
};

export { ChambersFarm };
