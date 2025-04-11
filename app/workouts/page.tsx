"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Dumbbell, LineChart, Plus, Timer, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample workout data
const workoutData = [
  {
    id: 1,
    date: "2023-04-10",
    type: "Strength Training",
    duration: 45,
    exercises: [
      { name: "Bench Press", sets: 3, reps: 10, weight: 135 },
      { name: "Squats", sets: 3, reps: 12, weight: 185 },
      { name: "Deadlifts", sets: 3, reps: 8, weight: 225 },
    ],
  },
  {
    id: 2,
    date: "2023-04-08",
    type: "Running",
    duration: 30,
    distance: 3.2,
    pace: "9:22",
  },
  {
    id: 3,
    date: "2023-04-07",
    type: "Yoga",
    duration: 60,
  },
  {
    id: 4,
    date: "2023-04-05",
    type: "Cycling",
    duration: 45,
    distance: 12.5,
    pace: "3:36",
  },
  {
    id: 5,
    date: "2023-04-03",
    type: "Strength Training",
    duration: 50,
    exercises: [
      { name: "Pull-ups", sets: 3, reps: 8, weight: 0 },
      { name: "Shoulder Press", sets: 3, reps: 10, weight: 95 },
      { name: "Rows", sets: 3, reps: 12, weight: 135 },
    ],
  },
]

export default function WorkoutsPage() {
  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false)
  const [workoutType, setWorkoutType] = useState("strength")

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Workout Tracker</h1>
        </div>
        <Dialog open={isAddWorkoutOpen} onOpenChange={setIsAddWorkoutOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log New Workout</DialogTitle>
              <DialogDescription>Record your workout details to track your progress.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Tabs defaultValue="strength" onValueChange={setWorkoutType}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="strength">Strength</TabsTrigger>
                  <TabsTrigger value="cardio">Cardio</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
                <TabsContent value="strength" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="workout-date">Date</Label>
                      <Input id="workout-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workout-duration">Duration (min)</Label>
                      <Input id="workout-duration" type="number" min="1" defaultValue="45" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Exercises</Label>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Plus className="h-3 w-3" />
                        Add Exercise
                      </Button>
                    </div>

                    <Card>
                      <CardContent className="p-3">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Input placeholder="Exercise name" defaultValue="Bench Press" className="flex-1" />
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <Label htmlFor="sets" className="text-xs">
                                Sets
                              </Label>
                              <Input id="sets" type="number" min="1" defaultValue="3" className="h-8" />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="reps" className="text-xs">
                                Reps
                              </Label>
                              <Input id="reps" type="number" min="1" defaultValue="10" className="h-8" />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="weight" className="text-xs">
                                Weight (lbs)
                              </Label>
                              <Input id="weight" type="number" min="0" defaultValue="135" className="h-8" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-3">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Input placeholder="Exercise name" defaultValue="Squats" className="flex-1" />
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <Label htmlFor="sets2" className="text-xs">
                                Sets
                              </Label>
                              <Input id="sets2" type="number" min="1" defaultValue="3" className="h-8" />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="reps2" className="text-xs">
                                Reps
                              </Label>
                              <Input id="reps2" type="number" min="1" defaultValue="12" className="h-8" />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="weight2" className="text-xs">
                                Weight (lbs)
                              </Label>
                              <Input id="weight2" type="number" min="0" defaultValue="185" className="h-8" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="cardio" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardio-date">Date</Label>
                      <Input id="cardio-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardio-type">Type</Label>
                      <Select defaultValue="running">
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="running">Running</SelectItem>
                          <SelectItem value="cycling">Cycling</SelectItem>
                          <SelectItem value="swimming">Swimming</SelectItem>
                          <SelectItem value="rowing">Rowing</SelectItem>
                          <SelectItem value="elliptical">Elliptical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardio-duration">Duration (min)</Label>
                      <Input id="cardio-duration" type="number" min="1" defaultValue="30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardio-distance">Distance (miles)</Label>
                      <Input id="cardio-distance" type="number" step="0.1" min="0" defaultValue="3.0" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="other" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="other-date">Date</Label>
                      <Input id="other-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="other-type">Type</Label>
                      <Select defaultValue="yoga">
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yoga">Yoga</SelectItem>
                          <SelectItem value="pilates">Pilates</SelectItem>
                          <SelectItem value="hiit">HIIT</SelectItem>
                          <SelectItem value="stretching">Stretching</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="other-duration">Duration (min)</Label>
                    <Input id="other-duration" type="number" min="1" defaultValue="60" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="other-notes">Notes</Label>
                    <Input id="other-notes" placeholder="Add any notes about your workout" />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddWorkoutOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddWorkoutOpen(false)}>Save Workout</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">workouts completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">135 min</div>
              <p className="text-xs text-muted-foreground">this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5 days</div>
              <p className="text-xs text-muted-foreground">current streak</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Workout History</CardTitle>
            <CardDescription>View and manage your workout records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workoutData.map((workout) => (
                <Card key={workout.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{workout.type}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(workout.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center">
                        <Timer className="mr-1 h-4 w-4 text-muted-foreground" />
                        {workout.duration} min
                      </div>

                      {workout.distance && (
                        <div className="flex items-center">
                          <LineChart className="mr-1 h-4 w-4 text-muted-foreground" />
                          {workout.distance} miles
                        </div>
                      )}

                      {workout.pace && (
                        <div className="flex items-center">
                          <Dumbbell className="mr-1 h-4 w-4 text-muted-foreground" />
                          {workout.pace} min/mile
                        </div>
                      )}
                    </div>

                    {workout.exercises && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs font-medium">Exercises:</div>
                        <div className="grid gap-1">
                          {workout.exercises.map((exercise, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-xs"
                            >
                              <span>{exercise.name}</span>
                              <span>
                                {exercise.sets} × {exercise.reps} @ {exercise.weight} lbs
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end border-t p-2">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
