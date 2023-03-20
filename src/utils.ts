import { Chain, localhost, polygon, optimism, arbitrum } from "wagmi/chains";
import { Address } from "wagmi";
import { BigNumber } from "ethers";

export const IS_PROD: boolean = import.meta.env.VITE_PROD === "true";

export const API_GATEWAY_URL: string = "https://api-gateway-six.vercel.app/api";

export const cetraArbitrumFork: Chain = {
    ...localhost,
    name: arbitrum.name,
    network: "cetra-arbitrum-fork",
    rpcUrls: {
        default: {
            http: ["http://127.0.0.1:8547/"],
        },
        public: {
            http: ["http://127.0.0.1:8547/"],
        },
    },
    id: 31339,
};

export const cetraOptimismFork: Chain = {
    ...localhost,
    name: optimism.name,
    network: "cetra-optimism-fork",
    rpcUrls: {
        default: {
            http: ["http://127.0.0.1:8546/"],
        },
        public: {
            http: ["http://127.0.0.1:8546/"],
        },
    },
    id: 31338,
};

export const cetraPolygonFork: Chain = {
    ...localhost,
    name: polygon.name,
    network: "cetra-matic-fork",
    rpcUrls: {
        default: {
            http: ["http://127.0.0.1:8545/"],
        },
        public: {
            http: ["http://127.0.0.1:8545/"],
        },
    },
    id: 31337,
};

export const DEFAULT_CHAINS =
    IS_PROD === true
        ? [polygon, optimism, arbitrum]
        : [cetraPolygonFork, cetraOptimismFork, cetraArbitrumFork];

export const OPTIMISM_USDC_ADDRESS: Address =
    "0x7f5c764cbc14f9669b88837ca1490cca17c31607";

export const POLYGON_USDC_ADDRESS: Address =
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

export const ARBITRUM_USDC_ADDRESS: Address =
    "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";

export const ZERO_ADDRESS: Address =
    "0x0000000000000000000000000000000000000000";

export const USDC_DEPOSIT_LIMIT = 10000;

// TODO: Optimism estimated APYs.
export const OPTIMISM_APYs = ["14.01%"];

// TODO: Polygon estimated APYs.
export const POLYGON_APYs = ["5.4%", "6.1%"];

// TODO: Arbitrum estimated APYs.
export const ARBITRUM_APYs = ["9.92%"];

export function denormalizeAmount(
    amount: string,
    scale: number = 6
): BigNumber {
    const x = Math.floor(parseFloat(amount) * Math.pow(10, scale));
    return BigNumber.from(x);
}

export function getTruncatedAddress(
    address: Address,
    symbols: number = 4
): string {
    return `${address!.slice(0, symbols + 2)}...${address!.slice(
        address!.length - symbols,
        address!.length
    )}`;
}
