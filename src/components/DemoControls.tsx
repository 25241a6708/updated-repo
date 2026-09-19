import { useState } from "react";
import { PackagePlus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DemoControls() {
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 z-[1200] w-[230px]">
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-lg">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 border-b border-border px-3 py-2.5 text-xs font-extrabold uppercase"
        >
          <span className="inline-flex items-center gap-2"><Zap className="size-4 text-positive" /> Demo Controls</span>
          <span className="text-muted-foreground">{open ? "−" : "+"}</span>
        </button>
        {open && (
          <div className="p-3">
            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={() =>
                toast.success("Supply drop simulated", {
                  description: "FreshBite added 25 surplus meals to the live pool.",
                })
              }
            >
              <PackagePlus /> Simulate Supply Drop
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
