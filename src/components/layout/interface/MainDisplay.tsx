import AIPreview from "./AIPreview";
import Library from "./Library";
import LiveOutput from "./LiveOutput";
import Preview from "./Preview";
import Schedule from "./Schedule";

const MainDisplay = () => {
  return (
    <div className="flex gap-4 px-4 py-3">
      <div className="flex flex-col justify-between gap-4 w-1/3">
        <Schedule />
        <Library />
      </div>
      <div className="flex flex-col justify-between gap-4 w-1/3">
        <Preview />
        <AIPreview/>
      </div>
      <div className="w-2/3">
      <LiveOutput />
      </div>
    </div>
  );
};

export default MainDisplay;
