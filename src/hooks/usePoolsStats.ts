import { useEffect, useState } from "react";
import { Address } from "wagmi";
import { API_GATEWAY_URL } from "../utils";

const API_STATS_URL: string = `${API_GATEWAY_URL}/stats`;

interface PoolStats {
    address: Address;
    baseApy: string;
    avgApy: string;
    dailyBasedApr: string;
    weeklyBasedApr: string;
    earnMultiplier: string;
}

// TODO: Support more networks
interface Stats {
    polygon: PoolStats[];
    optimism: PoolStats[];
    arbitrum: PoolStats[];
}

function usePoolsStats(): Stats | null {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        let ignore = false;

        async function fetchData() {
            const resp = await fetch(API_STATS_URL, { mode: "cors" });
            const stats = await resp.json();

            if (!ignore) {
                setStats(stats);
            }
        }

        fetchData();

        return () => {
            ignore = true;
        };
    }, []);

    return stats;
}

export { usePoolsStats, type PoolStats, type Stats };
