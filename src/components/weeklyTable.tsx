"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Calendar } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WorkSessionCard from "./../components/workSessionCard";
import { getSessionsForDay, isToday } from "@/lib/dateUtils";
import { calculateHours, formatTimeAMPM } from "@/lib/timeUtils";
import type { WorkSession } from "@/app/types";

type WeeklyTableProps = {
  currentWeek: Date[];
  sessions: WorkSession[];
  weeklyHours: number;
  onChangeWeek: (direction: number) => void;
  onDeleteSession: (id: string) => void;
  onAddSession: (date: Date, clockIn: string, clockOut: string) => void;
};

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

// Helper function to format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper function to get day key (YYYY-MM-DD format)
const getDayKey = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Component for time input cell
type TimeInputCellProps = {
  value: string;
  savedTime?: string;
  onChange: (value: string) => void;
};

const TimeInputCell = ({ value, savedTime, onChange }: TimeInputCellProps) => {
  if (savedTime) {
    return (
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-sm text-primary">
          {formatTimeAMPM(savedTime)}
        </span>
        <Input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-xs glass-subtle"
          placeholder="Add more"
        />
      </div>
    );
  }

  return (
    <Input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full glass-subtle"
      placeholder="HH:MM"
    />
  );
};

export default function WeeklyTable({
  currentWeek = [],
  sessions = [],
  weeklyHours = 0,
  onChangeWeek = () => {},
  onDeleteSession = () => {},
  onAddSession,
}: WeeklyTableProps) {
  // State to track input values for each day
  const [dayInputs, setDayInputs] = useState<
    Record<string, { clockIn: string; clockOut: string }>
  >({});

  // Update input value for a specific day
  const updateDayInput = (
    date: Date,
    field: "clockIn" | "clockOut",
    value: string
  ) => {
    const dayKey = getDayKey(date);
    setDayInputs((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value,
      },
    }));
  };

  // Handle adding session for a specific day
  const handleAddSessionForDay = (date: Date) => {
    const dayKey = getDayKey(date);
    const inputs = dayInputs[dayKey];

    if (!inputs?.clockIn || !inputs?.clockOut) {
      // TODO: Show error toast
      return;
    }

    onAddSession(date, inputs.clockIn, inputs.clockOut);

    // Clear inputs for this day
    setDayInputs((prev) => {
      const newState = { ...prev };
      delete newState[dayKey];
      return newState;
    });
  };

  const getDayTotal = (daySessions: WorkSession[]) => {
    return daySessions.reduce((acc, session) => {
      return acc + calculateHours(session.clockIn, session.clockOut);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <header className="glass rounded-xl p-4">
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-2 mr-20">
            <ChevronLeft
              className="w-5 h-5 cursor-pointer text-primary hover:text-accent transition-colors"
              onClick={() => onChangeWeek(-1)}
            />
            <h2 className="font-bold text-foreground">Semana anterior</h2>
          </div>
          <div className="flex items-center gap-2 ml-20">
            <h2 className="font-bold text-foreground">Siguiente semana</h2>
          </div>
          <ChevronRight
            className="w-5 h-5 cursor-pointer text-primary hover:text-accent transition-colors"
            onClick={() => onChangeWeek(1)}
          />
        </div>
      </header>
      <div className="glass-strong rounded-xl">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="glass-subtle border-b border-primary/20">
              <TableHead className="text-center font-bold text-primary">
                Dia
              </TableHead>
              <TableHead className="text-center font-bold text-primary">
                Fecha
              </TableHead>
              <TableHead className="text-center font-bold text-primary">
                Entrada
              </TableHead>
              <TableHead className="text-center font-bold text-primary">
                Salida
              </TableHead>
              <TableHead className="text-left font-bold text-primary">
                Horas
              </TableHead>
              <TableHead className="text-center font-bold text-primary">
                Agregar
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentWeek.length > 0 &&
              currentWeek.map((date) => {
                const dayKey = getDayKey(date);
                const daySessions = getSessionsForDay(sessions, date);
                const firstSession = daySessions[0];
                const dayInput = dayInputs[dayKey] || {
                  clockIn: "",
                  clockOut: "",
                };
                const dayTotal = getDayTotal(daySessions);

                return (
                  <TableRow
                    key={dayKey}
                    className={isToday(date) ? "bg-primary/10" : ""}
                  >
                    <TableCell className="font-medium">
                      {WEEKDAYS[date.getDay()]}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatDate(date)}
                    </TableCell>
                    <TableCell>
                      <TimeInputCell
                        value={dayInput.clockIn}
                        savedTime={firstSession?.clockIn}
                        onChange={(value) =>
                          updateDayInput(date, "clockIn", value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TimeInputCell
                        value={dayInput.clockOut}
                        savedTime={firstSession?.clockOut}
                        onChange={(value) =>
                          updateDayInput(date, "clockOut", value)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      {dayTotal > 0 ? (
                        <span className="font-bold">
                          {dayTotal.toFixed(2)}h
                        </span>
                      ) : (
                        <span className="text-gray-500">0.00h</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleAddSessionForDay(date)}
                        disabled={!dayInput.clockIn || !dayInput.clockOut}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 hover:bg-primary/10" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={6}
                className="glass-subtle text-right font-bold text-lg"
              >
                Total: {weeklyHours.toFixed(2)}h
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground glass rounded-lg px-4 py-2 inline-block">
            Detalle de Sesiones
          </h2>
          <div className="space-y-3">
            {sessions
              .sort(
                (a, b) =>
                  new Date(b.dateObj).getTime() - new Date(a.dateObj).getTime()
              )
              .map((session) => (
                <WorkSessionCard
                  key={session.id}
                  session={session}
                  onDelete={onDeleteSession}
                />
              ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground glass rounded-xl">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-bold">No hay registros esta semana</p>
          <p className="text-base">
            Agrega tu primera sesión de trabajo arriba
          </p>
        </div>
      )}
    </div>
  );
}
