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

function usePoolsStats(): PoolStats[] {
    const [stats, setStats] = useState<PoolStats[]>([]);

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

export { usePoolsStats, type PoolStats };
