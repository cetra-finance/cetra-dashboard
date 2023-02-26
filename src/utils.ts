import BN from "bn.js";
import { Chain, localhost, polygon } from "wagmi/chains";
import { Address } from "wagmi";

export const IS_PROD: boolean = import.meta.env.VITE_PROD === "true";

export const API_GATEWAY_URL: string = "https://api-gateway-six.vercel.app/api";

export const cetraDevLocalhost: Chain = {
    ...localhost,
    id: 31337,
};

export const DEFAULT_CHAINS =
    IS_PROD === true ? [polygon] : [cetraDevLocalhost];

export const USDC_ADDRESS: Address =
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

export function denormalizeAmount(amount: string, scale: number = 6): BN {
    const x = parseFloat(amount) * Math.pow(10, scale);
    return new BN(x);
}

export function normalizeAmount(amount: BN, scale: number = 6): string {
    const x = amount.toNumber();
    return (x / Math.pow(10, scale)).toString();
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
