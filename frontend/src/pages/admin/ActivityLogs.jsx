import React, { useState } from "react";
import { Button } from "../../components/Button.jsx";
import { Calendar } from "../../components/Calendar.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx";
import { Input } from "../../components/Input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/Select.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table.jsx";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import { CalendarIcon, Search } from 'lucide-react';
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/PopOver.jsx";

function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activityType, setActivityType] = useState("all");
  const [date, setDate] = useState(undefined);

  const [logs, setLogs] = useState([
    {
      id: 1,
      user: "Dr. Sharma",
      role: "doctor",
      activity: "login",
      details: "Logged into the system",
      timestamp: "2025-03-31T09:15:00",
    },
    {
      id: 2,
      user: "Admin",
      role: "admin",
      activity: "update",
      details: "Updated staff schedule",
      timestamp: "2025-03-31T10:30:00",
    },
    {
      id: 3,
      user: "Nurse Patel",
      role: "staff",
      activity: "medicine",
      details: "Added new medicine stock",
      timestamp: "2025-03-31T11:45:00",
    },
    {
      id: 4,
      user: "Dr. Kumar",
      role: "doctor",
      activity: "prescription",
      details: "Created prescription for Rahul Sharma",
      timestamp: "2025-03-31T12:20:00",
    },
    {
      id: 5,
      user: "Nurse Singh",
      role: "staff",
      activity: "prescription",
      details: "Marked prescription as completed",
      timestamp: "2025-03-31T13:10:00",
    },
    {
      id: 6,
      user: "Admin",
      role: "admin",
      activity: "user",
      details: "Added new staff member",
      timestamp: "2025-03-31T14:05:00",
    },
    {
      id: 7,
      user: "Dr. Sharma",
      role: "doctor",
      activity: "logout",
      details: "Logged out of the system",
      timestamp: "2025-03-31T15:30:00",
    },
  ]);

  // Filter logs based on search query, activity type, and date
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActivity = activityType === "all" || log.activity === activityType;
    const matchesDate = date ? new Date(log.timestamp).toDateString() === date.toDateString() : true;

    return matchesSearch && matchesActivity && matchesDate;
  });

  return (
    <DashboardLayout role="admin">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Activity Logs</h1>
        <div className="flex items-center gap-2">
          <div className="relative w-50">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
        <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger className="!w-[120px]">
                <SelectValue placeholder="Activity type" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="login">Login</SelectItem>
            <SelectItem value="logout">Logout</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="medicine">Medicine</SelectItem>
            <SelectItem value="prescription">Prescription</SelectItem>
            <SelectItem value="user">User Management</SelectItem>
            </SelectContent>
        </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Filter by date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
            <Calendar selectedDate={date} onDateChange={setDate} />
            </PopoverContent>
          </Popover>
          
          {date && (
            <Button variant="ghost" size="sm" onClick={() => setDate(undefined)}>
              Clear Date
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell className="capitalize">{log.role}</TableCell>
                  <TableCell className="capitalize">{log.activity}</TableCell>
                  <TableCell>{log.details}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No logs found matching the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default LogsPage;