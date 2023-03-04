import { Chain, localhost, polygon } from "wagmi/chains";
import { Address } from "wagmi";
import { BigNumber } from "ethers";

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

export const USDC_DEPOSIT_LIMIT = 10000;

// TODO: Estimated version
export const APYs = ["10.74%", "8.54%"];

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
