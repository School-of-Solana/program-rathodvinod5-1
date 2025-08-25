"use client";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <header className="flex flex-row justify-between items-center mt-6">
      <button
        className="text-2xl font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        Campaign
      </button>
      {!pathName.includes("create") ? (
        <button
          className="cursor-pointer bg-teal-700 rounded px-4 py-2 text-white"
          onClick={() => router.push("/create")}
        >
          Create Campaign
        </button>
      ) : (
        <div />
      )}
    </header>
  );
};

export default Header;
