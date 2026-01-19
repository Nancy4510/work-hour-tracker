"use client";

import { useState, useMemo } from "react";

import { Clock } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { calculateHours } from "@/lib/timeUtils";
import type { WorkSession } from "@/app/types";
import WeeklyTable from "./../components/weeklyTable";

export default function MainPage() {
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sessions, setSessions] = useState<WorkSession[]>([]);

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
    if (!clockIn || !clockOut) {
      // TODO: Add toast notification
      console.log(`clockIn: ${clockIn}, clockOut: ${clockOut}`);
      return;
    }

    const hours = calculateHours(clockIn, clockOut);

    if (hours <= 0) {
      // TODO: Add toast notification
      console.log(`La hora de salida debe ser después de la hora de entrada`);
      return;
    }
    const newSession: WorkSession = {
      id: Date.now().toString(),
      clockIn,
      clockOut,
      date: selectedDate.toISOString(),
      dateObj: new Date(selectedDate),
    };
    setSessions([newSession, ...sessions]);
    setClockIn("");
    setClockOut("");
    // TODO: Add toast notification
    console.log(
      `Sesión agregada: ${newSession.clockIn} - ${newSession.clockOut}`
    );
  };

  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    // TODO: Add toast notification
    console.log(`Sesión eliminada: ${id}`);
  };
  const weeklyHours = useMemo(() => {
    if (currentWeek.length === 0) return 0;

    const weekStart = currentWeek[0];
    const weekEnd = new Date(currentWeek[6]);
    weekEnd.setHours(23, 59, 59, 999);

    const weekSessions = sessions.filter((session) => {
      const sessionDate = new Date(session.dateObj);
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

        {/* Input Card */}
        {/* <Card className="p-6 md:p-8 shadow-medium">
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="selectedDate"
                className="text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <CalendarDays className="w-4 h-4 text-primary" />
                Fecha
              </label>
              <Input
                id="selectedDate"
                type="date"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="h-14 text-lg"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="clockIn"
                  className="text-sm font-semibold text-foreground flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-primary" />
                  Hora de Entrada
                </label>
                <Input
                  id="clockIn"
                  type="time"
                  value={clockIn}
                  onChange={(e) => setClockIn(e.target.value)}
                  className="h-14 text-lg"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="clockOut"
                  className="text-sm font-semibold text-foreground flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-accent" />
                  Hora de Salida
                </label>
                <Input
                  id="clockOut"
                  type="time"
                  value={clockOut}
                  onChange={(e) => setClockOut(e.target.value)}
                  className="h-14 text-lg"
                />
              </div>
            </div>

            <Button
              onClick={handleAddSession}
              className="w-full h-14 text-lg font-semibold shadow-soft hover:shadow-medium transition-all"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Registrar Horario
            </Button>
          </div>
        </Card> */}

        <WeeklyTable
          currentWeek={currentWeek}
          sessions={sessions}
          weeklyHours={weeklyHours}
          onChangeWeek={changeWeek}
          onDeleteSession={handleDeleteSession}
          onAddSession={(date, clockIn, clockOut) => {
            const hours = calculateHours(clockIn, clockOut);

            if (hours <= 0) {
              // TODO: Add toast notification
              <Toaster />;
              console.log(
                "La hora de salida debe ser después de la hora de entrada"
              );
              return;
            }

            const newSession: WorkSession = {
              id: Date.now().toString(),
              clockIn,
              clockOut,
              date: date.toISOString(),
              dateObj: new Date(date),
            };

            setSessions([newSession, ...sessions]);
            // TODO: Add toast notification
            console.log(
              `Sesión agregada: ${newSession.clockIn} - ${newSession.clockOut}`
            );
          }}
        />
      </div>
    </div>
  );
}
