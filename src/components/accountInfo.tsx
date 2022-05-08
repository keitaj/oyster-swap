import React from "react";
import { useWallet } from "./../utils/wallet";
import { shortenAddress } from "./../utils/utils";
import { Identicon } from "./identicon";
import { useNativeAccount } from "./../utils/accounts";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const AccountInfo = (props: {}) => {
  const { pubKey } = useWallet();
  const { account } = useNativeAccount();

  if (!pubKey) return null;

  return (
    <div className="wallet-wrapper">
      <span>
        {((account?.lamports || 0) / LAMPORTS_PER_SOL).toFixed(6)} SOL
      </span>
      <div className="wallet-key">
        {shortenAddress(`${pubKey}`)}
        <Identicon
          address={pubKey.toBase58()}
          style={{ marginLeft: "0.5rem" }}
        />
      </div>
    </div>
  );
};
