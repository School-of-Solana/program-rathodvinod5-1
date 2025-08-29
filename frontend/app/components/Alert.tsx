import { CircleAlert, X } from "lucide-react";
import { SuccessAndErrorDetailsType } from "../types/Types";

const Alert = ({
  status,
  onCloseHandler,
}: {
  status: SuccessAndErrorDetailsType;
  onCloseHandler: () => void;
}) => {
  const isError = status.type === "error";
  const bgColor = isError ? "bg-red-100" : "bg-green-100";
  const textColor = isError ? "text-red-800" : "text-green-800";

  return (
    <div className={` p-3 flex gap-3 dark:bg-green-800/40 ${bgColor} rounded`}>
      <CircleAlert className={`${textColor} text-[1.5rem]`} />
      <div className="w-full flex flex-row justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className={`capitalize text-[1.2rem] font-[500] ${textColor}`}>
            {status.title ? status.title : status.type}
          </h2>
          <p className={`capitalize text-[1rem] ${textColor}`}>
            {status.message}
          </p>
        </div>
        <button className="p-2" onClick={onCloseHandler}>
          <X className={`${textColor}`} />
        </button>
      </div>
    </div>
  );
};

export default Alert;

// bg-[#edf7ed] text-[#418944]
