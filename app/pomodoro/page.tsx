"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Pause, Play, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PomodoroPage() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<"work" | "shortBreak" | "longBreak">("work")
  const [progress, setProgress] = useState(100)

  const modes = {
    work: { minutes: 25, label: "Work" },
    shortBreak: { minutes: 5, label: "Short Break" },
    longBreak: { minutes: 15, label: "Long Break" },
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            clearInterval(interval as NodeJS.Timeout)
            setIsActive(false)
            // Play sound or notification here
            return
          }
          setMinutes(minutes - 1)
          setSeconds(59)
        } else {
          setSeconds(seconds - 1)
        }

        // Calculate progress
        const totalSeconds = mode === "work" ? 25 * 60 : mode === "shortBreak" ? 5 * 60 : 15 * 60
        const remainingSeconds = minutes * 60 + seconds
        const calculatedProgress = (remainingSeconds / totalSeconds) * 100
        setProgress(calculatedProgress)
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, minutes, seconds, mode])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setMinutes(modes[mode].minutes)
    setSeconds(0)
    setProgress(100)
  }

  const changeMode = (newMode: "work" | "shortBreak" | "longBreak") => {
    setMode(newMode)
    setIsActive(false)
    setMinutes(modes[newMode].minutes)
    setSeconds(0)
    setProgress(100)
  }

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Pomodoro Timer</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Focus Timer</CardTitle>
            <CardDescription>Use the Pomodoro technique to improve productivity</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Tabs defaultValue="work" className="mb-6 w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="work" onClick={() => changeMode("work")}>
                  Work
                </TabsTrigger>
                <TabsTrigger value="shortBreak" onClick={() => changeMode("shortBreak")}>
                  Short Break
                </TabsTrigger>
                <TabsTrigger value="longBreak" onClick={() => changeMode("longBreak")}>
                  Long Break
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative mb-8 flex h-64 w-64 items-center justify-center rounded-full border-8 border-primary/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-5xl font-bold">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </div>
              </div>
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle className="stroke-primary/20" cx="50" cy="50" r="45" fill="transparent" strokeWidth="8" />
                <circle
                  className="stroke-primary"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>

            <div className="flex gap-4">
              <Button size="lg" onClick={toggleTimer} className="gap-2 px-6">
                {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {isActive ? "Pause" : "Start"}
              </Button>
              <Button variant="outline" size="lg" onClick={resetTimer} className="gap-2 px-6">
                <RotateCcw className="h-5 w-5" />
                Reset
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              <Clock className="mr-1 inline-block h-4 w-4" />
              Current mode: {modes[mode].label}
            </div>
            <div className="text-sm text-muted-foreground">{isActive ? "Timer running" : "Timer paused"}</div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session History</CardTitle>
            <CardDescription>Track your focus sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "Today", time: "10:30 AM", duration: "25 min", task: "Project Research" },
                { date: "Today", time: "9:00 AM", duration: "25 min", task: "Email Management" },
                { date: "Yesterday", time: "4:15 PM", duration: "25 min", task: "Content Writing" },
                { date: "Yesterday", time: "2:30 PM", duration: "25 min", task: "Code Review" },
                { date: "Yesterday", time: "11:00 AM", duration: "25 min", task: "Team Meeting" },
              ].map((session, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{session.task}</div>
                      <div className="text-sm text-muted-foreground">
                        {session.date} at {session.time}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{session.duration}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
