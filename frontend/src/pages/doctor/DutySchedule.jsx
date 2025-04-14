
import { useState } from "react"
import { Calendar } from "../../components/Calendar.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table.jsx"
import { Clock } from "lucide-react"
import { format } from "date-fns"

export default function DutySchedule() {
  const [date, setDate] = useState(new Date())

  const [schedules, setSchedules] = useState([
    { id: 1, date: "2025-03-31", shift: "Morning", time: "9:00 AM - 1:00 PM" },
    { id: 2, date: "2025-04-02", shift: "Evening", time: "1:00 PM - 5:00 PM" },
    { id: 3, date: "2025-04-04", shift: "Morning", time: "9:00 AM - 1:00 PM" },
    { id: 4, date: "2025-04-07", shift: "Evening", time: "1:00 PM - 5:00 PM" },
  ])

  // Filter schedules based on selected date
  const filteredSchedules = schedules.filter((schedule) => {
    if (!date) return true
    return schedule.date === format(date, "yyyy-MM-dd")
  })

  // Get all dates with schedules for highlighting in calendar
  const scheduleDates = schedules.map((schedule) => new Date(schedule.date))

  return (
    <>
      <h1 className="text-2xl font-bold">Duty Schedule</h1>

      <div className="mt-6 grid gap-6 md:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view your duties</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                booked: scheduleDates,
              }}
              modifiersStyles={{
                booked: {
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  fontWeight: "bold",
                  color: "#3b82f6",
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Duties</CardTitle>
            <CardDescription>{date ? `Duties for ${format(date, "PPP")}` : "All upcoming duties"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>{format(new Date(schedule.date), "PPP")}</TableCell>
                      <TableCell>{schedule.shift}</TableCell>
                      <TableCell>{schedule.time}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      {date ? "No duties scheduled for this date." : "No upcoming duties."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Upcoming Duties</CardTitle>
          <CardDescription>Your next scheduled duties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules
              .filter((schedule) => new Date(schedule.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 4)
              .map((schedule, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {format(new Date(schedule.date), "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {schedule.shift} • {schedule.time}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

