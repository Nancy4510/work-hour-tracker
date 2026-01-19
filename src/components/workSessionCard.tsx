"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Trash2 } from "lucide-react";

import { calculateHours, formatTimeAMPM } from "@/lib/timeUtils";
import type { WorkSession } from "@/app/types";

type WorkSessionCardProps = {
  session: WorkSession;
  onDelete: (id: string) => void;
};

export default function WorkSessionCard({
  session,
  onDelete,
}: WorkSessionCardProps) {
  const hours = calculateHours(session.clockIn, session.clockOut);

  return (
    <div>
      <Card className="p-4 glass hover:glass-strong transition-all border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-full glass-strong flex items-center justify-center border-primary/30">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 text-foreground font-semibold">
                <span className="text-lg">
                  {formatTimeAMPM(session.clockIn)}
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="text-lg">
                  {formatTimeAMPM(session.clockOut)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {session.date}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {hours.toFixed(2)}h
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(session.id)}
            className="ml-2 text-destructive hover:text-destructive hover:glass-subtle transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
