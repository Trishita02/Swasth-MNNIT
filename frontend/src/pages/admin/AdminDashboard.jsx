import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import { Activity, Calendar, Clock, Users } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardLayout role="admin">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Logs</CardTitle>
              <CardDescription>Latest system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: "Dr. Sharma", action: "Logged in", time: "10 minutes ago" },
                  { user: "Admin", action: "Updated staff schedule", time: "1 hour ago" },
                  { user: "Nurse Patel", action: "Added new medicine stock", time: "2 hours ago" },
                  { user: "Dr. Kumar", action: "Created prescription", time: "3 hours ago" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.user} <span className="text-gray-500">{activity.action}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Today's Duty Schedule</CardTitle>
              <CardDescription>Staff and doctors on duty today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Dr. Sharma", role: "General Physician", time: "9:00 AM - 1:00 PM" },
                  { name: "Dr. Kumar", role: "Orthopedic", time: "1:00 PM - 5:00 PM" },
                  { name: "Nurse Patel", role: "Staff Nurse", time: "9:00 AM - 5:00 PM" },
                  { name: "Nurse Singh", role: "Staff Nurse", time: "5:00 PM - 9:00 PM" },
                ].map((duty, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{duty.name}</p>
                      <p className="text-xs text-gray-500">
                        {duty.role} • {duty.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </div>
  );
}
