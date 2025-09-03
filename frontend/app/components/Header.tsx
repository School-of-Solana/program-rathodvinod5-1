"use client";
import { useRouter } from "next/navigation";
// import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header = () => {
  const router = useRouter();

  // const { publicKey, connect, disconnect } = useWallet();
  // const onClickButton = () => {
  //   if (publicKey) {
  //     disconnect();
  //   } else {
  //     connect();
  //   }
  // };

  return (
    <header className="flex flex-row justify-between items-center mt-6">
      <button
        className="text-2xl font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        Campaign
      </button>

      <WalletMultiButton />
      {/* <button
        onClick={onClickButton}
        className="px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        {connected && publicKey ? publicKey?.toBase58() : "Connect Wallet"}
      </button> */}
    </header>
  );
};

export default Header;
