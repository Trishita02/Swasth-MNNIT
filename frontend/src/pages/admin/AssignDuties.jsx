import React, { useState, useEffect } from "react";
import { Edit, Mail, Plus, Trash } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/Table.jsx";
import { ToastContainer } from 'react-toastify';
import { 
  sendDutyChartNowAPI,
  scheduleDutyChartAPI,
  getAllDutiesAPI,
  createDutyAPI,
  deleteDutyAPI,
  getAllUsersAPI,
  getDoctorsFromSpecializationAPI,
  getAllStaffAPI
} from "../../utils/api.jsx";
export default function AssignDuties() {
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [formDate, setFormDate] = useState(new Date());
  const [roleFilter, setRoleFilter] = useState('all');
  const [autoSendEnabled, setAutoSendEnabled] = useState(() => {
    const saved = localStorage.getItem('autoSendEnabled');
    return saved === 'true';
  });
  const [emailSent, setEmailSent] = useState(false);
  const [users, setUsers] = useState([]);
  const [emailTime, setEmailTime] = useState(() => {
    return localStorage.getItem('emailTime') || getCurrentTime();
  });
  const [schedules, setSchedules] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [editingSchedule, setEditingSchedule] = useState(null);
  //state for add duty loading
  const [isAddingDuty, setIsAddingDuty] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
const [dutyToDelete, setDutyToDelete] = useState(null);
  const [specializationList] = useState([
    "Dental",
    "Physiotherapist",
    "Neuro Physician",
    "Orthopedic",
    "Ayurvedic",
    "Homeopathic",
    "Gynecologist",
    "Pediatrician",
    "General Physician"
  ]);
  const [newSchedule, setNewSchedule] = useState({
    userId: "",
    role: "Doctor",
    name: "",
    specialization: "",
    startTime: "09:00",
    endTime: "17:00",
    date: new Date().toISOString(),
    room: ""
  });
  const [filteredUsers, setFilteredUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (newSchedule.role === "Doctor") {
          const doctors = await getDoctorsFromSpecializationAPI(newSchedule.specialization);
          setFilteredUsers(doctors.map(d => ({
            ...d,
            role: 'doctor' // Ensure role is set
          })));
        } else if (newSchedule.role === "Staff") {
          const staff = await getAllStaffAPI();
          setFilteredUsers(staff.map(s => ({
            ...s,
            role: 'staff' // Ensure role is set
          })));
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setFilteredUsers([]);
      }
    };
  
    fetchUsers();
  }, [newSchedule.role, newSchedule.specialization]);

  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  // Fetch all data from API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch duties and users in parallel
      const [dutiesData, usersData] = await Promise.all([
        getAllDutiesAPI(),
        getAllUsersAPI()
      ]);
      
      // Process duties
      setSchedules(Array.isArray(dutiesData) ? dutiesData : []);
      
      // Process users
      const usersArray = Array.isArray(usersData) ? usersData : [];
      setUsers(usersArray);
      
      // Extract unique specializations from doctors
      const doctorSpecializations = [...new Set(
        usersArray
          .filter(user => user?.role === "doctor")
          .map(doctor => doctor.specialization)
          .filter(Boolean)
      )];
      setSpecializations(doctorSpecializations);
      
      // Check if email was sent today
      const lastEmailDate = localStorage.getItem('lastEmailDate');
      const today = new Date().toDateString();
      setEmailSent(lastEmailDate === today);
      
    } catch (error) {
      toast.error("Failed to load data");
      console.error("Error fetching data:", error);
      setUsers([]);
      setSchedules([]);
      setSpecializations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Load saved states
    const savedEnabled = localStorage.getItem('autoSendEnabled') === 'true';
    const savedTime = localStorage.getItem('emailTime') || getCurrentTime();
    
    setAutoSendEnabled(savedEnabled);
    setEmailTime(savedTime);
  }, []);

  function formatTimeDisplay(startTime, endTime) {
    return `${startTime} - ${endTime}`;
  }

  // Filter schedules for the selected date
  const filteredSchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.date);
    return isSameDay(scheduleDate, date) && 
           (roleFilter === 'all' || schedule.role.toLowerCase() === roleFilter.toLowerCase());
  });

  const handleAddSchedule = async () => {
    if (!newSchedule.userId || !newSchedule.startTime || !newSchedule.endTime || 
        !newSchedule.date || !newSchedule.room) {
      toast.error("Please fill all required fields");
      return;
    }
    if (newSchedule.role === "Doctor" && !newSchedule.specialization) {
      toast.error("Please select a specialization for doctors");
      return;
    }
  
    const [sHour, sMin] = newSchedule.startTime.split(":").map(Number);
    const [eHour, eMin] = newSchedule.endTime.split(":").map(Number);
    
    const base = new Date(); // today’s date
    
    // Create Date objects
    const start = new Date(base);
    start.setHours(sHour, sMin, 0, 0);
    
    let end = new Date(base);
    end.setHours(eHour, eMin, 0, 0);
    
    // Check for same time
    if (start.getTime() === end.getTime()) {
      toast.error("Start time and end time cannot be the same");
      return;
    }
    
    // Check for invalid (non-overnight) backward times
    if (end < start) {
      const durationMinutes = (end.getTime() + 24 * 60 * 60 * 1000 - start.getTime()) / (1000 * 60);
    
      // Optional: prevent unrealistic long shifts (e.g., > 12h)
      if (durationMinutes > 720) {
        toast.error("Invalid time range: end time must be after start time or within valid shift duration");
        return;
      }
    
      // If shift duration is valid and crosses midnight → allow
    }
    
    try {
      setIsAddingDuty(true);
      
      // Find the user in filteredUsers instead of users
      const selectedUser = filteredUsers.find(u => u._id === newSchedule.userId);
      
      if (!selectedUser) {
        toast.error("Selected user not found");
        return;
      }
      const selectedDate = new Date(newSchedule.date);
    const localDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
      const dutyData = {
        userId: newSchedule.userId,
        role: newSchedule.role === "staff" ? "Staff" : newSchedule.role, // Ensure consistent role format
        name: selectedUser.name,
        specialization: selectedUser?.specialization || "",
        shift: {
          start_time: newSchedule.startTime,  
          end_time: newSchedule.endTime      
        },
        date: format(localDate, 'yyyy-MM-dd'), 
        room: newSchedule.room
      };
      const response = await createDutyAPI(dutyData);
      await fetchData();
      setNewSchedule({
        userId: "",
        role: "Doctor",
        name: "",
        specialization: "",
        startTime: "09:00",
        endTime: "17:00",
        date: new Date().toISOString(),
        room: ""
      });
      
      toast.success(`Duty for ${selectedUser.name} has been scheduled successfully`);
    } catch (error) {
      toast.error(error.message || "Failed to create duty");
    } finally {
      setIsAddingDuty(false);
    }
  };

  const handleDeleteClick = (dutyId) => {
    setDutyToDelete(dutyId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteSchedule = async () => {
    try {
      await deleteDutyAPI(dutyToDelete);
      await fetchData();
      toast.success("Duty deleted successfully");
      setIsDeleteDialogOpen(false);
      setDutyToDelete(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete duty");
    }
  };

  const handleSendDutyChart = async () => {
    try {
      setIsSending(true);
      const res = await sendDutyChartNowAPI();
      
      if(res.success === false){
        toast.error(res.message || "No duties scheduled for today");
        return;
      }
      
      localStorage.setItem('lastEmailDate', new Date().toDateString());
      setEmailSent(true);
      toast.success(`Duty chart has been emailed to all for ${format(date, "PPP")}`);
    } catch (error) {
      setEmailSent(false);
      toast.error(error.response?.data?.message || "Failed to send duty chart");
    } finally {
      setIsSending(false); 
    }
  };

  const handleScheduleChange = async () => {
    try {
      const response = await scheduleDutyChartAPI(
        autoSendEnabled,
        autoSendEnabled ? emailTime : null
      );
      
      toast.success(autoSendEnabled 
        ? `Emails scheduled for ${emailTime} daily`
        : 'Daily emails disabled');
        
      if (response.schedule?.time) {
        setEmailTime(response.schedule.time);
        localStorage.setItem('emailTime', response.schedule.time);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update schedule");
    }
  };

  const handleAutoSendToggle = async (checked) => {
    try {
      setAutoSendEnabled(checked);
      localStorage.setItem('autoSendEnabled', checked.toString());
      
      await scheduleDutyChartAPI(
        checked,
        checked ? emailTime : null
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update schedule");
      setAutoSendEnabled(!checked);
    }
  };


  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        
        {/* Control Panel */}
        <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleAutoSendToggle(!autoSendEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${autoSendEnabled ? "bg-black" : "bg-gray-300"}`}
                >
                  <span className={`absolute left-1 h-5 w-5 transform rounded-full bg-white shadow-lg transition
                    ${autoSendEnabled ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
                <label className="text-sm font-medium text-gray-900">
                  Send duty chart daily
                </label>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="email-time">Email Time:</Label>
                <Input
                  id="email-time"
                  type="time"
                  value={emailTime}
                  onChange={(e) => setEmailTime(e.target.value)}
                  className="w-24"
                  disabled={!autoSendEnabled}
                />
                <button
                  onClick={handleScheduleChange}
                  disabled={!autoSendEnabled}
                  className={`ml-2 px-3 py-1 rounded ${
                    autoSendEnabled 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Apply
                </button>
              </div>
            </div>
            
            {/* Send Email Button */}
            <Button 
              variant="outline" 
              onClick={handleSendDutyChart} 
              disabled={emailSent || isSending}
              className="w-full sm:w-auto"
            >
              {isSending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : emailSent ? (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Email Sent
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Today's Duty Chart
                </>
              )}
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
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Role Selection */}
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newSchedule.role}
                      onValueChange={(value) => {
                        setNewSchedule({ 
                          ...newSchedule, 
                          role: value,
                          specialization: value === "Staff" ? "" : newSchedule.specialization,
                          userId: "",
                          name: ""
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Doctor">Doctor</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Specialization (only for doctors) */}
                  {newSchedule.role === "Doctor" && (
  <div className="grid gap-2">
    <Label htmlFor="specialization">Specialization</Label>
    <Select
      value={newSchedule.specialization}
      onValueChange={(value) => {
        setNewSchedule({ 
          ...newSchedule, 
          specialization: value,
          userId: "",
          name: ""
        });
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select specialization" />
      </SelectTrigger>
      <SelectContent>
        {specializationList.map((spec) => (
          <SelectItem key={spec} value={spec}>
            {spec}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)}
                  {/* Name Selection */}
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Select
  value={newSchedule.userId}
  onValueChange={(userId) => {
    const selectedUser = filteredUsers.find(u => u._id === userId);
    if (selectedUser) {
      setNewSchedule({ 
        ...newSchedule, 
        userId: userId,
        name: selectedUser.name,
        specialization: selectedUser?.specialization || "",
        role: selectedUser.role === "doctor" ? "Doctor" : "Staff"
      });
    }
  }}
  disabled={newSchedule.role === "Doctor" && !newSchedule.specialization}
>
  <SelectTrigger>
    <SelectValue placeholder={
      newSchedule.role === "Doctor" && !newSchedule.specialization
        ? "Select specialization first"
        : `Select ${newSchedule.role.toLowerCase()}`
    } />
  </SelectTrigger>
  <SelectContent>
    {filteredUsers.map(user => (
      <SelectItem key={user._id} value={user._id}>
        {user.name} {user.specialization ? `(${user.specialization})` : ''}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
                  </div>

                  {/* Room Input */}
                  <div className="grid gap-2">
                    <Label htmlFor="room">Room</Label>
                    <Input
                      id="room"
                      value={newSchedule.room}
                      onChange={(e) => setNewSchedule({ ...newSchedule, room: e.target.value })}
                      placeholder="Enter room number"
                    />
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
                  
                  {/* Date Display */}
                  <div className="grid gap-2">
                    <Calendar 
                      selectedDate={formDate}
                      onDateChange={(date) => {
                        if (date) {
                          setFormDate(date);
                          setNewSchedule({ 
                            ...newSchedule, 
                            date: date.toISOString() 
                          });
                        }
                      }}
                      minDate={new Date()}
                    />
                  </div>
                </div>
                <DialogFooter>
  <Button 
    onClick={handleAddSchedule} 
    className="bg-blue-600 hover:bg-blue-700"
    disabled={isAddingDuty}
  >
    {isAddingDuty ? (
      <>
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Adding...
      </>
    ) : (
      "Add Duty"
    )}
  </Button>
</DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Calendar + Table Layout */}
      <div className="grid gap-6 md:grid-cols-[300px_1fr] lg:grid-cols-[300px_2fr]">
        {/* Calendar Card */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar 
              selectedDate={date} 
              onDateChange={(selectedDate) => {
                if (selectedDate) {
                  setDate(selectedDate);
                  setNewSchedule(prev => ({
                    ...prev,
                    date: selectedDate.toISOString()
                  }));
                }
              }}
              minDate={new Date()}
              disablePast={false}
            />
          </CardContent>
        </Card>

        {/* Schedule Table Card - Wider */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Duty Schedule</CardTitle>
              <CardDescription>
                {`Showing schedules for ${format(date, "PPP")}`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={roleFilter}
                onValueChange={(value) => setRoleFilter(value)}
              >
                <SelectTrigger className="w-[100px] h-8">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="Doctor">Doctors</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => {
                     const userName = schedule.user?.name || schedule.name;
                     const userSpecialization = schedule.user?.specialization || schedule.specialization;
                    return (
                      <TableRow key={schedule._id}>
                        <TableCell className="font-medium">
                        {userName}
          {schedule.role === "Doctor" && userSpecialization && (
            <span className="text-xs text-gray-500 block">
              {userSpecialization}
            </span>
          )}
                        </TableCell>
                        <TableCell className="capitalize">{schedule.role}</TableCell>
                        <TableCell>{schedule.room}</TableCell>
                        <TableCell>{formatTimeDisplay(schedule.start_time, schedule.end_time)}</TableCell>
                        <TableCell className="text-right space-x-2">
                          
                          
                          {/* Delete Button */}
                          <Button variant="ghost" size="icon" 
                              onClick={() => handleDeleteClick(schedule.id)}
                          >
                          <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                  {filteredSchedules.length === 0 && (
                    <TableRow>
                      <TableCell 
                        colSpan={roleFilter === 'Staff' ? 5 : 6} 
                        className="h-24 text-center text-gray-500"
                      >
                        No {roleFilter === 'all' ? '' : roleFilter + ' '}duties scheduled for {format(date, "PPP")}.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
        {/* Delete Confirmation Dialog */}
<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this duty schedule?
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
        onClick={handleDeleteSchedule}
      >
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}