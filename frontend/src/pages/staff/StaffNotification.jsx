import { useState, useEffect } from "react"
import { Button } from "../../components/Button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx"
import { Input } from "../../components/Input.jsx"
import { Calendar as CalendarIcon, Search, X, Bell, BellOff, MailOpen, Mail, AlertCircle, CalendarClock, ClipboardList, Pill, Settings } from "lucide-react"
import { Calendar } from "../../components/Calendar.jsx"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/PopOver.jsx"
import { format, formatDistanceToNow } from "date-fns"
import { Badge } from "../../components/Badge.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/Dialog.jsx"
import {getStaffNotificationsAPI,markStaffNotificationAsReadAPI,markAllStaffNotificationsAsReadAPI} from "../../utils/api.jsx"

export default function StaffNotification() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDate, setFilterDate] = useState(undefined)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [notifications, setNotifications] = useState([])
  
  // Parse date from "MM/DD/YYYY" format
  const parseNotificationDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getStaffNotificationsAPI()
        setNotifications(data)
      } catch (err) {
        console.error("Failed to fetch staff notifications:", err)
      }
    }
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id) => {
    try {
      // Update backend first
      await markStaffNotificationAsReadAPI(id);
      // Then update frontend state
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
      setSelectedNotification(null);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllStaffNotificationsAsReadAPI();
      setNotifications(notifications.map(notification => 
        ({ ...notification, read: true })
      ));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const toggleUnreadOnly = () => {
    setShowUnreadOnly(!showUnreadOnly)
  }

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      await handleMarkAsRead(notification.id);
    }
  };

  const getTypeIcon = (message) => {
    if (message.toLowerCase().includes("maintenance")) {
      return <Settings className="h-4 w-4" />
    } else if (message.toLowerCase().includes("schedule")) {
      return <CalendarClock className="h-4 w-4" />
    } else if (message.toLowerCase().includes("meeting")) {
      return <ClipboardList className="h-4 w-4" />
    } else if (message.toLowerCase().includes("policy")) {
      return <AlertCircle className="h-4 w-4" />
    } else if (message.toLowerCase().includes("medicine")) {
      return <Pill className="h-4 w-4" />
    } else {
      return <Mail className="h-4 w-4" />
    }
  }

  // Filter notifications based on search query, date, and read status
  const filteredNotifications = notifications.filter((notification) => {
    const notificationDate = parseNotificationDate(notification.date)
    const matchesTitle = notification.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDate = filterDate ? 
      format(notificationDate, "dd/MM/yyyy") === format(filterDate, "dd/MM/yyyy") : 
      true
    const matchesReadStatus = showUnreadOnly ? !notification.read : true
    
    return matchesTitle && matchesDate && matchesReadStatus
  })

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const clearFilters = () => {
    setSearchQuery("")
    setFilterDate(undefined)
    setShowUnreadOnly(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={showUnreadOnly ? "default" : "outline"} 
            onClick={toggleUnreadOnly}
            className="flex gap-2"
          >
            {showUnreadOnly ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
            {showUnreadOnly ? "Show All" : "Unread Only"}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleMarkAllAsRead} 
            disabled={unreadCount === 0}
            className="flex gap-2"
          >
            <MailOpen className="h-4 w-4" />
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              className="pl-9 pr-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-9"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

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
                  setFilterDate(selectedDate || undefined)
                }}
                disablePast={false}
              />
            </PopoverContent>
          </Popover>

          {(searchQuery || filterDate || showUnreadOnly) && (
            <Button variant="ghost" onClick={clearFilters} className="h-10">
              Clear Filters
            </Button>
          )}
        </div>

        {(searchQuery || filterDate || showUnreadOnly) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="px-3 py-1">
                Search: {searchQuery}
                <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 p-0" onClick={() => setSearchQuery("")}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {filterDate && (
              <Badge variant="secondary" className="px-3 py-1">
                Date: {format(filterDate, "MMM dd, yyyy")}
                <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 p-0" onClick={() => setFilterDate(undefined)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {showUnreadOnly && (
              <Badge variant="secondary" className="px-3 py-1">
                Showing: Unread Only
                <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 p-0" onClick={() => setShowUnreadOnly(false)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Notifications Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredNotifications.length} of {notifications.length} notifications
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 bg-blue-50 text-blue-700">
            {unreadCount} Unread
          </Badge>
        </div>
      </div>

      {/* Notifications List */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Notifications</CardTitle>
              <CardDescription>
                {filteredNotifications.length === 0 ? "No notifications" : 
                 `Showing ${filteredNotifications.length} notification${filteredNotifications.length !== 1 ? 's' : ''}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MailOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No notifications found</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {searchQuery || filterDate || showUnreadOnly 
                  ? "Try adjusting your filters or search query" 
                  : "You're all caught up! No new notifications."}
              </p>
              {(searchQuery || filterDate || showUnreadOnly) && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => {
                const notificationDate = parseNotificationDate(notification.date)
                
                return (
                  <div 
                    key={notification.id} 
                    className={`p-4 gap-y-7 hover:bg-gray-50 cursor-pointer transition-all ${!notification.read ? 'bg-blue-50' : ''} mb-4 shadow-sm rounded-lg`} 
                    onClick={() => handleNotificationClick(notification)}
                  >             
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-2 rounded-full ${!notification.read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                        {getTypeIcon(notification.message)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium truncate ${!notification.read ? 'text-blue-900 font-semibold' : 'text-gray-800'}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${!notification.read ? 'text-blue-700 font-medium' : 'text-muted-foreground'}`}>
                              {formatDistanceToNow(notificationDate, { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm mt-1 line-clamp-2 ${!notification.read ? 'text-blue-800' : 'text-muted-foreground'}`}>
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {format(notificationDate, 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Detail Dialog */}
      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selectedNotification && (() => {
            const notificationDate = parseNotificationDate(selectedNotification.date)
            
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {getTypeIcon(selectedNotification.message)}
                    {selectedNotification.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {format(notificationDate, 'MMMM dd, yyyy')}
                    </span>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-line">{selectedNotification.message}</p>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setSelectedNotification(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}