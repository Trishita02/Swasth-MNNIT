import { useState } from "react"
import { Button } from "../../components/Button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx"
import { Input } from "../../components/Input.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/Tabs.jsx"
import { FileText,Calendar as CalendarIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/Select.jsx"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/PopOver.jsx"
import { Calendar } from "../../components/Calendar.jsx"
import { format } from "date-fns"
import { Link } from "react-router-dom"

export default function DoctorPatientRecords() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDate, setFilterDate] = useState(undefined)
  const [filterDiagnosis, setFilterDiagnosis] = useState("")

  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      regNo: "BT21CS001",
      type: "Student",
      department: "Computer Science",
      lastVisit: "2025-03-30",
      diagnosis: "Viral Fever",
    },
    {
      id: 2,
      name: "Priya Singh",
      regNo: "BT21EC045",
      type: "Student",
      department: "Electronics",
      lastVisit: "2025-03-29",
      diagnosis: "Migraine",
    },
    {
      id: 3,
      name: "Amit Kumar",
      regNo: "BT20ME032",
      type: "Student",
      department: "Mechanical",
      lastVisit: "2025-03-28",
      diagnosis: "Ankle Sprain",
    },
    {
      id: 4,
      name: "Neha Gupta",
      regNo: "BT22CS078",
      type: "Student",
      department: "Computer Science",
      lastVisit: "2025-03-27",
      diagnosis: "Cold & Cough",
    },
    {
      id: 5,
      name: "Dr. Rajesh Verma",
      regNo: "FAC001",
      type: "Faculty",
      department: "Physics",
      lastVisit: "2025-03-25",
      diagnosis: "Back Pain",
    },
  ])

  // List of diagnoses for filtering
  const diagnosesList = [
    "Viral Fever",
    "Migraine",
    "Ankle Sprain",
    "Cold & Cough",
    "Back Pain",
    "Allergic Rhinitis",
    "Gastritis",
  ]

  const filteredPatients = patients.filter((patient) => {
    // Filter by registration number
    const matchesSearch = patient.regNo.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by date
    const matchesDate = filterDate ? patient.lastVisit === format(filterDate, "yyyy-MM-dd") : true

    // Filter by diagnosis
    const matchesDiagnosis = filterDiagnosis ? patient.diagnosis === filterDiagnosis : true

    return matchesSearch && matchesDate && matchesDiagnosis
  })

  return (
    <>
      <div className="flex items-center justify-between">
        
        <h1 className="text-2xl font-bold">Patient Records</h1>
        <div className="flex gap-2 ">
          <Input
            placeholder="Search by Reg. No."
            className="w-48"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="max-w-36 justify-start text-left font-normal">
                  <CalendarIcon className=" h-4 w-4" />
                  {filterDate ? format(filterDate, "PPP") : <span>Filter by date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
              <Calendar 
                    selectedDate={filterDate || null}  // Pass null instead of undefined
                    onDateChange={(selectedDate) => {
                      setFilterDate(selectedDate || undefined);
                    }}
                    disablePast={false}
                  />
              </PopoverContent>
            </Popover>

          <Select value={filterDiagnosis} onValueChange={setFilterDiagnosis}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by diagnosis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Diagnoses</SelectItem>
              {diagnosesList.map((diagnosis) => (
                <SelectItem key={diagnosis} value={diagnosis}>
                  {diagnosis}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All Patients</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Patients</CardTitle>
              <CardDescription>View and manage all patient records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Reg No.</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.regNo}</TableCell>
                      <TableCell>{patient.type}</TableCell>
                      <TableCell>{patient.department}</TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>{patient.diagnosis}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`history/${patient.regNo}`}>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" /> View History
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPatients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No patients found matching the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Patients</CardTitle>
              <CardDescription>View and manage student patient records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Reg No.</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients
                    .filter((patient) => patient.type === "Student")
                    .map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.regNo}</TableCell>
                        <TableCell>{patient.department}</TableCell>
                        <TableCell>{patient.lastVisit}</TableCell>
                        <TableCell>{patient.diagnosis}</TableCell>
                        <TableCell className="text-right">
                          <Link to={`history/${patient.regNo}`}>
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" /> View History
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredPatients.filter((patient) => patient.type === "Student").length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No student patients found matching the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="faculty">
          <Card>
            <CardHeader>
              <CardTitle>Faculty Patients</CardTitle>
              <CardDescription>View and manage faculty patient records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Reg No.</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients
                    .filter((patient) => patient.type === "Faculty")
                    .map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.regNo}</TableCell>
                        <TableCell>{patient.department}</TableCell>
                        <TableCell>{patient.lastVisit}</TableCell>
                        <TableCell>{patient.diagnosis}</TableCell>
                        <TableCell className="text-right">
                          <Link to={`history/${patient.regNo}`}>
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" /> View History
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredPatients.filter((patient) => patient.type === "Faculty").length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No faculty patients found matching the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

