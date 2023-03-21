import "@rainbow-me/rainbowkit/styles.css";
import "./polyfills";
import {
  ConnectButton,
  connectorsForWallets,
  getWalletConnectConnector,
  Wallet,
} from "@rainbow-me/rainbowkit";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, arbitrum, bsc } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

interface MyWalletOptions {
  chains: Chain[];
}

// Custom network chains
const harmonyChain = {
  id: 1666600000,
  name: "Harmony",
  network: "Harmony Mainnet",
  // TODO - add real icon
  iconUrl: "https://example.com/icon.svg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Harmony",
    symbol: "ONE",
  },
  rpcUrls: {
    public: {
      http: ["https://api.harmony.one"],
    },
    default: {
      http: ["https://api.harmony.one"],
    },
  },
  blockExplorers: {
    default: {
      name: "Harmony Block Explorer",
      url: "https://explorer.harmony.one/",
    },
  },
  testnet: false,
};

const avalancheChain = {
  id: 43_114,
  name: "Avalanche",
  network: "avalanche",
  // TODO - add real icon
  iconUrl: "https://example.com/icon.svg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
  },
  rpcUrls: {
    public: {
      http: ["https://api.avax.network/ext/bc/C/rpc"],
    },
    default: {
      http: ["https://api.avax.network/ext/bc/C/rpc"],
    },
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://snowtrace.io" },
    etherscan: { name: "SnowTrace", url: "https://snowtrace.io" },
  },
  testnet: false,
};

// Custom wallet
const metaOne = ({ chains }: MyWalletOptions): Wallet => ({
  id: "MetaOne",
  name: "MetaOne",
  iconUrl:
    "https://s3.ap-southeast-1.amazonaws.com/static.aag.ventures/metaone/metaone512x512.png",
  iconBackground: "#ffffff",
  iconAccent: "#ffffff",
  downloadUrls: {
    android:
      "https://play.google.com/store/apps/details?id=ventures.aag.metaone&pli=1",
    ios: "https://apps.apple.com/us/app/metaone-wallet/id1627212812",
    // TODO Add download QR url
    qrCode: "https://my-wallet/qr",
  },
  createConnector: () => {
    const connector = getWalletConnectConnector({ chains });

    return {
      connector,
      mobile: {
        getUri: async () => {
          const { uri } = (await connector.getProvider()).connector;
          return uri;
        },
      },
      qrCode: {
        getUri: async () => (await connector.getProvider()).connector.uri,
        instructions: {
          // TODO Add url
          learnMoreUrl: "https://my-wallet/learn-more",
          steps: [
            {
              description:
                "We recommend putting MetaOne on your home screen for faster access to your wallet.",
              step: "install",
              title: "Open MetaOne app",
            },
            {
              description:
                "After you scan, a connection prompt will appear for you to connect your wallet.",
              step: "scan",
              title: "Tap the scan button",
            },
          ],
        },
      },
    };
  },
});

const { chains, provider } = configureChains(
  [mainnet, polygon, bsc, arbitrum, harmonyChain, avalancheChain],
  [publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaOne({ chains }),
      // Here can be added more wallets of your choice
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const App = () => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ConnectButton />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
