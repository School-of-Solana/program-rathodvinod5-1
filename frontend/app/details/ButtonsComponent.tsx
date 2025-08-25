"use client";
import CustomButton from "../components/Button";

const ButtonsComponent = () => {
  return (
    <div className="w-full flex flex-row justify-center items-center gap-4">
      <CustomButton
        title="Contribute"
        // route="/details/${campaign}"
        onClick={() => {}}
        customCss="w-[200px]"
      />
      <CustomButton
        title="Claim Funds"
        // route="/details/${campaign}"
        onClick={() => {}}
        customCss="w-[200px]"
      />
    </div>
  );
};

export default ButtonsComponent;
