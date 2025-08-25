import ButtonsComponent from "../ButtonsComponent";

const CampaignDetails = () => {
  return (
    <div>
      <div className="w-full h-fit border border-teal-600 p-4 rounded-md mt-[60px]">
        <h3 className="font-bold">Campaign</h3>
        <p>A short Description for campaign</p>
        <p>Total raised 120 sol</p>
        <p>Deadline {new Date().toLocaleDateString()}</p>

        <ButtonsComponent />
      </div>
    </div>
  );
};

export default CampaignDetails;
