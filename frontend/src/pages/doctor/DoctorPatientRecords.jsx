import { useEffect, useState } from "react"
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
import API from "../../utils/axios.jsx"

export default function DoctorPatientRecords() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDate, setFilterDate] = useState(undefined)
  const [filterDiagnosis, setFilterDiagnosis] = useState("")

  const [patients, setPatients] = useState([])

  useEffect(() => {
      API.get("/staff/getAllPatients")
        .then((res) => {
          if (res.data) {
            console.log(res.data)
            setPatients(res.data);
          } else {
            console.error("Failed to fetch patients:", res.data.message);
          }
        })
        .catch((error) => {
          console.error("Error fetching patients:", error);
        });
    }, []);

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

  const filteredPatients = patients
  .filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.regNo.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => new Date(b.last_visit) - new Date(a.last_visit));

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
                    
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient._id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.reg_no}</TableCell>
                      <TableCell>{patient.type}</TableCell>
                      
                      <TableCell>{patient.last_visit?.slice(0, 10)}</TableCell>
                      <TableCell>{patient.issue}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`history/${patient.reg_no}`}>
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
                    
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients
                    .filter((patient) => patient.type === "Student")
                    .map((patient) => (
                      <TableRow key={patient._id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.reg_no}</TableCell>
                        
                        <TableCell>{patient.last_visit?.slice(0, 10)}</TableCell>
                        <TableCell>{patient.issue}</TableCell>
                        <TableCell className="text-right">
                          <Link to={`history/${patient.reg_no}`}>
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
                    
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients
                    .filter((patient) => patient.type === "Faculty")
                    .map((patient) => (
                      <TableRow key={patient._id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.reg_no}</TableCell>
                        
                        <TableCell>{patient.last_visit?.slice(0, 10)}</TableCell>
                        <TableCell>{patient.issue}</TableCell>
                        <TableCell className="text-right">
                          <Link to={`history/${patient.reg_no}`}>
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

