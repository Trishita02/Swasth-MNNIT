import { useState } from "react"
import { Button } from "../../components/Button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx"
import { Input } from "../../components/Input.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/Select.jsx"
import { Calendar, Search, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/PopOver.jsx"
import { format } from "date-fns"
import { Badge } from "../../components/Badge.jsx"

export default function DoctorNotification() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterDate, setFilterDate] = useState(undefined)

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "System Maintenance",
      message: "The system will be down for maintenance on Saturday from 2 AM to 4 AM.",
      type: "system",
      date: "2025-03-30",
      read: false,
    },
    {
      id: 2,
      title: "Duty Schedule Updated",
      message: "The duty schedule for April has been updated. Please check your assignments.",
      type: "schedule",
      date: "2025-03-28",
      read: false,
    },
    {
      id: 3,
      title: "Staff Meeting",
      message: "There will be a staff meeting on Friday at 3 PM in the conference room.",
      type: "meeting",
      date: "2025-03-25",
      read: true,
    },
    {
      id: 4,
      title: "New Patient Guidelines",
      message: "New guidelines for patient intake have been published. Please review them before your next shift.",
      type: "policy",
      date: "2025-03-22",
      read: true,
    },
    {
      id: 5,
      title: "Medicine Stock Alert",
      message: "Paracetamol 500mg is running low on stock. Please prescribe alternatives if possible.",
      type: "medicine",
      date: "2025-03-20",
      read: false,
    },
  ])

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  // Filter notifications based on search query, type, and date
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by title
    const matchesTitle = notification.title.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by type
    const matchesType = filterType === "all" || notification.type === filterType

    // Filter by date
    const matchesDate = filterDate ? notification.date === format(filterDate, "yyyy-MM-dd") : true

    return matchesTitle && matchesType && matchesDate
  })

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const clearFilters = () => {
    setSearchQuery("")
    setFilterType("all")
    setFilterDate(undefined)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="schedule">Schedule</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="medicine">Medicine</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {filterDate ? format(filterDate, "PPP") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={filterDate} onSelect={setFilterDate} initialFocus />
              </PopoverContent>
            </Popover>

            {(searchQuery || filterType !== "all" || filterDate) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-3">
                Clear Filters
              </Button>
            )}
          </div>

          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            Mark All as Read
          </Button>
        </div>
      </div>

      {(searchQuery || filterType !== "all" || filterDate) && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="px-3 py-1">
              Search: {searchQuery}
              <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 p-0" onClick={() => setSearchQuery("")}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filterType !== "all" && (
            <Badge variant="secondary" className="px-3 py-1 capitalize">
              Type: {filterType}
              <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 p-0" onClick={() => setFilterType("all")}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filterDate && (
            <Badge variant="secondary" className="px-3 py-1">
              Date: {format(filterDate, "PPP")}
              <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 p-0" onClick={() => setFilterDate(undefined)}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            {unreadCount} Unread
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
            <CardDescription>
              {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.id} className={notification.read ? "" : "bg-blue-50"}>
                    <TableCell className="font-medium">{notification.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                    <TableCell className="capitalize">{notification.type}</TableCell>
                    <TableCell>{notification.date}</TableCell>
                    <TableCell>
                      {notification.read ? (
                        <Badge variant="outline" className="bg-gray-100">
                          Read
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Unread
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!notification.read && (
                        <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                          Mark as Read
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredNotifications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No notifications found matching the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

