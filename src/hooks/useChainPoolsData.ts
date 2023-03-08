import { useNetwork } from "wagmi";
import { usePoolsStats, PoolStats } from "./usePoolsStats";
import { Pool, POLYGON_POOLS, OPTIMISM_POOLS } from "../pools";
import { DEFAULT_CHAINS, POLYGON_APYs, OPTIMISM_APYs } from "../utils";

interface ChainPoolsData {
    pools: Pool[];
    stats: PoolStats[];
    apys: string[];
}

// TODO: Possible error if default network changed
function useChainPoolsData(): ChainPoolsData {
    const { chain } = useNetwork();
    const poolsStatsData = usePoolsStats();

    const isDefaultChain = chain
        ? DEFAULT_CHAINS.length === 1
            ? true
            : chain.id === DEFAULT_CHAINS[0].id
        : true;

    // TODO: Possible error if default network changed
    const stats: PoolStats[] = poolsStatsData
        ? isDefaultChain
            ? poolsStatsData.polygon
            : poolsStatsData.optimism
        : [];

    const pools = isDefaultChain ? POLYGON_POOLS : OPTIMISM_POOLS;
    const apys = isDefaultChain ? POLYGON_APYs : OPTIMISM_APYs;

    return {
        pools,
        apys,
        stats,
    };
}

export { useChainPoolsData };
