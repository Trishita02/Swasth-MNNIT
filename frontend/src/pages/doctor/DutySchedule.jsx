import { useState, useEffect } from "react"
import { Calendar } from "../../components/Calendar.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table.jsx"
import { Clock } from "lucide-react"
import { format } from "date-fns"
import API from "../../utils/axios.jsx"

export default function DutySchedule() {
  const [date, setDate] = useState(new Date())
  const [schedules, setSchedules] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const response = await API.get("/doctor/duty-schedule")
        console.log(response.data)
        setSchedules(response.data)
      } catch (error) {
        console.error("Error fetching duty schedules:", error)
      }
    })()
  }, [])

  // Filter function for upcoming duties (future dates only)
  const filterUpcomingSchedules = (data) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // normalize to start of today
    return data.filter((schedule) => {
      const scheduleDate = new Date(schedule.date)
      scheduleDate.setHours(0, 0, 0, 0)
      return scheduleDate >= today
    })
  }

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
                  <TableHead>Room</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.length > 0 ? (
                  schedules.map((schedule) => (
                    <TableRow key={schedule._id}>
                      <TableCell>{format(new Date(schedule.date), "PPP")}</TableCell>
                      <TableCell>{schedule.room}</TableCell>
                      <TableCell>{schedule.shift.start_time} - {schedule.shift.end_time}</TableCell>
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
            {filterUpcomingSchedules(schedules)
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 4)
              .map((schedule, i) => (
                <div key={schedule._id || i} className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {format(new Date(schedule.date), "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Room {schedule.room} • {schedule.shift.start_time} - {schedule.shift.end_time}
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
