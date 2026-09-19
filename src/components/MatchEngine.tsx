import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ArrowRight, Gauge, Loader2, MapPin, Package, ShieldCheck, Timer, TriangleAlert } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type MatchRequest = {
  title: string;
  org: string;
  need: string;
  urgent?: boolean;
};

type Ctx = { open: (req: MatchRequest) => void };

const MatchContext = createContext<Ctx>({ open: () => {} });

export function useMatchEngine() {
  return useContext(MatchContext);
}

const factors = [
  { key: "Quantity Match", icon: Package, score: 92, weight: "25%", note: "60 meals available vs 30 needed" },
  { key: "Distance Proximity", icon: MapPin, score: 86, weight: "20%", note: "1.4 km · 6 min drive" },
  { key: "Urgency Level", icon: TriangleAlert, score: 97, weight: "25%", note: "Critical priority request" },
  { key: "Deadline Feasibility", icon: Timer, score: 78, weight: "15%", note: "5h 20m remaining window" },
  { key: "Compatibility", icon: ShieldCheck, score: 89, weight: "15%", note: "Verified partner · cooked meals" },
];

const total = Math.round(0.25 * 92 + 0.2 * 86 + 0.25 * 97 + 0.15 * 78 + 0.15 * 89);

export function MatchEngineProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<MatchRequest | null>(null);

  const open = useCallback((req: MatchRequest) => setRequest(req), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <MatchContext.Provider value={value}>
      {children}
      <Dialog open={!!request} onOpenChange={(o) => !o && setRequest(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[620px]">
          <DialogHeader>
            <div className="mb-1 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground">
              <Gauge className="size-4 text-positive" /> Impact Matching Engine
            </div>
            <DialogTitle className="text-2xl font-extrabold">{request?.title}</DialogTitle>
            <DialogDescription>
              {request?.org} · {request?.need}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">Overall match score</p>
                <p className="mt-1 text-4xl font-extrabold text-positive">{total}%</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-sm bg-positive/10 px-2.5 py-1 text-[11px] font-extrabold uppercase text-positive">
                <Loader2 className="size-3.5 animate-spin" /> Optimal match found
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {factors.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.key}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="inline-flex items-center gap-2 font-bold">
                      <Icon className="size-4 text-map" />
                      {f.key}
                      <span className="text-[10px] font-semibold text-muted-foreground">weight {f.weight}</span>
                    </span>
                    <span className="font-extrabold">{f.score}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-positive" style={{ width: `${f.score}%` }} />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{f.note}</p>
                </div>
              );
            })}
          </div>

          <Button
            variant={request?.urgent ? "destructive" : "impact"}
            size="xl"
            className="w-full"
            onClick={() => {
              toast.success("Help dispatched", { description: `Your response to ${request?.org} is confirmed.` });
              setRequest(null);
            }}
          >
            {request?.urgent ? "DISPATCH IMMEDIATE HELP" : "CONFIRM MY CONTRIBUTION"} <ArrowRight />
          </Button>
        </DialogContent>
      </Dialog>
    </MatchContext.Provider>
  );
}
