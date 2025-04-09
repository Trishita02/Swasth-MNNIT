import { useState } from "react"
import { Button } from "../../components/Button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/Dialog.jsx"
import { Input } from "../../components/Input.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/Tabs.jsx"
import { FileText, QrCode, Search, X,Calendar as CalendarIcon, } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/Select.jsx"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/PopOver.jsx"
import { Calendar } from "../../components/Calendar.jsx"
import { format } from "date-fns"
// import { useToast } from "@/hooks/use-toast"
import { Badge } from "../../components/Badge.jsx"

export default function StaffPrescriptions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("regNo")
  const [filterDoctor, setFilterDoctor] = useState("")
  const [filterDate, setFilterDate] = useState(undefined)
  // const { toast } = useToast()

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

  const doctors = ["Dr. Kumar", "Dr. Sharma", "Dr. Gupta", "Dr. Verma"]

  const handleMarkAsCompleted = (id) => {
    setPrescriptions(
      prescriptions.map((prescription) =>
        prescription.id === id ? { ...prescription, status: "Completed" } : prescription,
      ),
    )

    toast({
      title: "Prescription Updated",
      description: "Prescription has been marked as completed",
    })
  }

  // Filter prescriptions based on search query, activity type, and date
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    // Filter by registration number
    const matchesSearch = prescription.regNo.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by doctor
    const matchesDoctor = filterDoctor === "" || prescription.doctor === filterDoctor

    // Filter by date
    const matchesDate = filterDate ? prescription.date === format(filterDate, "yyyy-MM-dd") : true

    return matchesSearch && matchesDoctor && matchesDate
  })

  const clearFilters = () => {
    setFilterDoctor("")
    setFilterDate(undefined)
  }

  // State for prescription view dialog
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false)

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription)
    setIsPrescriptionDialogOpen(true)
  }

  // Mock prescription details for the selected prescription
  const getPrescriptionDetails = (prescription) => {
    if (!prescription) return null

    // Determine issue based on diagnosis
    let issue = ""
    if (prescription.diagnosis.includes("Fever")) issue = "Fever"
    else if (prescription.diagnosis.includes("Migraine")) issue = "Headache"
    else if (prescription.diagnosis.includes("Sprain")) issue = "Injury"
    else if (prescription.diagnosis.includes("Rhinitis")) issue = "Allergy"
    else issue = "General"

    return {
      id: prescription.id,
      patientName: prescription.patientName,
      regNo: prescription.regNo,
      date: prescription.date,
      doctor: prescription.doctor,
      diagnosis: prescription.diagnosis,
      issue: issue,
      status: prescription.status,
      chiefComplaints: `${issue}, Weakness, Fatigue`,
      pastHistory: issue === "Fever" ? "H/O Typhoid 2 years back" : "No significant past history",
      medicines: [
        {
          name:
            issue === "Fever"
              ? "Paracetamol 500mg"
              : issue === "Headache"
                ? "Ibuprofen 400mg"
                : issue === "Injury"
                  ? "Diclofenac 50mg"
                  : "Cetirizine 10mg",
          dosage: "1-0-1",
          duration: "5 days",
          instructions: "After meals",
          dispensed: prescription.status === "Completed",
        },
        {
          name:
            issue === "Fever"
              ? "Azithromycin 500mg"
              : issue === "Headache"
                ? "Paracetamol 500mg"
                : issue === "Injury"
                  ? "Paracetamol 500mg"
                  : "Montelukast 10mg",
          dosage: "0-0-1",
          duration: "3 days",
          instructions: "After dinner",
          dispensed: prescription.status === "Completed",
        },
      ],
      advice: "Plenty of fluids. Rest advised.",
      followUp: "After 5 days if symptoms persist",
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prescriptions</h1>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Search by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regNo">Registration No.</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by reg no."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Select value={filterDoctor} onValueChange={setFilterDoctor}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor} value={doctor}>
                    {doctor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
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

            {(filterDoctor || filterDate) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-3">
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {(searchQuery || filterDoctor || filterDate) && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="px-3 py-1">
              Reg No: {searchQuery}
              <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 p-0" onClick={() => setSearchQuery("")}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filterDoctor && (
            <Badge variant="secondary" className="px-3 py-1">
              Doctor: {filterDoctor}
              <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 p-0" onClick={() => setFilterDoctor("")}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filterDate && (
            <Badge variant="secondary" className="px-3 py-1">
              Date: {format(filterDate, "PPP")}
              <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 p-0" onClick={() => setFilterDate(undefined)}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

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
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2"
                            onClick={() => handleViewPrescription(prescription)}
                          >
                            <FileText className="mr-2 h-4 w-4" /> View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredPrescriptions.filter((prescription) => prescription.status === "Pending").length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No pending prescriptions found matching the current filters.
                      </TableCell>
                    </TableRow>
                  )}
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
                          <Button variant="outline" size="sm" onClick={() => handleViewPrescription(prescription)}>
                            <FileText className="mr-2 h-4 w-4" /> View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredPrescriptions.filter((prescription) => prescription.status === "Completed").length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No completed prescriptions found matching the current filters.
                      </TableCell>
                    </TableRow>
                  )}
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
                        <Button variant="outline" size="sm" onClick={() => handleViewPrescription(prescription)}>
                          <FileText className="mr-2 h-4 w-4" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPrescriptions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No prescriptions found matching the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Prescription View Dialog */}
      <Dialog open={isPrescriptionDialogOpen} onOpenChange={setIsPrescriptionDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
            <DialogDescription>
              {selectedPrescription &&
                `Prescription for ${selectedPrescription.patientName} (${selectedPrescription.regNo})`}
            </DialogDescription>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedPrescription.patientName}</h3>
                  <p className="text-sm text-muted-foreground">Reg No: {selectedPrescription.regNo}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Date: {selectedPrescription.date}</p>
                  <p className="text-sm text-muted-foreground">Doctor: {selectedPrescription.doctor}</p>
                  <p className="text-sm text-muted-foreground">
                    Status:{" "}
                    <span className={selectedPrescription.status === "Completed" ? "text-green-600" : "text-amber-600"}>
                      {selectedPrescription.status}
                    </span>
                  </p>
                </div>
              </div>

              {(() => {
                const details = getPrescriptionDetails(selectedPrescription)
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">Diagnosis</h4>
                        <p>{details.diagnosis}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Chief Complaints</h4>
                        <p>{details.chiefComplaints}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-1">Past Medical History</h4>
                      <p>{details.pastHistory}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Medicines</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Medicine</TableHead>
                            <TableHead>Dosage</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Instructions</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {details.medicines.map((medicine, index) => (
                            <TableRow key={index}>
                              <TableCell>{medicine.name}</TableCell>
                              <TableCell>{medicine.dosage}</TableCell>
                              <TableCell>{medicine.duration}</TableCell>
                              <TableCell>{medicine.instructions}</TableCell>
                              <TableCell>
                                {medicine.dispensed ? (
                                  <Badge variant="outline" className="bg-green-100 text-green-800">
                                    Dispensed
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                    Pending
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">General Advice</h4>
                        <p>{details.advice}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Follow-up</h4>
                        <p>{details.followUp}</p>
                      </div>
                    </div>
                  </>
                )
              })()}

              <DialogFooter>
                <Button onClick={() => setIsPrescriptionDialogOpen(false)}>Close</Button>
                {selectedPrescription.status === "Pending" && (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      handleMarkAsCompleted(selectedPrescription.id)
                      setIsPrescriptionDialogOpen(false)
                    }}
                  >
                    Mark as Completed
                  </Button>
                )}
                <Button variant="outline">Print</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
