import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx"
import { Calendar, Clock, FileText, Users } from "lucide-react"
import { useEffect, useState } from "react"
import API from "../../utils/axios.jsx"

export default function DoctorDashboard() {
  const [recentPatients, setRecentPatients] = useState([]);
  const [upcomingDuties, setUpcomingDuties] = useState([]);
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await API.get("/doctor/recent-patients", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
        )
        // console.log(response.data);
        setRecentPatients(response.data.recentPatients);
        setUpcomingDuties(response.data.upcomingDuties);
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData();
  }, []);
  return (
    <>
      

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Patients you've seen recently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {patient.name} <span className="text-muted-foreground">({patient.reg_no})</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {patient.issue} • {patient.last_visit?.slice(0, 10)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Duties</CardTitle>
            <CardDescription>Your scheduled duties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDuties.map((duty, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{duty.date?.slice(0,10)}</p>
                    <p className="text-xs text-muted-foreground">Room: {duty.room}</p>
                    <p className="text-xs text-muted-foreground">Time: {duty.shift.start_time} - {duty.shift.end_time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

