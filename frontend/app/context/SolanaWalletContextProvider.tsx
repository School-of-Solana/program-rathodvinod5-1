"use client";

import { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";
import { NETWORK } from "../utilities/Contants";
import { AnchorProviderContext } from "./SolanaConnectionProgramProvider";

export const SolanaWalletContextProviders: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={NETWORK}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AnchorProviderContext>{children}</AnchorProviderContext>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
