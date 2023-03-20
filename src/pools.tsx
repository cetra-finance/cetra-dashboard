import { Address } from "wagmi";
import {
    POLYGON_USDC_ADDRESS,
    OPTIMISM_USDC_ADDRESS,
    ARBITRUM_USDC_ADDRESS,
    ZERO_ADDRESS,
} from "./utils";
import AaveIcon from "./assets/icons/aave.svg";
import SonneIcon from "./assets/icons/sonne.svg";
import UniIcon from "./assets/icons/uni.svg";
import MaticIcon from "./assets/icons/matic.svg";
import UsdcIcon from "./assets/icons/usdc.svg";
import EthIcon from "./assets/icons/eth.svg";
import LinkIcon from "./assets/icons/link.svg";
import SnxIcon from "./assets/icons/snx.svg";

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

export const POLYGON_POOLS: Pool[] = [
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
        depositAssetAddress: POLYGON_USDC_ADDRESS,
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
        depositAssetAddress: POLYGON_USDC_ADDRESS,
        strategy: "Delta-Neutral",
        address: "0xaBFe2C02c1dbE04672de1e330b17288116945a67",
        aavePool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    },
];

export const OPTIMISM_POOLS: Pool[] = [
    {
        name: "ETH-SNX",
        baseAssetIcon: EthIcon,
        baseAssetName: "ETH",
        baseAssetAddress: "0x4200000000000000000000000000000000000006",
        quoteAssetIcon: SnxIcon,
        quoteAssetName: "SNX",
        quoteAssetAddress: "0x8700daec35af8ff88c16bdf0418774cb3d7599b4",
        baseFarmIcon: SonneIcon,
        baseFarmName: "Sonne",
        quoteFarmIcon: UniIcon,
        quoteFarmName: "UniV3",
        depositAssetIcon: UsdcIcon,
        depositAssetName: "USDC",
        depositAssetAddress: OPTIMISM_USDC_ADDRESS,
        strategy: "Delta-Neutral",
        address: "0x4F46191bC4865813cbd2Ea583046BEa165b7Af8F",
        aavePool: ZERO_ADDRESS,
    },
];

export const ARBITRUM_POOLS: Pool[] = [
    {
        name: "ETH-USDC",
        baseAssetIcon: EthIcon,
        baseAssetName: "ETH",
        baseAssetAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        quoteAssetIcon: UsdcIcon,
        quoteAssetName: "USDC",
        quoteAssetAddress: ARBITRUM_USDC_ADDRESS,
        baseFarmIcon: AaveIcon,
        baseFarmName: "AAVE",
        quoteFarmIcon: UniIcon,
        quoteFarmName: "UniV3",
        depositAssetIcon: UsdcIcon,
        depositAssetName: "USDC",
        depositAssetAddress: ARBITRUM_USDC_ADDRESS,
        strategy: "Delta-Neutral",
        address: "0x93e3B2E1E3837622156FEcdC6e5472AF31fE10Bb",
        aavePool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    },
];
