import { useState } from "react"
import { Button } from "../../components/Button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/Dialog.jsx"
import { Input } from "../../components/Input.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/Tabs.jsx"
import { FileText, QrCode, Search } from "lucide-react"

export default function StaffPrescriptions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: "Rahul Sharma",
      regNo: "BT21CS001",
      date: "2025-03-30",
      doctor: "Dr. Kumar",
      diagnosis: "Viral Fever",
      status: "Completed",
    },
    {
      id: 2,
      patientName: "Priya Singh",
      regNo: "BT21EC045",
      date: "2025-03-29",
      doctor: "Dr. Sharma",
      diagnosis: "Migraine",
      status: "Pending",
    },
    {
      id: 3,
      patientName: "Amit Kumar",
      regNo: "BT20ME032",
      date: "2025-03-28",
      doctor: "Dr. Kumar",
      diagnosis: "Ankle Sprain",
      status: "Pending",
    },
  ])

  const handleMarkAsCompleted = (id) => {
    setPrescriptions(
      prescriptions.map((prescription) =>
        prescription.id === id ? { ...prescription, status: "Completed" } : prescription,
      ),
    )
  }

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.regNo.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prescriptions</h1>
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

      <Tabs defaultValue="pending" className="mt-6">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Prescriptions</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Prescriptions</CardTitle>
              <CardDescription>Prescriptions waiting for pickup</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Reg No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrescriptions
                    .filter((prescription) => prescription.status === "Pending")
                    .map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell className="font-medium">{prescription.patientName}</TableCell>
                        <TableCell>{prescription.regNo}</TableCell>
                        <TableCell>{prescription.date}</TableCell>
                        <TableCell>{prescription.doctor}</TableCell>
                        <TableCell>{prescription.diagnosis}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <QrCode className="mr-2 h-4 w-4" /> QR Code
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Prescription QR Code</DialogTitle>
                                <DialogDescription>
                                  Scan this QR code to mark the prescription as completed.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex flex-col items-center justify-center p-6">
                                <div className="h-48 w-48 bg-gray-200 flex items-center justify-center">
                                  <QrCode className="h-32 w-32 text-gray-500" />
                                </div>
                                <p className="mt-4 text-sm text-center">
                                  Prescription for {prescription.patientName} ({prescription.regNo})
                                </p>
                                <Button
                                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handleMarkAsCompleted(prescription.id)}
                                >
                                  Mark as Completed
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm" className="ml-2">
                            <FileText className="mr-2 h-4 w-4" /> View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Prescriptions</CardTitle>
              <CardDescription>Prescriptions that have been picked up</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Reg No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrescriptions
                    .filter((prescription) => prescription.status === "Completed")
                    .map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell className="font-medium">{prescription.patientName}</TableCell>
                        <TableCell>{prescription.regNo}</TableCell>
                        <TableCell>{prescription.date}</TableCell>
                        <TableCell>{prescription.doctor}</TableCell>
                        <TableCell>{prescription.diagnosis}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" /> View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Prescriptions</CardTitle>
              <CardDescription>View all prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Reg No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell className="font-medium">{prescription.patientName}</TableCell>
                      <TableCell>{prescription.regNo}</TableCell>
                      <TableCell>{prescription.date}</TableCell>
                      <TableCell>{prescription.doctor}</TableCell>
                      <TableCell>{prescription.diagnosis}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            prescription.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {prescription.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" /> View
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

