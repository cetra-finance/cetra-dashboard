import { FC } from "react";
import { Box } from "@chakra-ui/react";
import { CetraList, CetraListItem } from "../../components";
import { useNavigate } from "react-router-dom";
import AaveIcon from "../../assets/icons/aave.svg";
import UniIcon from "../../assets/icons/uni.svg";
import EthIcon from "../../assets/icons/eth.svg";
import UsdcIcon from "../../assets/icons/usdc.svg";

const ChambersFarm: FC = () => {
    const navigate = useNavigate();

    return (
        <Box w="full" minH="90%">
            <CetraList>
                <CetraListItem
                    poolName="ETH-USDC"
                    baseAssetIcon={EthIcon}
                    quoteAssetIcon={UsdcIcon}
                    baseFarmIcon={AaveIcon}
                    baseFarmName="AAVE"
                    quoteFarmIcon={UniIcon}
                    quoteFarmName="UniV3"
                    apy="36.22%"
                    tvl="$8.05M"
                    totalApr="Total APR: 31.17%"
                    dailyApr="Daily APR: 0.07%"
                    strategy="Delta Neutral"
                    actionText="Deposit"
                    onAction={() => navigate("/deposit")}
                />
            </CetraList>
        </Box>
    );
};

export { ChambersFarm };
