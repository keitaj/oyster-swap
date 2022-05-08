import React, { useContext, useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { notify } from "./notifications";

export const WALLET_PROVIDERS = [
  { name: "sollet.io", url: "https://www.sollet.io" },
  { name: "solflare.com", url: "https://solflare.com/access-wallet" },
  { name: "mathwallet.org", url: "https://www.mathwallet.org" },
];

const WalletContext = React.createContext<any>(null);

type PhantomEvent = "disconnect" | "connect" | "accountChanged";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: ()=>Promise<void>;
  on: (event: PhantomEvent, callback: (args:any)=>void) => void;
  isPhantom: boolean;
}

type WindowWithSolana = Window & {
  solana?: PhantomProvider;
}

export function WalletProvider({ children = null as any }) {
  const [ walletAvail, setWalletAvail ] = useState(false);
  const [ provider, setProvider ] = useState<PhantomProvider | undefined | null>(undefined);
  const [ connected, setConnected ] = useState(false);
  const [ pubKey, setPubKey ] = useState<PublicKey | null>(null);

  useEffect( ()=>{
    console.log("g834hg845roe");

    if ("solana" in window) {
        const solWindow = window as WindowWithSolana;
        if (solWindow?.solana?.isPhantom) {
            setProvider(solWindow.solana);
            setWalletAvail(true);
            // Attemp an eager connection
            solWindow.solana.connect({ onlyIfTrusted: true });
        }
    }
  }, []);

  useEffect(() => {
    console.log("vn76t432oenroe");

    provider?.on("connect", (publicKey: PublicKey)=>{
      console.log("trying to connect");
      setConnected(true);
      setPubKey(publicKey);

      let walletPublicKey = publicKey.toBase58();
      let keyToDisplay =
        walletPublicKey.length > 20
          ? `${walletPublicKey.substring(0, 7)}.....${walletPublicKey.substring(
              walletPublicKey.length - 7,
              walletPublicKey.length
            )}`
          : walletPublicKey;

      notify({
        message: "Wallet update",
        description: "Connected to wallet " + keyToDisplay,
      });
    });
    provider?.on("disconnect", ()=>{
      console.log("disconnect event");
      setConnected(false);
      // setPubKey(null);
      notify({
        message: "Wallet update",
        description: "Disconnected from wallet",
      });
    });
    return () => {
      provider?.disconnect();
      setConnected(false);
    };
  }, [provider]);
  return (
    <WalletContext.Provider
      value={{
        connected,
        pubKey,
        setPubKey,
        provider,
        setProvider,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  return {
    connected: context.connected,
    pubKey: context.pubKey,
    setPubKey: context.setPubKey,
    provider: context.provider,
    setProvider: context.setProvider,
  };
}
