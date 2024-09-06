import  { useState, useEffect } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
import * as web3 from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
// applies the styling to the components which are rendered on the browser
require("@solana/wallet-adapter-react-ui/styles.css");
// imports methods for deriving data from the wallet's data store
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
const WalletContextProvider = ({ children }) => {
  const [balance, setBalance] = useState<number | null>(0);
  const { connection } = useConnection();
  const { publicKey, connect, connected } = useWallet();
  const endpoint = web3.clusterApiUrl("devnet");
  const wallets = [
    new walletAdapterWallets.PhantomWalletAdapter(),
    new walletAdapterWallets.SolflareWalletAdapter(),
    new walletAdapterWallets.SolletWalletAdapter(),
    new walletAdapterWallets.SolletExtensionWalletAdapter(),
    new walletAdapterWallets.TorusWalletAdapter(),
  ];

  useEffect(() => {
    const getInfo = async () => {
      if (connection && publicKey) {
        const info = await connection.getAccountInfo(publicKey);
        setBalance(info?.lamports / web3.LAMPORTS_PER_SOL || 0);
      }
    };
    getInfo();
  }, [connection, publicKey]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
