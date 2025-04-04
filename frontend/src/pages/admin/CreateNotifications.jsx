import React, { useState } from "react";
import { Button } from "../../components/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/Dialog.jsx";
import { Input } from "../../components/Input.jsx";
import { Label } from "../../components/Label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/Select.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table.jsx";
import { Textarea } from "../../components/TextArea.jsx";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import { Calendar as CalendarIcon, Plus, Search, Trash, X } from "lucide-react";
import {Calendar} from "../../components/Calendar.jsx";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/PopOver.jsx";
import { format } from "date-fns";

function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRecipient, setFilterRecipient] = useState("all");
  const [filterDate, setFilterDate] = useState(undefined);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "System Maintenance",
      message: "The system will be down for maintenance on Saturday from 2 AM to 4 AM.",
      recipients: "all",
      date: "2025-03-30",
    },
    {
      id: 2,
      title: "New Medicine Stock",
      message: "New stock of antibiotics has arrived. Please update the inventory.",
      recipients: "staff",
      date: "2025-03-29",
    },
    {
      id: 3,
      title: "Duty Schedule Updated",
      message: "The duty schedule for April has been updated. Please check your assignments.",
      recipients: "doctor",
      date: "2025-03-28",
    },
    {
      id: 4,
      title: "Staff Meeting",
      message: "There will be a staff meeting on Friday at 3 PM in the conference room.",
      recipients: "staff",
      date: "2025-03-25",
    },
  ]);

  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    recipients: "all",
  });

  const handleAddNotification = () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    setNotifications([
      ...notifications,
      {
        id: notifications.length + 1,
        title: newNotification.title,
        message: newNotification.message,
        recipients: newNotification.recipients,
        date: new Date().toISOString().split("T")[0],
      },
    ]);

    setNewNotification({
      title: "",
      message: "",
      recipients: "all",
    });

    toast.success("Notification sent successfully");
    setTimeout(() => {
        document.querySelector("[data-state='open']")?.click();
      },800);
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
    toast.success("Notification deleted successfully");
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesTitle = notification.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRecipient = filterRecipient === "all" || notification.recipients === filterRecipient;
    const matchesDate = filterDate ? notification.date === format(filterDate, "yyyy-MM-dd") : true;

    return matchesTitle && matchesRecipient && matchesDate;
  });

  const clearFilters = () => {
    setFilterRecipient("all");
    setFilterDate(undefined);
  };

  return (
    <DashboardLayout role="admin">
        <ToastContainer />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title"
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

            <Select value={filterRecipient} onValueChange={setFilterRecipient}>
              <SelectTrigger className="!w-[150px]">
                <SelectValue placeholder="Recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Recipients</SelectItem>
                <SelectItem value="doctor">Doctors Only</SelectItem>
                <SelectItem value="staff">Staff Only</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filterDate ? format(filterDate, "PPP") : <span>Filter by date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
              <Calendar selectedDate={filterDate} onDateChange={setFilterDate} />
              </PopoverContent>
            </Popover>

            {(filterRecipient !== "all" || filterDate) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-3">
                Clear Date
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? "s" : ""} found
          </CardDescription>
        </div>
        <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Create Notification
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Notification</DialogTitle>
          <DialogDescription>
            Create a notification to send to staff and doctors.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newNotification.title}
              onChange={(e) =>
                setNewNotification({ ...newNotification, title: e.target.value })
              }
              placeholder="Enter notification title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={newNotification.message}
              onChange={(e) =>
                setNewNotification({ ...newNotification, message: e.target.value })
              }
              placeholder="Enter notification message"
              rows={4}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="recipients">Recipients</Label>
            <Select
              value={newNotification.recipients}
              onValueChange={(value) =>
                setNewNotification({ ...newNotification, recipients: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="doctor">Doctors Only</SelectItem>
                <SelectItem value="staff">Staff Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleAddNotification}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Send Notification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                  <TableCell className="capitalize">{notification.recipients}</TableCell>
                  <TableCell>{notification.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteNotification(notification.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredNotifications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No notifications found matching the current filters.
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

export default NotificationsPage;