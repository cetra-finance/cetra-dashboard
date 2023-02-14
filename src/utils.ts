import { Address } from "wagmi";

export function getTruncatedAddress(
    address: Address,
    symbols: number = 4
): string {
    return `${address!.slice(0, symbols + 2)}...${address!.slice(
        address!.length - symbols,
        address!.length
    )}`;
}
