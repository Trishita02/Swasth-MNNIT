import React, { useState, useEffect } from "react";
import { Edit, Mail, Plus, Trash } from "lucide-react";
import { format, isSameDay } from "date-fns";

import { Button } from "../../components/Button.jsx";
import { Calendar } from "../../components/Calendar.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/Card.jsx";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/Select.jsx";
import { Switch } from "../../components/Switch.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/Table.jsx";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AssignDuties() {
  const [date, setDate] = useState(new Date());
  const [autoSendEnabled, setAutoSendEnabled] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailTime, setEmailTime] = useState("08:00");

  const [schedules, setSchedules] = useState([
    { id: 1, name: "Dr. Sharma", role: "doctor", shift: "Morning", startTime: "09:00", endTime: "13:00", date: format(new Date(), "yyyy-MM-dd") },
    { id: 2, name: "Dr. Kumar", role: "doctor", shift: "Evening", startTime: "13:00", endTime: "17:00", date: format(new Date(), "yyyy-MM-dd") },
    { id: 3, name: "Admin User", role: "admin", shift: "Full Day", startTime: "09:00", endTime: "17:00", date: format(new Date(), "yyyy-MM-dd") },
    { id: 4, name: "Nurse Patel", role: "staff", shift: "Evening", startTime: "17:00", endTime: "21:00", date: format(new Date(new Date().setDate(new Date().getDate() + 1)), "yyyy-MM-dd") },
  ]);

  const [editingSchedule, setEditingSchedule] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    role: "doctor",
    shift: "Morning",
    startTime: "09:00",
    endTime: "17:00",
    date: format(new Date(), "yyyy-MM-dd"),
  });

  // Format time for display in table
  const formatTimeDisplay = (startTime, endTime) => {
    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  // Filter schedules for the selected date
  const filteredSchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.date);
    return isSameDay(scheduleDate, date);
  });

  const handleAddSchedule = () => {
    if (!newSchedule.name || !newSchedule.startTime || !newSchedule.endTime) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate time
    if (newSchedule.startTime >= newSchedule.endTime) {
      toast.error("End time must be after start time");
      return;
    }

    const newScheduleItem = {
      id: schedules.length + 1,
      ...newSchedule,
      date: format(date, "yyyy-MM-dd"),
    };

    setSchedules([...schedules, newScheduleItem]);
    setNewSchedule({
      name: "",
      role: "doctor",
      shift: "Morning",
      startTime: "09:00",
      endTime: "17:00",
      date: format(new Date(), "yyyy-MM-dd"),
    });

    toast.success(`Duty for ${newSchedule.name} has been scheduled successfully`);
  };

  const handleUpdateSchedule = () => {
    if (!editingSchedule) return;

    // Validate time
    if (editingSchedule.startTime >= editingSchedule.endTime) {
      toast.error("End time must be after start time");
      return;
    }

    setSchedules(schedules.map(schedule => 
      schedule.id === editingSchedule.id ? editingSchedule : schedule
    ));

    setEditingSchedule(null);
    toast.success("Duty updated successfully");
  };

  const handleDeleteSchedule = (id) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
    toast.success("Duty deleted successfully");
  };

  const handleSendDutyChart = () => {
    setEmailSent(true);
    toast.success(`Duty chart has been emailed to all staff for ${format(date, "PPP")}`);
  };

  // Reset email sent status when date changes
  useEffect(() => {
    setEmailSent(false);
  }, [date]);

  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        
        {/* Control Panel */}
        <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Auto Send Toggle */}
            <div className="flex items-center gap-2">
              <Switch 
                id="auto-send" 
                checked={autoSendEnabled} 
                onCheckedChange={setAutoSendEnabled}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out
                  ${autoSendEnabled ? 'bg-black' : 'bg-gray-400'}`}
              >
              <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out
            ${autoSendEnabled ? 'translate-x-5' : 'translate-x-0'}`}
        />
        </Switch>
              <Label htmlFor="auto-send">Send duty chart daily</Label>
            </div>
            
            {/* Email Time Input */}
            <div className="flex items-center gap-2">
              <Label htmlFor="email-time">Email Time:</Label>
              <Input
                id="email-time"
                type="time"
                value={emailTime}
                onChange={(e) => setEmailTime(e.target.value)}
                className="w-24"
              />
            </div>
            
            {/* Send Email Button */}
            <Button 
              variant="outline" 
              onClick={handleSendDutyChart} 
              disabled={emailSent || filteredSchedules.length === 0}
              className="w-full sm:w-auto"
            >
              <Mail className="mr-2 h-4 w-4" />
              {emailSent ? "Email Sent" : "Send Today's Duty Chart"}
            </Button>
            
            {/* Add Duty Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" /> Add Duty
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Duty</DialogTitle>
                  <DialogDescription>Schedule a duty for staff member.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Role Selection */}
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newSchedule.role}
                      onValueChange={(value) => setNewSchedule({ ...newSchedule, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Name Selection */}
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Select
                      value={newSchedule.name}
                      onValueChange={(value) => setNewSchedule({ ...newSchedule, name: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        {newSchedule.role === "doctor" && (
                          <>
                            <SelectItem value="Dr. Sharma">Dr. Sharma</SelectItem>
                            <SelectItem value="Dr. Kumar">Dr. Kumar</SelectItem>
                            <SelectItem value="Dr. Gupta">Dr. Gupta</SelectItem>
                          </>
                        )}
                        {newSchedule.role === "admin" && (
                          <SelectItem value="Admin User">Admin User</SelectItem>
                        )}
                        {newSchedule.role === "staff" && (
                          <>
                            <SelectItem value="Nurse Patel">Nurse Patel</SelectItem>
                            <SelectItem value="Nurse Singh">Nurse Singh</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Shift Selection */}
                  <div className="grid gap-2">
                    <Label htmlFor="shift">Shift</Label>
                    <Select
                      value={newSchedule.shift}
                      onValueChange={(value) => setNewSchedule({ ...newSchedule, shift: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Evening">Evening</SelectItem>
                        <SelectItem value="Full Day">Full Day</SelectItem>
                        <SelectItem value="Night">Night</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Time Input - Split into Start and End */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start-time">Start Time</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={newSchedule.startTime}
                        onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="end-time">End Time</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={newSchedule.endTime}
                        onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  {/* Date Display (read-only since we're using calendar selection) */}
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="text"
                      value={format(date, "PPP")}
                      readOnly
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddSchedule} className="bg-blue-600 hover:bg-blue-700">
                    Add Duty
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Calendar + Table Layout */}
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Calendar Card */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar 
              mode="single" 
              selected={date} 
              onSelect={setDate} 
              className="rounded-md border"
              disabled={{ before: new Date() }} // Disable past dates
            />
          </CardContent>
        </Card>

        {/* Schedule Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>Duty Schedule</CardTitle>
            <CardDescription>
              {filteredSchedules.length > 0 
                ? `Showing schedules for ${format(date, "PPP")}`
                : "No schedules for selected date"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.name}</TableCell>
                    <TableCell className="capitalize">{schedule.role}</TableCell>
                    <TableCell>{schedule.shift}</TableCell>
                    <TableCell>{formatTimeDisplay(schedule.startTime, schedule.endTime)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {/* Edit Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setEditingSchedule({...schedule})}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Duty</DialogTitle>
                            <DialogDescription>Update the duty schedule.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {/* Role Selection */}
                            <div className="grid gap-2">
                              <Label>Role</Label>
                              <Select
                                value={editingSchedule?.role || schedule.role}
                                onValueChange={(value) => setEditingSchedule({ 
                                  ...(editingSchedule || schedule), 
                                  role: value 
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="doctor">Doctor</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="staff">Staff</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Name Selection */}
                            <div className="grid gap-2">
                              <Label>Name</Label>
                              <Select
                                value={editingSchedule?.name || schedule.name}
                                onValueChange={(value) => setEditingSchedule({ 
                                  ...(editingSchedule || schedule), 
                                  name: value 
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select staff member" />
                                </SelectTrigger>
                                <SelectContent>
                                  {(editingSchedule?.role || schedule.role) === "doctor" && (
                                    <>
                                      <SelectItem value="Dr. Sharma">Dr. Sharma</SelectItem>
                                      <SelectItem value="Dr. Kumar">Dr. Kumar</SelectItem>
                                      <SelectItem value="Dr. Gupta">Dr. Gupta</SelectItem>
                                    </>
                                  )}
                                  {(editingSchedule?.role || schedule.role) === "admin" && (
                                    <SelectItem value="Admin User">Admin User</SelectItem>
                                  )}
                                  {(editingSchedule?.role || schedule.role) === "staff" && (
                                    <>
                                      <SelectItem value="Nurse Patel">Nurse Patel</SelectItem>
                                      <SelectItem value="Nurse Singh">Nurse Singh</SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Shift Selection */}
                            <div className="grid gap-2">
                              <Label>Shift</Label>
                              <Select
                                value={editingSchedule?.shift || schedule.shift}
                                onValueChange={(value) => setEditingSchedule({ 
                                  ...(editingSchedule || schedule), 
                                  shift: value 
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select shift" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Morning">Morning</SelectItem>
                                  <SelectItem value="Evening">Evening</SelectItem>
                                  <SelectItem value="Full Day">Full Day</SelectItem>
                                  <SelectItem value="Night">Night</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Time Input - Split into Start and End */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label>Start Time</Label>
                                <Input
                                  type="time"
                                  value={editingSchedule?.startTime || schedule.startTime}
                                  onChange={(e) => setEditingSchedule({ 
                                    ...(editingSchedule || schedule), 
                                    startTime: e.target.value 
                                  })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>End Time</Label>
                                <Input
                                  type="time"
                                  value={editingSchedule?.endTime || schedule.endTime}
                                  onChange={(e) => setEditingSchedule({ 
                                    ...(editingSchedule || schedule), 
                                    endTime: e.target.value 
                                  })}
                                />
                              </div>
                            </div>
                            
                            {/* Date Display */}
                            <div className="grid gap-2">
                              <Label>Date</Label>
                              <Input
                                type="text"
                                value={format(new Date(editingSchedule?.date || schedule.date), "PPP")}
                                readOnly
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              onClick={handleUpdateSchedule} 
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Update Duty
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      {/* Delete Button */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredSchedules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      No duties scheduled for {format(date, "PPP")}.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}