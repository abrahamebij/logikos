import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BsBook, BsTv } from "react-icons/bs";
import { FaArrowDown, FaArrowUp, FaMinus, FaPlus } from "react-icons/fa";

const Schedule = () => {
  return (
    <Card className="gap-0 pb-0">
      <CardHeader className="border-b">
        <h2 className="font-semibold flex gap-2 items-center">
          Schedule{" "}
          <span className="text-muted-foreground text-xs font-light">
            XX Items
          </span>
        </h2>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex">
          {/* Schedule Items */}
          <div className="flex flex-col w-full overflow-y-scroll  max-h-56">
            <ScheduleItem type="scripture" active />
            <ScheduleItem type="scripture" />
            <ScheduleItem type="scripture" />
            <ScheduleItem type="scripture" />
            <ScheduleItem type="scripture" />
            <ScheduleItem type="scripture" />
          </div>
          {/* Controls */}
          <div className="flex flex-col px-4 gap-6 pt-4 text-muted-foreground items-center border-l">
            <button>
              <FaPlus />
            </button>
            <button>
              <FaMinus />
            </button>
            <button>
              <FaArrowUp />
            </button>
            <button>
              <FaArrowDown />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function ScheduleItem({
  type,
  active,
}: {
  type: "scripture" | "slide";
  active?: boolean;
}) {
  return (
    <div
      className={`flex gap-4 items-center py-2 last:mb-4 cursor-pointer px-2 ${active ? "bg-primary/10" : "hover:bg-muted"}`}
    >
      <div
        className={`${active ? "text-primary" : "text-muted-foreground"} text-lg`}
      >
        {type === "scripture" ? <BsBook /> : <BsTv />}
      </div>
      <div className="grid">
        <h3 className="font-semibold">Genesis 1:1</h3>
        <span className="text-muted-foreground text-xs">Scripture | KJV</span>
      </div>
    </div>
  );
}

export default Schedule;
