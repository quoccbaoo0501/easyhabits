"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Plus, Trash2 } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"

// Sample events data
const eventsData = [
  {
    id: 1,
    title: "Team Meeting",
    date: "2023-04-11",
    time: "09:00",
    duration: 60,
    category: "Work",
    description: "Weekly team sync meeting",
  },
  {
    id: 2,
    title: "Dentist Appointment",
    date: "2023-04-11",
    time: "11:30",
    duration: 45,
    category: "Personal",
    description: "Regular checkup",
  },
  {
    id: 3,
    title: "Project Review",
    date: "2023-04-11",
    time: "14:00",
    duration: 90,
    category: "Work",
    description: "Review project progress with stakeholders",
  },
  {
    id: 4,
    title: "Gym - Strength Training",
    date: "2023-04-11",
    time: "17:30",
    duration: 60,
    category: "Health",
    description: "Focus on upper body",
  },
  {
    id: 5,
    title: "Study Spanish",
    date: "2023-04-12",
    time: "08:00",
    duration: 30,
    category: "Learning",
    description: "Practice vocabulary and grammar",
  },
  {
    id: 6,
    title: "Client Call",
    date: "2023-04-12",
    time: "10:00",
    duration: 45,
    category: "Work",
    description: "Discuss project requirements",
  },
  {
    id: 7,
    title: "Lunch with Alex",
    date: "2023-04-12",
    time: "12:30",
    duration: 60,
    category: "Personal",
    description: "At Cafe Bistro",
  },
]

// Generate dates for the week
const generateWeekDates = () => {
  const today = new Date()
  const day = today.getDay() // 0 is Sunday, 1 is Monday, etc.
  const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Adjust to get Monday

  const monday = new Date(today.setDate(diff))

  const weekDates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    weekDates.push({
      date,
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
      isToday: new Date().toDateString() === date.toDateString(),
    })
  }

  return weekDates
}

export default function SchedulePage() {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const weekDates = generateWeekDates()

  // Filter events for the selected date
  const eventsForSelectedDate = eventsData.filter((event) => event.date === selectedDate)

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
          <h1 className="text-2xl font-semibold">Schedule</h1>
        </div>
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>Create a new event in your schedule.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title</Label>
                <Input id="event-title" placeholder="e.g., Team Meeting" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-date">Date</Label>
                  <Input id="event-date" type="date" defaultValue={selectedDate} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-time">Time</Label>
                  <Input id="event-time" type="time" defaultValue="09:00" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-duration">Duration (min)</Label>
                  <Input id="event-duration" type="number" min="5" step="5" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-category">Category</Label>
                  <Select defaultValue="work">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="learning">Learning</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-description">Description (optional)</Label>
                <Textarea id="event-description" placeholder="Add details about this event" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddEventOpen(false)}>Add Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Weekly Calendar</CardTitle>
                <CardDescription>April 10 - April 16, 2023</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {weekDates.map((day, i) => (
                <Button
                  key={i}
                  variant={
                    day.isToday
                      ? "default"
                      : selectedDate === day.date.toISOString().split("T")[0]
                        ? "secondary"
                        : "outline"
                  }
                  className="flex flex-col h-auto py-3"
                  onClick={() => setSelectedDate(day.date.toISOString().split("T")[0])}
                >
                  <div className="text-xs font-medium">{day.dayName}</div>
                  <div className="text-lg">{day.dayNumber}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="day">
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          <TabsContent value="day" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </CardTitle>
                <CardDescription>{eventsForSelectedDate.length} events scheduled</CardDescription>
              </CardHeader>
              <CardContent>
                {eventsForSelectedDate.length > 0 ? (
                  <div className="space-y-4">
                    {eventsForSelectedDate
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((event) => (
                        <div key={event.id} className="flex items-start rounded-lg border p-4">
                          <div className="mr-4 flex h-14 w-14 flex-col items-center justify-center rounded bg-primary/10 text-primary">
                            <div className="text-sm">
                              {event.time.split(":")[0]}:{event.time.split(":")[1]}
                            </div>
                            <div className="text-xs">{event.duration} min</div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{event.title}</div>
                              <div className="rounded-full bg-muted px-2 py-1 text-xs">{event.category}</div>
                            </div>
                            {event.description && (
                              <div className="mt-1 text-sm text-muted-foreground">{event.description}</div>
                            )}
                          </div>
                          <Button variant="ghost" size="icon" className="ml-2 h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-medium">No Events Scheduled</h3>
                    <p className="mb-6 text-sm text-muted-foreground">
                      You don't have any events scheduled for this day.
                    </p>
                    <Button onClick={() => setIsAddEventOpen(true)} className="gap-1">
                      <Plus className="h-4 w-4" />
                      Add Event
                    </Button>
                  </div>
                )}
              </CardContent>
              {eventsForSelectedDate.length > 0 && (
                <CardFooter>
                  <Button variant="outline" className="w-full gap-1" onClick={() => setIsAddEventOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Add Another Event
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          <TabsContent value="week" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly View</CardTitle>
                <CardDescription>April 10 - April 16, 2023</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 border-b pb-2">
                  {weekDates.map((day, i) => (
                    <div key={i} className="text-center text-sm font-medium">
                      {day.dayName}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 pt-2">
                  {weekDates.map((day, i) => {
                    const dateStr = day.date.toISOString().split("T")[0]
                    const dayEvents = eventsData.filter((event) => event.date === dateStr)

                    return (
                      <div key={i} className="min-h-[150px]">
                        <div
                          className={`mb-2 rounded-full text-center text-sm ${day.isToday ? "bg-primary text-primary-foreground" : "bg-muted"} py-1`}
                        >
                          {day.dayNumber}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              className="rounded bg-primary/10 px-2 py-1 text-xs"
                              title={`${event.time} - ${event.title}`}
                            >
                              {event.time.split(":")[0]}:{event.time.split(":")[1]}{" "}
                              {event.title.length > 10 ? event.title.substring(0, 10) + "..." : event.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-center text-xs text-muted-foreground">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="month" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly View</CardTitle>
                <CardDescription>April 2023</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 border-b pb-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                    <div key={i} className="text-center text-sm font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 pt-2">
                  {/* First week with empty days */}
                  {[null, null, null, null, null, 1, 2].map((day, i) => (
                    <div key={i} className="aspect-square p-1">
                      {day && (
                        <div className="h-full rounded border p-1 text-xs">
                          <div className="mb-1 font-medium">{day}</div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Remaining days */}
                  {Array.from({ length: 30 }, (_, i) => i + 3).map((day) => {
                    if (day > 30) return null

                    const isToday = day === 11 // Assuming today is April 11
                    const hasEvents = day >= 10 && day <= 16 // Events for the current week

                    return (
                      <div key={day} className="aspect-square p-1">
                        <div
                          className={`h-full rounded border p-1 text-xs ${isToday ? "border-primary bg-primary/5" : ""}`}
                        >
                          <div className="mb-1 font-medium">{day}</div>
                          {hasEvents && <div className="h-1 w-1 rounded-full bg-primary"></div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
