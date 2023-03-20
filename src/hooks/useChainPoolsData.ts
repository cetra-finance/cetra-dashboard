import { useNetwork } from "wagmi";
import { usePoolsStats, PoolStats } from "./usePoolsStats";
import { Pool, POLYGON_POOLS, OPTIMISM_POOLS, ARBITRUM_POOLS } from "../pools";
import {
    DEFAULT_CHAINS,
    POLYGON_APYs,
    OPTIMISM_APYs,
    ARBITRUM_APYs,
} from "../utils";

interface ChainPoolsData {
    pools: Pool[];
    stats: PoolStats[];
    apys: string[];
}

function useChainPoolsData(): ChainPoolsData {
    const { chain } = useNetwork();
    const poolsStatsData = usePoolsStats();

    // 1. Check chain connection
    // 2. If there are no connection, then return polygon data
    // 3. If there are connection, then check if network is supported, otherwise return polygon data

    // TODO: Move default params
    let pools = POLYGON_POOLS;
    let apys = POLYGON_APYs;
    let stats = poolsStatsData ? poolsStatsData.polygon : [];

    if (chain) {
        for (const supportedChain of DEFAULT_CHAINS) {
            if (chain.id === supportedChain.id) {
                // TODO: Support more networks
                if (supportedChain.network.includes("arbitrum")) {
                    pools = ARBITRUM_POOLS;
                    apys = ARBITRUM_APYs;
                    stats = poolsStatsData ? poolsStatsData.arbitrum : [];
                } else if (supportedChain.network.includes("matic")) {
                    pools = POLYGON_POOLS;
                    apys = POLYGON_APYs;
                    stats = poolsStatsData ? poolsStatsData.polygon : [];
                } else if (supportedChain.network.includes("optimism")) {
                    pools = OPTIMISM_POOLS;
                    apys = OPTIMISM_APYs;
                    stats = poolsStatsData ? poolsStatsData.optimism : [];
                }

                break;
            }
        }
    }

    return {
        pools,
        apys,
        stats,
    };
}

export { useChainPoolsData };
