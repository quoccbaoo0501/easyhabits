"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Clock, Edit, Plus, Trash2 } from "lucide-react"

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
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample goals data
const goalsData = [
  {
    id: 1,
    name: "Read 20 books this year",
    category: "Learning",
    progress: 40,
    current: 8,
    target: 20,
    deadline: "2023-12-31",
    type: "numeric",
  },
  {
    id: 2,
    name: "Exercise 3 times per week",
    category: "Health",
    progress: 67,
    current: 2,
    target: 3,
    deadline: "weekly",
    type: "frequency",
  },
  {
    id: 3,
    name: "Learn Spanish - 30 minutes daily",
    category: "Learning",
    progress: 71,
    current: 5,
    target: 7,
    deadline: "weekly",
    type: "frequency",
  },
  {
    id: 4,
    name: "Meditate for 10 minutes daily",
    category: "Wellness",
    progress: 86,
    current: 6,
    target: 7,
    deadline: "weekly",
    type: "frequency",
  },
  {
    id: 5,
    name: "Save $5000 for vacation",
    category: "Finance",
    progress: 35,
    current: 1750,
    target: 5000,
    deadline: "2023-08-31",
    type: "numeric",
  },
]

export default function GoalsPage() {
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [goalType, setGoalType] = useState("numeric")

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
          <h1 className="text-2xl font-semibold">Goals Tracker</h1>
        </div>
        <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>Set a new goal to track your progress.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Tabs defaultValue="numeric" onValueChange={setGoalType}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="numeric">Numeric Goal</TabsTrigger>
                  <TabsTrigger value="frequency">Frequency Goal</TabsTrigger>
                </TabsList>
                <TabsContent value="numeric" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-name">Goal Name</Label>
                    <Input id="goal-name" placeholder="e.g., Read 20 books this year" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal-category">Category</Label>
                      <Select defaultValue="learning">
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="learning">Learning</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="wellness">Wellness</SelectItem>
                          <SelectItem value="career">Career</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal-deadline">Deadline</Label>
                      <Input id="goal-deadline" type="date" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal-current">Current Value</Label>
                      <Input id="goal-current" type="number" min="0" defaultValue="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal-target">Target Value</Label>
                      <Input id="goal-target" type="number" min="1" defaultValue="10" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="frequency" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="freq-goal-name">Goal Name</Label>
                    <Input id="freq-goal-name" placeholder="e.g., Exercise 3 times per week" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="freq-goal-category">Category</Label>
                      <Select defaultValue="health">
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="learning">Learning</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="wellness">Wellness</SelectItem>
                          <SelectItem value="career">Career</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="freq-goal-period">Time Period</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="freq-goal-target">Target Frequency</Label>
                      <Input id="freq-goal-target" type="number" min="1" defaultValue="3" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="freq-goal-current">Current Progress</Label>
                      <Input id="freq-goal-current" type="number" min="0" defaultValue="0" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddGoalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddGoalOpen(false)}>Create Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Goal Summary</CardTitle>
            <CardDescription>Overview of your goals progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">60%</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Goals</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {goalsData.map((goal) => (
                <Card key={goal.id}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{goal.name}</CardTitle>
                      <div className="rounded-full bg-muted px-2 py-1 text-xs">{goal.category}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {goal.deadline === "weekly"
                              ? "Weekly Goal"
                              : goal.deadline === "daily"
                                ? "Daily Goal"
                                : `Deadline: ${new Date(goal.deadline).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}`}
                          </span>
                        </div>
                        <div>
                          {goal.current}/{goal.target} {goal.type === "frequency" ? "times" : ""}
                        </div>
                      </div>
                      <Progress value={goal.progress} />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t p-3">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 gap-1 text-destructive">
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                    <Button size="sm" className="h-8 gap-1">
                      <Check className="h-3 w-3" />
                      Update Progress
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="health" className="mt-6">
            <div className="space-y-4">
              {goalsData
                .filter((goal) => goal.category === "Health")
                .map((goal) => (
                  <Card key={goal.id}>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{goal.name}</CardTitle>
                        <div className="rounded-full bg-muted px-2 py-1 text-xs">{goal.category}</div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {goal.deadline === "weekly"
                                ? "Weekly Goal"
                                : goal.deadline === "daily"
                                  ? "Daily Goal"
                                  : `Deadline: ${new Date(goal.deadline).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}`}
                            </span>
                          </div>
                          <div>
                            {goal.current}/{goal.target} {goal.type === "frequency" ? "times" : ""}
                          </div>
                        </div>
                        <Progress value={goal.progress} />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-destructive">
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                      <Button size="sm" className="h-8 gap-1">
                        <Check className="h-3 w-3" />
                        Update Progress
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="learning" className="mt-6">
            <div className="space-y-4">
              {goalsData
                .filter((goal) => goal.category === "Learning")
                .map((goal) => (
                  <Card key={goal.id}>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{goal.name}</CardTitle>
                        <div className="rounded-full bg-muted px-2 py-1 text-xs">{goal.category}</div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {goal.deadline === "weekly"
                                ? "Weekly Goal"
                                : goal.deadline === "daily"
                                  ? "Daily Goal"
                                  : `Deadline: ${new Date(goal.deadline).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}`}
                            </span>
                          </div>
                          <div>
                            {goal.current}/{goal.target} {goal.type === "frequency" ? "times" : ""}
                          </div>
                        </div>
                        <Progress value={goal.progress} />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-destructive">
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                      <Button size="sm" className="h-8 gap-1">
                        <Check className="h-3 w-3" />
                        Update Progress
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="finance" className="mt-6">
            <div className="space-y-4">
              {goalsData
                .filter((goal) => goal.category === "Finance")
                .map((goal) => (
                  <Card key={goal.id}>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{goal.name}</CardTitle>
                        <div className="rounded-full bg-muted px-2 py-1 text-xs">{goal.category}</div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {goal.deadline === "weekly"
                                ? "Weekly Goal"
                                : goal.deadline === "daily"
                                  ? "Daily Goal"
                                  : `Deadline: ${new Date(goal.deadline).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}`}
                            </span>
                          </div>
                          <div>
                            {goal.current}/{goal.target} {goal.type === "frequency" ? "times" : ""}
                          </div>
                        </div>
                        <Progress value={goal.progress} />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-destructive">
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                      <Button size="sm" className="h-8 gap-1">
                        <Check className="h-3 w-3" />
                        Update Progress
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="wellness" className="mt-6">
            <div className="space-y-4">
              {goalsData
                .filter((goal) => goal.category === "Wellness")
                .map((goal) => (
                  <Card key={goal.id}>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{goal.name}</CardTitle>
                        <div className="rounded-full bg-muted px-2 py-1 text-xs">{goal.category}</div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {goal.deadline === "weekly"
                                ? "Weekly Goal"
                                : goal.deadline === "daily"
                                  ? "Daily Goal"
                                  : `Deadline: ${new Date(goal.deadline).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}`}
                            </span>
                          </div>
                          <div>
                            {goal.current}/{goal.target} {goal.type === "frequency" ? "times" : ""}
                          </div>
                        </div>
                        <Progress value={goal.progress} />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-destructive">
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                      <Button size="sm" className="h-8 gap-1">
                        <Check className="h-3 w-3" />
                        Update Progress
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
