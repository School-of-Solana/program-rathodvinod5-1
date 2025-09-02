"use client";

import { createContext, useContext, useMemo } from "react";
import {
  useConnection,
  useAnchorWallet,
  useWallet,
} from "@solana/wallet-adapter-react";

import { AnchorProvider, Program, Idl, Wallet } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import IDL from "../idl/crowdfunding.json";

type AnchorContextType = {
  connection: ReturnType<typeof useConnection>["connection"];
  readOnlyProvider: AnchorProvider;
  writeProvider: AnchorProvider | null;
  program: Program | null;
  readOnlyProgram: Program;
};

const AnchorContext = createContext<AnchorContextType | null>(null);

// Dummy Wallet (for read-only)
const dummyWallet: Wallet = {
  publicKey: PublicKey.default,
  signTransaction: async (tx) => tx,
  signAllTransactions: async (txs) => txs,
};

export function AnchorProviderContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const { readOnlyProvider, writeProvider, program, readOnlyProgram } =
    useMemo(() => {
      // Read-only provider (no wallet)
      const readOnlyProvider = new AnchorProvider(connection, dummyWallet, {
        commitment: "confirmed",
        preflightCommitment: "processed",
      });

      const readOnlyProgram = new Program(IDL as Idl, readOnlyProvider);

      // Write provider (requires wallet)
      if (wallet) {
        const writeProvider = new AnchorProvider(connection, wallet, {
          commitment: "confirmed",
          preflightCommitment: "processed",
        });
        const program = new Program(IDL as Idl, writeProvider);

        return { readOnlyProvider, writeProvider, program, readOnlyProgram };
      }

      return {
        readOnlyProvider,
        readOnlyProgram,
        writeProvider: null,
        program: null,
      };
    }, [connection, wallet]);

  return (
    <AnchorContext.Provider
      value={{
        connection,
        readOnlyProvider,
        writeProvider,
        program,
        readOnlyProgram,
      }}
    >
      {children}
    </AnchorContext.Provider>
  );
}

export function useAnchor() {
  const ctx = useContext(AnchorContext);
  if (!ctx)
    throw new Error("useAnchor must be used within AnchorProviderContext");
  return ctx;
}
