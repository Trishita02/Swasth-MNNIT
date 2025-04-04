import { useState } from "react"
import { Button } from "../../components/Button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx"
import { Input } from "../../components/Input.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/Tabs.jsx"
import { FileText, Search } from "lucide-react"

export default function PatientRecords() {
  const [searchQuery, setSearchQuery] = useState("")
  const [patients, setPatients] = useState([
    { id: 1, name: "Rahul Sharma", regNo: "BT21CS001", type: "Student", lastVisit: "2025-03-30", issue: "Fever" },
    { id: 2, name: "Priya Singh", regNo: "BT21EC045", type: "Student", lastVisit: "2025-03-29", issue: "Headache" },
    { id: 3, name: "Amit Kumar", regNo: "BT20ME032", type: "Student", lastVisit: "2025-03-28", issue: "Sprain" },
    { id: 4, name: "Neha Gupta", regNo: "BT22CS078", type: "Student", lastVisit: "2025-03-27", issue: "Cold & Cough" },
    { id: 5, name: "Dr. Rajesh Verma", regNo: "FAC001", type: "Faculty", lastVisit: "2025-03-25", issue: "Back Pain" },
  ])

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.regNo.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patient Records</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or reg no."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                    <TableHead>Issue</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.regNo}</TableCell>
                      <TableCell>{patient.type}</TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>{patient.issue}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" /> View History
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                    <TableHead>Issue</TableHead>
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
                        <TableCell>{patient.lastVisit}</TableCell>
                        <TableCell>{patient.issue}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" /> View History
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
                    <TableHead>Issue</TableHead>
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
                        <TableCell>{patient.lastVisit}</TableCell>
                        <TableCell>{patient.issue}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" /> View History
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

