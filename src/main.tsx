import React from "react";
import ReactDOM from "react-dom/client";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ReactGA from "react-ga4";
import { DEFAULT_CHAINS } from "./utils";

const { chains, provider, webSocketProvider } = configureChains(
    DEFAULT_CHAINS,
    [publicProvider()]
);

const client = createClient({
    autoConnect: true,
    connectors: [new MetaMaskConnector({ chains })],
    provider,
    webSocketProvider,
});

ReactGA.initialize("G-S8ZDSJKWEY");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <WagmiConfig client={client}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </WagmiConfig>
    </React.StrictMode>
);
