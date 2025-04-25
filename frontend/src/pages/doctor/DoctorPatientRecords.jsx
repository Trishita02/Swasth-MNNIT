import { useEffect, useState } from "react";
import { Button } from "../../components/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx";
import { Input } from "../../components/Input.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/Tabs.jsx";
import { FileText, Search } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../utils/axios.jsx";

export default function PatientRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    API.get("/staff/getAllPatients")
      .then((res) => {
        if (res.data) {
          setPatients(res.data);
        } else {
          console.error("Failed to fetch patients:", res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
      });
  }, []);

  const filteredPatients = patients
    .filter((patient) => {
      if (!searchQuery) return true;
      
      const searchLower = searchQuery.toLowerCase();
      return (
        patient.name?.toLowerCase().includes(searchLower) ||
        patient.reg_no?.toLowerCase().includes(searchLower) ||
        patient.issue?.toLowerCase().includes(searchLower) ||
        patient.type?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => new Date(b.last_visit) - new Date(a.last_visit));

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patient Records</h1>
        <div className="relative w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or reg no."
            className="pl-10"
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

        {/* All Patients Tab */}
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
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No patients found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient) => (
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
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Student Patients Tab */}
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
                  {filteredPatients.filter((patient) => patient.type === "Student").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No students found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients
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
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Faculty Patients Tab */}
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
                  {filteredPatients.filter((patient) => patient.type === "Faculty").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No faculty found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients
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
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}