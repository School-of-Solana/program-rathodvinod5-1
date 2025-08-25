"use client";
import { useRouter } from "next/navigation";

const CustomButton = ({
  title,
  route,
  onClick,
  customCss,
}: {
  title: string;
  route?: string;
  onClick?: () => void;
  customCss?: string;
}) => {
  const router = useRouter();

  return (
    <button
      className={`mt-4 cursor-pointer bg-teal-700 rounded px-4 py-2 text-white ${customCss}`}
      onClick={() => (onClick ? onClick : router.push(route!))}
    >
      {title}
    </button>
  );
};

export default CustomButton;
