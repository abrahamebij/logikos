import Library from "./Library";
import LiveOutput from "./LiveOutput";
import Preview from "./Preview";
import Schedule from "./Schedule";

const MainDisplay = () => {
  return (
    <div className="grid grid-cols-3 gap-4 px-4 py-3 h-[calc(100vh-93px)]">
      <div className="flex flex-col justify-between gap-4">
        <Schedule />
        <Library />
      </div>
      <div className="flex flex-col justify-between gap-4">
        <Preview />
      </div>
      <LiveOutput />
    </div>
  );
};

export default MainDisplay;
