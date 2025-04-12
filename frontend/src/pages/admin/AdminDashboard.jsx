import { Activity, Calendar, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx";
import { useState, useEffect } from "react";
import { getDashboardDetailsAPI } from "../../utils/api.jsx";
import { formatDistanceToNow } from 'date-fns';


function Dashboard() {
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [activityCount,setActivityCount] = useState(0);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getDashboardDetailsAPI();
        setTotalStaff(res.totalStaff);
        setTotalDoctors(res.totalDoctor);  
        setActivityCount(res.totalActivityToday);
        setActivities(res.latestActivities);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStaff}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDoctors}</div> {/* Dynamic Data */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activityCount}</div>
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
        {activities.length > 0 ? (
          activities.map((activity, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.name} <span className="text-gray-500">{activity.description}</span>
                </p>
                <p className="text-xs text-gray-500">
  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
</p>

              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No recent activities.</p>
        )}
      </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
