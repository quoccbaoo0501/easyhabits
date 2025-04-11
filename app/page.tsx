import Link from "next/link"
import { BookOpen, CalendarDays, Clock, Dumbbell, FlaskConical, Goal, Home, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <FlaskConical className="h-6 w-6" />
          <span>HabitTracker</span>
        </Link>
        <nav className="ml-auto flex gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/profile">
              <img src="/placeholder.svg?height=32&width=32" alt="Profile" className="h-8 w-8 rounded-full" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
        </nav>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-[250px] flex-col border-r bg-muted/40 sm:flex">
          <nav className="grid gap-2 p-4 text-sm">
            <Button variant="ghost" className="justify-start gap-2" asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start gap-2" asChild>
              <Link href="/pomodoro">
                <Clock className="h-4 w-4" />
                Pomodoro
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start gap-2" asChild>
              <Link href="/flashcards">
                <FlaskConical className="h-4 w-4" />
                Flashcards
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start gap-2" asChild>
              <Link href="/workouts">
                <Dumbbell className="h-4 w-4" />
                Workouts
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start gap-2" asChild>
              <Link href="/goals">
                <Goal className="h-4 w-4" />
                Goals
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start gap-2" asChild>
              <Link href="/schedule">
                <CalendarDays className="h-4 w-4" />
                Schedule
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start gap-2" asChild>
              <Link href="/pdf-reader">
                <BookOpen className="h-4 w-4" />
                PDF Reader
              </Link>
            </Button>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                New Habit
              </Button>
            </div>
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
                <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                <TabsTrigger value="workouts">Workouts</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="pdf-reader">PDF Reader</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Pomodoro Sessions</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">+2 from last week</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="w-full" asChild>
                        <Link href="/pomodoro">Start Session</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Flashcards Studied</CardTitle>
                      <FlaskConical className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">86</div>
                      <p className="text-xs text-muted-foreground">+24 from last week</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="w-full" asChild>
                        <Link href="/flashcards">Study Now</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Workouts Completed</CardTitle>
                      <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">5</div>
                      <p className="text-xs text-muted-foreground">+1 from last week</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="w-full" asChild>
                        <Link href="/workouts">Log Workout</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                <div className="mt-6 grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Goals Progress</CardTitle>
                      <CardDescription>Track your progress towards your goals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">Read 20 books this year</div>
                            <div className="text-sm text-muted-foreground">8/20</div>
                          </div>
                          <Progress value={40} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">Exercise 3 times per week</div>
                            <div className="text-sm text-muted-foreground">2/3</div>
                          </div>
                          <Progress value={67} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">Learn Spanish - 30 minutes daily</div>
                            <div className="text-sm text-muted-foreground">5/7 days</div>
                          </div>
                          <Progress value={71} />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href="/goals">View All Goals</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="pomodoro">
                <PomodoroTab />
              </TabsContent>
              <TabsContent value="flashcards">
                <FlashcardsTab />
              </TabsContent>
              <TabsContent value="workouts">
                <WorkoutsTab />
              </TabsContent>
              <TabsContent value="goals">
                <GoalsTab />
              </TabsContent>
              <TabsContent value="schedule">
                <ScheduleTab />
              </TabsContent>
              <TabsContent value="pdf-reader">
                <PDFReaderTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

function PomodoroTab() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Pomodoro Timer</CardTitle>
          <CardDescription>Focus on your work with timed sessions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="mb-6 flex h-48 w-48 items-center justify-center rounded-full border-8 border-primary/20">
            <div className="text-4xl font-bold">25:00</div>
          </div>
          <div className="flex gap-2">
            <Button>Start</Button>
            <Button variant="outline">Reset</Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">Work: 25 min</div>
          <div className="text-sm text-muted-foreground">Break: 5 min</div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { date: "Today", duration: "25 min", task: "Project Research" },
              { date: "Today", duration: "25 min", task: "Email Management" },
              { date: "Yesterday", duration: "25 min", task: "Content Writing" },
              { date: "Yesterday", duration: "25 min", task: "Code Review" },
            ].map((session, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-medium">{session.task}</div>
                  <div className="text-sm text-muted-foreground">{session.date}</div>
                </div>
                <div className="text-sm">{session.duration}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FlashcardsTab() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Study Flashcards</CardTitle>
          <CardDescription>Review your flashcard decks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Spanish Vocabulary", cards: 48, progress: 65 },
              { name: "JavaScript Concepts", cards: 32, progress: 80 },
              { name: "World Capitals", cards: 195, progress: 25 },
              { name: "Biology Terms", cards: 64, progress: 40 },
              { name: "Historical Dates", cards: 87, progress: 15 },
              { name: "Math Formulas", cards: 42, progress: 55 },
            ].map((deck, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{deck.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-sm text-muted-foreground">{deck.cards} cards</div>
                  <div className="mt-2 space-y-2">
                    <div className="text-xs text-muted-foreground">Progress</div>
                    <Progress value={deck.progress} />
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 p-3">
                  <Button size="sm" className="w-full">
                    Study Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full gap-1">
            <Plus className="h-4 w-4" />
            Create New Deck
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function WorkoutsTab() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Workout Tracker</CardTitle>
          <CardDescription>Log and track your workouts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">This Week</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-sm text-muted-foreground">workouts completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">This Month</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-3xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">workouts completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Streak</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-3xl font-bold">5</div>
                  <div className="text-sm text-muted-foreground">days</div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { date: "Today", type: "Strength Training", duration: "45 min" },
                    { date: "2 days ago", type: "Running", duration: "30 min" },
                    { date: "3 days ago", type: "Yoga", duration: "60 min" },
                    { date: "5 days ago", type: "Cycling", duration: "45 min" },
                  ].map((workout, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="font-medium">{workout.type}</div>
                        <div className="text-sm text-muted-foreground">{workout.date}</div>
                      </div>
                      <div className="text-sm">{workout.duration}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full gap-1">
            <Plus className="h-4 w-4" />
            Log New Workout
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function GoalsTab() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Goals Tracker</CardTitle>
          <CardDescription>Set and track your personal goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Read 20 books this year", category: "Learning", progress: 40, current: 8, target: 20 },
              { name: "Exercise 3 times per week", category: "Health", progress: 67, current: 2, target: 3 },
              { name: "Learn Spanish - 30 minutes daily", category: "Learning", progress: 71, current: 5, target: 7 },
              { name: "Meditate for 10 minutes daily", category: "Wellness", progress: 86, current: 6, target: 7 },
              { name: "Save $5000 for vacation", category: "Finance", progress: 35, current: 1750, target: 5000 },
            ].map((goal, i) => (
              <Card key={i}>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{goal.name}</CardTitle>
                    <div className="rounded-full bg-muted px-2 py-1 text-xs">{goal.category}</div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div>Progress</div>
                      <div>
                        {goal.current}/{goal.target}
                      </div>
                    </div>
                    <Progress value={goal.progress} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-3">
                  <Button variant="ghost" size="sm">
                    Update
                  </Button>
                  <Button variant="ghost" size="sm">
                    Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full gap-1">
            <Plus className="h-4 w-4" />
            Add New Goal
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function ScheduleTab() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Plan and organize your week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
              <div key={i} className="text-center">
                <div className="mb-1 text-sm font-medium">{day}</div>
                <div className={`rounded-full p-2 ${i === 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {i + 10}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            {[
              { time: "9:00 AM", title: "Team Meeting", duration: "1 hour" },
              { time: "11:30 AM", title: "Dentist Appointment", duration: "45 min" },
              { time: "2:00 PM", title: "Project Review", duration: "1.5 hours" },
              { time: "5:30 PM", title: "Gym - Strength Training", duration: "1 hour" },
            ].map((event, i) => (
              <div key={i} className="flex items-center rounded-lg border p-3">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded bg-primary/10 text-primary">
                  {event.time.split(" ")[0]}
                  <span className="text-xs">{event.time.split(" ")[1]}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">{event.duration}</div>
                </div>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add</span>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full gap-1">
            <Plus className="h-4 w-4" />
            Add New Event
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function PDFReaderTab() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>PDF Library</CardTitle>
          <CardDescription>Access your study materials and documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Study Guide - Spanish Basics", category: "Learning", pages: 24 },
              { title: "Workout Plan - Strength Training", category: "Health", pages: 15 },
              { title: "Healthy Recipes Cookbook", category: "Health", pages: 42 },
            ].map((doc, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-base line-clamp-1">{doc.title}</CardTitle>
                  <CardDescription>{doc.category}</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-center mb-3">
                    <div className="h-[120px] w-[90px] bg-muted flex items-center justify-center rounded border">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground text-center">{doc.pages} pages</div>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 p-3">
                  <Button size="sm" className="w-full" asChild>
                    <Link href="/pdf-reader">Open</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full gap-1" asChild>
            <Link href="/pdf-reader">
              <Plus className="h-4 w-4" />
              View All Documents
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
