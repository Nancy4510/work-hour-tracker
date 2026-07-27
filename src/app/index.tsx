"use client";

import { useState, useEffect, useMemo } from "react";
import { Clock, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { calculateHours } from "@/lib/timeUtils";
import type { WorkSession } from "@/app/types";
import WeeklyTable from "./../components/weeklyTable";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

export default function MainPage() {
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = resolvedTheme === "dark";

  const getWeekDates = (date: Date) => {
    const curr = new Date(date);
    const day = curr.getDay();

    // Get the date of the Sunday of the current week
    const diff = curr.getDate() - day;
    const sunday = new Date(curr.setDate(diff));

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const currentWeek = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  const handleAddSession = () => {
    if (!clockIn) {
      toast.error("Debe agregar una hora de entrada");
      return;
    } else if (!clockOut) {
      toast.error("Debe agregar una hora de salida");
      return;
    }

    const hours = calculateHours(clockIn, clockOut);

    if (hours <= 0) {
      toast.error("La hora de salida debe ser después de la hora de entrada");
      return;
    }
    const newSession: WorkSession = {
      //
      id: crypto.randomUUID(),
      clockIn,
      clockOut,
      date: selectedDate.toISOString(),
      // dateObj: new Date(selectedDate),
    };
    setSessions([newSession, ...sessions]);
    setClockIn("");
    setClockOut("");
    toast.success(
      `Sesión agregada: ${newSession.clockIn} - ${newSession.clockOut}`,
    );
  };

  const handleUpdateSession = (
    id: string,
    field: "clockIn" | "clockOut",
    value: string,
  ) => {
    if (!value) return;

    setSessions((prev) =>
      prev.map((session) =>
        session.id === id ? { ...session, [field]: value } : session,
      ),
    );
    toast.success(`Hora actualizada`);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    toast.success(`Sesión eliminada`);
  };
  const weeklyHours = useMemo(() => {
    if (currentWeek.length === 0) return 0;

    const weekStart = new Date(currentWeek[0]);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(currentWeek[6]);
    weekEnd.setHours(23, 59, 59, 999);

    const weekSessions = sessions.filter((session) => {
      // const sessionDate = new Date(session.dateObj);
      const sessionDate = new Date(session.date);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });

    return weekSessions.reduce((acc, session) => {
      return acc + calculateHours(session.clockIn, session.clockOut);
    }, 0);
  }, [sessions, currentWeek]);

  const changeWeek = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}

        <div className="absolute right-20 flex gap-2 items-center">
          <Switch
            id="dark-mode"
            size="default"
            className="h-6 w-11"
            checked={mounted ? isDarkMode : false}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            aria-label="Toggle dark mode"
          >
            <span className="group-data-[size=default]/switch:size-5 ml-0.5 mt-[2px]">
              {mounted && isDarkMode ? (
                <Moon className="size-4 text-white" />
              ) : (
                <Sun className="size-4 text-gray-500" />
              )}
            </span>
          </Switch>
        </div>

        <div className="text-center space-y-2 py-6 glass rounded-2xl px-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Clock className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Control de Horas
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Registra tus horas de trabajo de forma simple
          </p>
        </div>

        <WeeklyTable
          currentWeek={currentWeek}
          sessions={sessions}
          weeklyHours={weeklyHours}
          onChangeWeek={changeWeek}
          onDeleteSession={handleDeleteSession}
          onUpdateSession={handleUpdateSession}
          onAddSession={(date, clockIn, clockOut) => {
            const hours = calculateHours(clockIn, clockOut);

            if (hours <= 0) {
              toast.error(
                "La hora de salida debe ser después de la hora de entrada",
              );
              return;
            }

            const newSession: WorkSession = {
              id: Date.now().toString(),
              clockIn,
              clockOut,
              date: date.toISOString(),
            };

            setSessions([newSession, ...sessions]);
            toast.success(
              `Sesión agregada: ${newSession.clockIn} - ${newSession.clockOut}`,
            );
          }}
        />
      </div>
    </div>
  );
}
