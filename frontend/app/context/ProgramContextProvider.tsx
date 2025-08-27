import React, { createContext, useContext, useMemo } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { AnchorProvider, Program, Idl } from "@project-serum/anchor";
import idl from "../idl/crowdfunding.json"; // your IDL JSON
import { NETWORK, PROGRAM_ID } from "../utilities/Contants";
import { useConnection } from "@solana/wallet-adapter-react";

// Replace with your deployed program ID
// const PROGRAM_ID = new PublicKey("YOUR_PROGRAM_ID_HERE");
// const NETWORK = "https://api.devnet.solana.com";

interface ProgramContextType {
  connection: Connection;
  provider: AnchorProvider;
  program?: Program;
}

const ProgramContext = createContext<ProgramContextType | null>(null);

export const ProgramProvider = ({ wallet, children }: any) => {
  //   const connection = useMemo(() => new Connection(NETWORK), []);
  const { connection } = useConnection();

  //   const provider = useMemo(
  //     () =>
  //       new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions()),
  //     [connection, wallet]
  //   );
  //   const program = useMemo(
  //     () => new Program(idl as anchor.Idl, PROGRAM_ID, provider),
  //     [provider]
  //   );

  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );

  const program = new Program(
    idl as unknown as anchor.Idl,
    PROGRAM_ID,
    provider
  );

  return (
    <ProgramContext.Provider value={{ connection, provider, program }}>
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgram = () => {
  const ctx = useContext(ProgramContext);
  if (!ctx) throw new Error("useProgram must be used within ProgramProvider");
  return ctx;
};
