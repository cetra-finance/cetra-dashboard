import React from "react";
import ReactDOM from "react-dom/client";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { Chain, localhost } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// TODO: Remove chain from prod
const cetraLocalhost: Chain = {
    ...localhost,
    id: 31337,
};

// TODO: Change to actual chains
const { chains, provider, webSocketProvider } = configureChains(
    [cetraLocalhost],
    [publicProvider()]
);

const client = createClient({
    autoConnect: true,
    connectors: [new MetaMaskConnector({ chains })],
    provider,
    webSocketProvider,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <WagmiConfig client={client}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </WagmiConfig>
    </React.StrictMode>
);
