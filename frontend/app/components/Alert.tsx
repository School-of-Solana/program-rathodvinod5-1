import { CircleAlert } from "lucide-react";

const Alert = ({
  title = "",
  description = "",
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className=" p-3 flex gap-3 dark:bg-green-800/40 bg-[#edf7ed] rounded">
      <CircleAlert className="text-[#418944] text-[1.5rem] dark:text-green-600" />
      <div className="flex flex-col gap-1">
        <h2 className="text-[#418944] text-[1.2rem] font-[500] dark:text-green-600">
          {title}
        </h2>
        <p className="text-[#418944] text-[1rem] dark:text-green-600">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Alert;
