import { useNetwork } from "wagmi";
import { usePoolsStats, PoolStats } from "./usePoolsStats";
import { Pool, POLYGON_POOLS, OPTIMISM_POOLS } from "../pools";
import { DEFAULT_CHAINS, POLYGON_APYs, OPTIMISM_APYs } from "../utils";

interface ChainPoolsData {
    pools: Pool[];
    stats: PoolStats[];
    apys: string[];
}

function useChainPoolsData(): ChainPoolsData {
    const { chain } = useNetwork();
    const poolsStatsData = usePoolsStats();

    let isDefaultChain = true;
    if (chain) {
        if (DEFAULT_CHAINS.map((chain) => chain.id).includes(chain.id)) {
            isDefaultChain = DEFAULT_CHAINS[0].id === chain.id;
        }
    }

    // TODO: Possible error if default network changed
    const stats: PoolStats[] = poolsStatsData
        ? isDefaultChain
            ? poolsStatsData.polygon
            : poolsStatsData.optimism
        : [];

    // TODO: Possible error if default network changed
    const pools = isDefaultChain ? POLYGON_POOLS : OPTIMISM_POOLS;
    const apys = isDefaultChain ? POLYGON_APYs : OPTIMISM_APYs;

    return {
        pools,
        apys,
        stats,
    };
}

export { useChainPoolsData };
