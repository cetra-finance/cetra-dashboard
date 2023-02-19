import { Address } from "wagmi";
import { IS_PROD } from "./utils";
import AaveIcon from "./assets/icons/aave.svg";
import UniIcon from "./assets/icons/uni.svg";
import MaticIcon from "./assets/icons/matic.svg";
import UsdcIcon from "./assets/icons/usdc.svg";
import EthIcon from "./assets/icons/eth.svg";

export interface Pool {
    name: string;
    baseAssetIcon: string;
    baseAssetName: string;
    quoteAssetIcon: string;
    quoteAssetName: string;
    baseFarmIcon: string;
    baseFarmName: string;
    quoteFarmIcon: string;
    quoteFarmName: string;
    depositAssetIcon: string;
    depositAssetName: string;
    strategy: string;
    address: Address;
}

export const POOLS: Pool[] = [
    {
        name: "ETH-MATIC",
        baseAssetIcon: EthIcon,
        baseAssetName: "ETH",
        quoteAssetIcon: MaticIcon,
        quoteAssetName: "MATIC",
        baseFarmIcon: AaveIcon,
        baseFarmName: "AAVE",
        quoteFarmIcon: UniIcon,
        quoteFarmName: "UniV3",
        depositAssetIcon: UsdcIcon,
        depositAssetName: "USDC",
        strategy: "Delta-Neutral",
        address: IS_PROD
            ? "0x0AF6aDEa1a5ADA8D1AB05fE06B76aD71f7407a56"
            : "0xd4185915bd9533575207dcfdeb6fdef798b095d3",
    },
];
