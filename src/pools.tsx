import { Address } from "wagmi";
import { USDC_ADDRESS } from "./utils";
import AaveIcon from "./assets/icons/aave.svg";
import UniIcon from "./assets/icons/uni.svg";
import MaticIcon from "./assets/icons/matic.svg";
import UsdcIcon from "./assets/icons/usdc.svg";
import EthIcon from "./assets/icons/eth.svg";
import LinkIcon from "./assets/icons/link.svg";

export interface Pool {
    name: string;
    baseAssetIcon: string;
    baseAssetName: string;
    baseAssetAddress: Address;
    quoteAssetIcon: string;
    quoteAssetName: string;
    quoteAssetAddress: Address;
    baseFarmIcon: string;
    baseFarmName: string;
    quoteFarmIcon: string;
    quoteFarmName: string;
    depositAssetIcon: string;
    depositAssetName: string;
    depositAssetAddress: Address;
    strategy: string;
    address: Address;
    aavePool: Address;
}

export const POOLS: Pool[] = [
    {
        name: "MATIC-LINK",
        baseAssetIcon: MaticIcon,
        baseAssetName: "MATIC",
        baseAssetAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        quoteAssetIcon: LinkIcon,
        quoteAssetName: "LINK",
        quoteAssetAddress: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
        baseFarmIcon: AaveIcon,
        baseFarmName: "AAVE",
        quoteFarmIcon: UniIcon,
        quoteFarmName: "UniV3",
        depositAssetIcon: UsdcIcon,
        depositAssetName: "USDC",
        depositAssetAddress: USDC_ADDRESS,
        strategy: "Delta-Neutral",
        address: "0x8E756cAad37136Df14Eb42Dc4BCb211D4aFC3E5B",
        aavePool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    },
    /* {
        name: "MATIC-CRV",
        baseAssetIcon: MaticIcon,
        baseAssetName: "MATIC",
        quoteAssetIcon: CrvIcon,
        quoteAssetName: "CRV",
        baseFarmIcon: AaveIcon,
        baseFarmName: "AAVE",
        quoteFarmIcon: UniIcon,
        quoteFarmName: "UniV3",
        depositAssetIcon: UsdcIcon,
        depositAssetName: "USDC",
        strategy: "Delta-Neutral",
        address: "0x8d342020D9e452e129B4C40a7e1d754e1d1b124f",
        aavePool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    }, */
    {
        name: "LINK-ETH",
        baseAssetIcon: LinkIcon,
        baseAssetName: "LINK",
        baseAssetAddress: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
        quoteAssetIcon: EthIcon,
        quoteAssetName: "ETH",
        quoteAssetAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        baseFarmIcon: AaveIcon,
        baseFarmName: "AAVE",
        quoteFarmIcon: UniIcon,
        quoteFarmName: "UniV3",
        depositAssetIcon: UsdcIcon,
        depositAssetName: "USDC",
        depositAssetAddress: USDC_ADDRESS,
        strategy: "Delta-Neutral",
        address: "0xaBFe2C02c1dbE04672de1e330b17288116945a67",
        aavePool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    },
];
