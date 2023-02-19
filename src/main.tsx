import React from "react";
import ReactDOM from "react-dom/client";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { Chain, localhost, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { IS_PROD } from "./utils";

const cetraDevLocalhost: Chain = {
    ...localhost,
    id: 31337,
};

const defaultChains = IS_PROD ? [polygon] : [cetraDevLocalhost];

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
    publicProvider(),
]);

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
