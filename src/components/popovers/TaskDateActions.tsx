import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CalendarIcon} from "lucide-react";
import {TaskDatePicker} from "@/components/calendar-19.tsx";

export function TaskDateActions(props: {
  open: boolean;
  onOpenChange: (value: ((prevState: boolean) => boolean) | boolean) => void;
  onClick: () => void;
  onClick1: () => void;
  onClick2: () => void;
  value: string | null;
  onChange: (date: string | null) => void;
}) {
  return (
    <Popover open={props.open} onOpenChange={props.onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <CalendarIcon className="size-4"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" className="flex w-36 flex-col gap-1 p-2">
        <Button variant="ghost" size="sm" onClick={props.onClick}>
          Hoy
        </Button>
        <Button variant="ghost" size="sm" onClick={props.onClick1}>
          Mañana
        </Button>
        <Button variant="ghost" size="sm" onClick={props.onClick2}>
          +1 semana
        </Button>
        <TaskDatePicker value={props.value} onChange={props.onChange}/>
      </PopoverContent>
    </Popover>
  );
}
