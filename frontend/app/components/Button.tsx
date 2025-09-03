"use client";
import { useRouter } from "next/navigation";

const CustomButton = ({
  // title,
  route,
  onClick,
  customCss,
  children,
}: {
  // title: string;
  route?: string;
  onClick?: () => void;
  customCss?: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();

  return (
    <button
      className={`mt-4 cursor-pointer bg-teal-700 rounded px-4 py-2 text-white ${customCss} flex justify-center items-center`}
      onClick={() => (onClick ? onClick() : router.push(route!))}
    >
      {children}
    </button>
  );
};

export default CustomButton;
