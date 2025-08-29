"use client";

import { createContext, useContext, useMemo } from "react";
import {
  useConnection,
  useAnchorWallet,
  useWallet,
} from "@solana/wallet-adapter-react";

import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import IDL from "../idl/crowdfunding.json";
import { NETWORK } from "../utilities/Contants";

// TODO: Replace with your program ID & IDL
const PROGRAM_ID = new PublicKey(
  "Ept1VxEScf1bzfkwfEous1ZCDj16QCirBBq9kXzYAgwG"
);

type AnchorContextType = {
  connection: ReturnType<typeof useConnection>["connection"];
  provider: AnchorProvider | null;
  program: Program | null;
};

const AnchorContext = createContext<AnchorContextType | null>(null);

export function AnchorProviderContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  // const wallet = useWallet();

  const { provider, program } = useMemo(() => {
    if (!wallet) return { provider: null, program: null };
    // const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
      preflightCommitment: "processed",
    });

    const program = new Program(IDL as Idl, provider);

    return { provider, program };
  }, [connection, wallet]);

  // const getProvider = () => {
  //   if (!wallet) return null;
  //   // const connection = useMemo(() => new Connection(NETWORK), [NETWORK]);
  //   const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  //   // const connection = new Connection(NETWORK, "confirmed");

  //   // airdrop som sol
  //   // const sig = await connection.requestAirdrop(
  //   //   wallet.publicKey,
  //   //   2 * LAMPORTS_PER_SOL
  //   // );
  //   // await connection.confirmTransaction(sig, "confirmed");
  //   // console.log("Airdropped 2 SOL to", pubkey.toBase58());

  //   const provider = new AnchorProvider(connection, wallet, {
  //     commitment: "confirmed",
  //     preflightCommitment: "processed",
  //   });

  //   // const provider = new AnchorProvider(connection, window.solana, {
  //   //   commitment: "confirmed",
  //   //   preflightCommitment: "processed",
  //   // });
  //   return provider;
  // };
  // const provider = getProvider();

  // const program = provider ? new Program(IDL as Idl, provider) : null;

  return (
    <AnchorContext.Provider value={{ connection, provider, program }}>
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
