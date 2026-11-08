import Library from "./Library";
import Preview from "./Preview";
import Schedule from "./Schedule";

const MainDisplay = () => {
  return (
    <div className="grid grid-cols-3 gap-4 px-4 py-2">
      <div className="flex flex-col justify-between gap-4">
        <Schedule />
        <Library />
      </div>
      <div className="flex flex-col justify-between gap-4">
        <Preview />
      </div>
    </div>
  );
};

export default MainDisplay;
