import React, { useState, useEffect } from "react";
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
import { Calendar as CalendarIcon, Plus, Search, Trash, X } from "lucide-react";
import {Calendar} from "../../components/Calendar.jsx";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/PopOver.jsx";
import { format } from "date-fns";
import { deleteNotificationAPI, createNotificationAPI, getAllNotificationsAPI } from "../../utils/api.jsx";

function Notifications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRecipient, setFilterRecipient] = useState("all");
  const [filterDate, setFilterDate] = useState(undefined);
  const [notifications, setNotifications] = useState([]);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    recipients: "all",
  });

  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const fetchNotifications = async () => {
    try {
      const res = await getAllNotificationsAPI();
      setNotifications(res);  
    } catch (err) {
      toast.error("Failed to fetch notifications");
    }
  };

  const handleAddNotification = async () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
  
    try {
      await createNotificationAPI(newNotification);
      toast.success("Notification sent successfully");
      setNewNotification({ title: "", message: "", recipients: "all" });
      fetchNotifications();
      setTimeout(() => {
        document.querySelector("[data-state='open']")?.click();
      }, 800);
    } catch (err) {
      toast.error("Failed to send notification");
    }
  };

  const handleDeleteClick = (notification) => {
    setNotificationToDelete(notification);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteNotification = async () => {
    if (!notificationToDelete) return;
    
    try {
      console.log("Deleting notification with ID:", notificationToDelete._id || notificationToDelete.id);
      await deleteNotificationAPI(notificationToDelete._id || notificationToDelete.id);
      toast.success("Notification deleted successfully");
      fetchNotifications();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to delete notification");
    } finally {
      setIsDeleteDialogOpen(false);
      setNotificationToDelete(null);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    // Search by title
    const matchesTitle = notification.title.toLowerCase().includes(searchQuery.toLowerCase());
  
    // Recipient Filter
    let matchesRecipient = true;
    if (filterRecipient !== "all") {
      if (Array.isArray(notification.recipients)) {
        matchesRecipient = notification.recipients.length === 1 &&
                           notification.recipients[0] === filterRecipient;
      } else {
        matchesRecipient = notification.recipients === filterRecipient;
      }
    }
  
    // Date Filter (Proper handling)
    
    let matchesDate = true;
    if (filterDate) {
      const [day, month, year] = notification.date.split('/')
      const notificationDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      const selectedDate = format(filterDate, "yyyy-MM-dd");
      matchesDate = notificationDate === selectedDate;
    }
  
    return matchesTitle && matchesRecipient && matchesDate;
  });

  const clearFilters = () => {
    setFilterRecipient("all");
    setFilterDate(undefined);
  };

  return (
    <>
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
                <Calendar 
                  selectedDate={filterDate || null}
                  onDateChange={(selectedDate) => {
                    setFilterDate(selectedDate || undefined);
                  }}
                  disablePast={false}
                />
              </PopoverContent>
            </Popover>

            {(filterRecipient !== "all" || filterDate) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-3">
                Clear Filters
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
        <CardContent className="grid gap-4">
  {filteredNotifications.length > 0 ? (
    filteredNotifications.map((notification) => (
      <Card key={notification._id || notification.id} className="border shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold">{notification.title}</h3>
            <p className="text-sm text-muted-foreground">
              {notification.date} at {notification.time}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleDeleteClick(notification)}
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">{notification.message}</p>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Recipients:</span>{" "}
            {Array.isArray(notification.recipients) 
              ? notification.recipients.join(", ")
              : notification.recipients}
          </div>
        </CardContent>
      </Card>
    ))
  ) : (
    <div className="h-24 flex items-center justify-center text-muted-foreground text-sm">
      No notifications found matching the current filters.
    </div>
  )}
</CardContent>

      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this notification?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteNotification}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Notifications;