import type { ReactNode } from "react";
import { BsGear } from "react-icons/bs";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SettingsDropdownProps = {
  ariaLabel: string;
  children: ReactNode;
};

const SettingsDropdown = ({
  ariaLabel,
  children,
}: SettingsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={ariaLabel}
            className="w-fit gap-0.5 bg-transparent! p-0 text-sm text-muted-foreground! hover:bg-transparent! h-fit"
            variant="ghost"
          >
            <BsGear aria-hidden="true" />
            <ChevronDown aria-hidden="true" className="text-xs" />
          </Button>
        }
      />
      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsDropdown;
