import React, { useState,useEffect } from "react";
import { Button } from "../../components/Button.jsx";
import { Calendar } from "../../components/Calendar.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx";
import { Input } from "../../components/Input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/Select.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table.jsx";
import { CalendarIcon, Search } from 'lucide-react';
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/PopOver.jsx";
import { fetchActivityLogsAPI } from "../../utils/api.jsx";

function ActivityLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activityType, setActivityType] = useState("all");
  const [date, setDate] = useState(undefined);

  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const getLogs = async () => {
      try {
        const data = await fetchActivityLogsAPI();
        setLogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching activity logs:", error);
      }
    };
    getLogs();
  }, []);

  // Safe filtering function
const filteredLogs = logs.filter((log) => {
  console.log(log.activity)
  // User search - handle both object and string cases
  const userString = typeof log.user === 'object' 
    ? `${log.user?.name || ''} ${log.user?.email || ''}`.toLowerCase()
    : String(log.user || '').toLowerCase();
  
  const matchesSearch = userString.includes(searchQuery.toLowerCase());

  // Activity type filtering - case insensitive
  const matchesActivity = activityType === "all" || 
    String(log?.activity || '').toLowerCase() === activityType.toLowerCase();

  // Date filtering
  let matchesDate = true;
  if (date && log?.timestamp) {
    try {
      const logDate = new Date(log.timestamp);
      matchesDate = logDate.toDateString() === date.toDateString();
    } catch (e) {
      console.error("Invalid date format in log:", log.timestamp);
      matchesDate = false;
    }
  }

  return matchesSearch && matchesActivity && matchesDate;
});

  // Safe rendering of log data
  const renderLogCell = (value, fallback = '-') => {
    return value || fallback;
  };
  // Add this utility function at the top of your file
// Add this utility function at the top of your file
const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return '-';
  }
};
  return (
    <>
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
  <SelectItem value="Login">Login</SelectItem>
  <SelectItem value="Logout">Logout</SelectItem>
  <SelectItem value="Password Change">Password Change</SelectItem>
  <SelectItem value="Prescription">Prescription</SelectItem>
  <SelectItem value="Patient Added">Patient Added</SelectItem>
  <SelectItem value="Medicine Added">Medicine Added</SelectItem>
  <SelectItem value="Medicine Updated">Medicine Updated</SelectItem>
  <SelectItem value="Medicine Deleted">Medicine Deleted</SelectItem>
</SelectContent>
        </Select>

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date ? format(date, "PPP") : <span>Filter date</span>}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar 
      selectedDate={date || null}  // Pass null instead of undefined
      onDateChange={(selectedDate) => {
        setDate(selectedDate || undefined);
      }}
      disablePast={false}
    />
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
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id || Math.random()}>
                  <TableCell className="font-medium">
                    {renderLogCell(log.user)}
                  </TableCell>
                  <TableCell>
                    {renderLogCell(log.email)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {renderLogCell(log.role)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {renderLogCell(log.activity)}
                  </TableCell>
                  <TableCell>
                    {renderLogCell(log.details)}
                  </TableCell>
                  <TableCell>
                  {formatDateTime(log.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No logs found matching the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

export default ActivityLogs;