import CustomButton from "./components/Button";
import { CampaignType } from "./types/Types";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px]  min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <p>Campaign List</p>

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5].map((campaign) => (
          <div
            key={campaign}
            className="w-[280px] h-fit border border-teal-600 p-4 rounded-md"
          >
            <h3 className="font-bold">Campaign</h3>
            <p>A short Description for campaign</p>
            <p>Total raised 120 sol</p>
            <p>Deadline {new Date().toLocaleDateString()}</p>
            {/* <button className="mt-4 cursor-pointer bg-teal-700 rounded px-4 py-2 text-white">
              View Details
            </button> */}
            <CustomButton
              title="View Details"
              route={`/details/${campaign}`}
              // onClick={() => router.push(`/details/${campaign}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
