
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
import { Label } from "../../components/Label.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/Select.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/Tabs.jsx"
import { Textarea } from "../../components/TextArea.jsx"
import { Calendar, FileText, Plus, Search, User, X } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/PopOver.jsx"
import { format } from "date-fns"
import { Badge } from "../../components/Badge.jsx"

export default function DoctorPrescriptions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("regNo")
  const [filterDate, setFilterDate] = useState(undefined)
  const [filterIssue, setFilterIssue] = useState("all")
  const [selectedPatient, setSelectedPatient] = useState(null)
  // const { toast } = useToast()

  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: "Rahul Sharma",
      regNo: "BT21CS001",
      date: "2025-03-30",
      diagnosis: "Viral Fever",
      issue: "Fever",
      status: "Completed",
    },
    {
      id: 2,
      patientName: "Priya Singh",
      regNo: "BT21EC045",
      date: "2025-03-29",
      diagnosis: "Migraine",
      issue: "Headache",
      status: "Pending",
    },
    {
      id: 3,
      patientName: "Amit Kumar",
      regNo: "BT20ME032",
      date: "2025-03-28",
      diagnosis: "Ankle Sprain",
      issue: "Injury",
      status: "Pending",
    },
    {
      id: 4,
      patientName: "Neha Gupta",
      regNo: "BT22CS078",
      date: "2025-03-25",
      diagnosis: "Allergic Rhinitis",
      issue: "Allergy",
      status: "Completed",
    },
  ])

  // Mock patient data
  const patients = [
    {
      id: 1,
      name: "Rahul Sharma",
      regNo: "BT21CS001",
      type: "Student",
      department: "Computer Science",
      age: 22,
      gender: "Male",
      bloodGroup: "O+",
    },
    {
      id: 2,
      name: "Priya Singh",
      regNo: "BT21EC045",
      type: "Student",
      department: "Electronics",
      age: 21,
      gender: "Female",
      bloodGroup: "B+",
    },
    {
      id: 3,
      name: "Amit Kumar",
      regNo: "BT20ME032",
      type: "Student",
      department: "Mechanical",
      age: 23,
      gender: "Male",
      bloodGroup: "A-",
    },
    {
      id: 4,
      name: "Neha Gupta",
      regNo: "BT22CS078",
      type: "Student",
      department: "Computer Science",
      age: 20,
      gender: "Female",
      bloodGroup: "AB+",
    },
    {
      id: 5,
      name: "Dr. Rajesh Verma",
      regNo: "FAC001",
      type: "Faculty",
      department: "Physics",
      age: 45,
      gender: "Male",
      bloodGroup: "O-",
    },
  ]

  // List of common issues for filtering
  const issuesList = ["Fever", "Headache", "Injury", "Allergy", "Stomach Pain", "Cold & Cough", "Skin Problem"]

  const [newPrescription, setNewPrescription] = useState({
    diagnosis: "",
    chiefComplaints: "",
    pastHistory: "",
    medicines: [{ name: "", dosage: "", duration: "", instructions: "" }],
    advice: "",
    followUp: "",
  })

  const handleSearchPatient = () => {
    const foundPatient = patients.find((patient) => patient.regNo.toLowerCase() === searchQuery.toLowerCase())
    setSelectedPatient(foundPatient || null)

    if (!foundPatient) {
      toast({
        title: "Patient Not Found",
        description: "No patient found with the provided registration number",
        variant: "destructive",
      })
    }
  }

  const handleAddMedicine = () => {
    setNewPrescription({
      ...newPrescription,
      medicines: [...newPrescription.medicines, { name: "", dosage: "", duration: "", instructions: "" }],
    })
  }

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = [...newPrescription.medicines]
    updatedMedicines.splice(index, 1)
    setNewPrescription({
      ...newPrescription,
      medicines: updatedMedicines,
    })
  }

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...newPrescription.medicines]
    updatedMedicines[index] = {
      ...updatedMedicines[index],
      [field]: value,
    }
    setNewPrescription({
      ...newPrescription,
      medicines: updatedMedicines,
    })
  }

  const handleAddPrescription = () => {
    if (!selectedPatient) return

    setPrescriptions([
      ...prescriptions,
      {
        id: prescriptions.length + 1,
        patientName: selectedPatient.name,
        regNo: selectedPatient.regNo,
        date: new Date().toISOString().split("T")[0],
        diagnosis: newPrescription.diagnosis,
        issue: newPrescription.chiefComplaints.split(",")[0], // Use first complaint as issue
        status: "Pending",
      },
    ])

    setNewPrescription({
      diagnosis: "",
      chiefComplaints: "",
      pastHistory: "",
      medicines: [{ name: "", dosage: "", duration: "", instructions: "" }],
      advice: "",
      followUp: "",
    })

    setSelectedPatient(null)
    setSearchQuery("")

    toast({
      title: "Prescription Created",
      description: `Prescription for ${selectedPatient.name} has been created successfully`,
    })
  }

  // Filter prescriptions based on search query, date, and issue
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    // Filter by registration number
    const matchesSearch = prescription.regNo.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by date
    const matchesDate = filterDate ? prescription.date === format(filterDate, "yyyy-MM-dd") : true

    // Filter by issue
    const matchesIssue = filterIssue === "all" || prescription.issue === filterIssue

    return matchesSearch && matchesDate && matchesIssue
  })

  const clearFilters = () => {
    setFilterDate(undefined)
    setFilterIssue("all")
  }

  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false)

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription)
    setIsPrescriptionDialogOpen(true)
  }

  // Mock prescription details for the selected prescription
  const getPrescriptionDetails = (prescription) => {
    if (!prescription) return null

    return {
      id: prescription.id,
      patientName: prescription.patientName,
      regNo: prescription.regNo,
      date: prescription.date,
      diagnosis: prescription.diagnosis,
      issue: prescription.issue,
      status: prescription.status,
      chiefComplaints: `${prescription.issue}, Weakness, Fatigue`,
      pastHistory: prescription.issue === "Fever" ? "H/O Typhoid 2 years back" : "No significant past history",
      medicines: [
        {
          name:
            prescription.issue === "Fever"
              ? "Paracetamol 500mg"
              : prescription.issue === "Headache"
                ? "Ibuprofen 400mg"
                : prescription.issue === "Injury"
                  ? "Diclofenac 50mg"
                  : "Cetirizine 10mg",
          dosage: "1-0-1",
          duration: "5 days",
          instructions: "After meals",
        },
        {
          name:
            prescription.issue === "Fever"
              ? "Azithromycin 500mg"
              : prescription.issue === "Headache"
                ? "Paracetamol 500mg"
                : prescription.issue === "Injury"
                  ? "Paracetamol 500mg"
                  : "Montelukast 10mg",
          dosage: "0-0-1",
          duration: "3 days",
          instructions: "After dinner",
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
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Reg. No."
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

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {filterDate ? format(filterDate, "PPP") : <span>Filter by date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={filterDate} onSelect={setFilterDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Select value={filterIssue} onValueChange={setFilterIssue}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by issue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Issues</SelectItem>
                {issuesList.map((issue) => (
                  <SelectItem key={issue} value={issue}>
                    {issue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(filterDate || filterIssue !== "all") && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-3">
                Clear Filters
              </Button>
            )}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> Create Prescription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Prescription</DialogTitle>
                <DialogDescription>Create a detailed prescription for a patient.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid gap-2">
                  <Label htmlFor="patientSearch">Search Patient by Registration Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="patientSearch"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter registration number"
                    />
                    <Button type="button" onClick={handleSearchPatient}>
                      Search
                    </Button>
                  </div>
                </div>

                {selectedPatient ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Name:</p>
                          <p className="text-sm">{selectedPatient.name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Registration No:</p>
                          <p className="text-sm">{selectedPatient.regNo}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Type:</p>
                          <p className="text-sm">{selectedPatient.type}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Department:</p>
                          <p className="text-sm">{selectedPatient.department}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Age:</p>
                          <p className="text-sm">{selectedPatient.age} years</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Gender:</p>
                          <p className="text-sm">{selectedPatient.gender}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Blood Group:</p>
                          <p className="text-sm">{selectedPatient.bloodGroup}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                    <div className="flex flex-col items-center text-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Search for a patient by registration number to create a prescription
                      </p>
                    </div>
                  </div>
                )}

                {selectedPatient && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="diagnosis">Diagnosis</Label>
                      <Input
                        id="diagnosis"
                        value={newPrescription.diagnosis}
                        onChange={(e) => setNewPrescription({ ...newPrescription, diagnosis: e.target.value })}
                        placeholder="Enter diagnosis"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="chiefComplaints">Chief Complaints</Label>
                      <Textarea
                        id="chiefComplaints"
                        value={newPrescription.chiefComplaints}
                        onChange={(e) => setNewPrescription({ ...newPrescription, chiefComplaints: e.target.value })}
                        placeholder="Enter chief complaints (comma separated)"
                        rows={2}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="pastHistory">Past Medical History</Label>
                      <Textarea
                        id="pastHistory"
                        value={newPrescription.pastHistory}
                        onChange={(e) => setNewPrescription({ ...newPrescription, pastHistory: e.target.value })}
                        placeholder="Enter past medical history"
                        rows={2}
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label>Medicines</Label>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddMedicine}>
                          Add Medicine
                        </Button>
                      </div>

                      {newPrescription.medicines.map((medicine, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-medium">Medicine {index + 1}</h4>
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveMedicine(index)}
                                className="h-6 px-2 text-red-500 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <div className="grid grid-cols-1 gap-2">
                              <Label htmlFor={`medicine-name-${index}`}>Medicine Name</Label>
                              <Input
                                id={`medicine-name-${index}`}
                                value={medicine.name}
                                onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                                placeholder="Enter medicine name"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="grid gap-2">
                                <Label htmlFor={`medicine-dosage-${index}`}>Dosage</Label>
                                <Input
                                  id={`medicine-dosage-${index}`}
                                  value={medicine.dosage}
                                  onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                                  placeholder="e.g., 1-0-1"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor={`medicine-duration-${index}`}>Duration</Label>
                                <Input
                                  id={`medicine-duration-${index}`}
                                  value={medicine.duration}
                                  onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                                  placeholder="e.g., 5 days"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor={`medicine-instructions-${index}`}>Instructions</Label>
                                <Input
                                  id={`medicine-instructions-${index}`}
                                  value={medicine.instructions}
                                  onChange={(e) => handleMedicineChange(index, "instructions", e.target.value)}
                                  placeholder="e.g., After meals"
                                />
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="advice">General Advice</Label>
                      <Textarea
                        id="advice"
                        value={newPrescription.advice}
                        onChange={(e) => setNewPrescription({ ...newPrescription, advice: e.target.value })}
                        placeholder="Enter general advice"
                        rows={2}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="followUp">Follow-up</Label>
                      <Input
                        id="followUp"
                        value={newPrescription.followUp}
                        onChange={(e) => setNewPrescription({ ...newPrescription, followUp: e.target.value })}
                        placeholder="e.g., After 7 days if needed"
                      />
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddPrescription}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!selectedPatient}
                >
                  Create Prescription
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {(searchQuery || filterDate || filterIssue !== "all") && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="px-3 py-1">
              Reg No: {searchQuery}
              <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 p-0" onClick={() => setSearchQuery("")}>
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

          {filterIssue !== "all" && (
            <Badge variant="secondary" className="px-3 py-1">
              Issue: {filterIssue}
              <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 p-0" onClick={() => setFilterIssue("all")}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All Prescriptions</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Prescriptions</CardTitle>
              <CardDescription>View and manage all prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Reg No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Issue</TableHead>
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
                      <TableCell>{prescription.diagnosis}</TableCell>
                      <TableCell>{prescription.issue}</TableCell>
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
                        <Button variant="outline" size="sm" className="ml-2">
                          Print
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
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Prescriptions</CardTitle>
              <CardDescription>Prescriptions waiting to be completed</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Reg No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrescriptions
                    .filter((p) => p.status === "Pending")
                    .map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell className="font-medium">{prescription.patientName}</TableCell>
                        <TableCell>{prescription.regNo}</TableCell>
                        <TableCell>{prescription.date}</TableCell>
                        <TableCell>{prescription.diagnosis}</TableCell>
                        <TableCell>{prescription.issue}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewPrescription(prescription)}>
                            <FileText className="mr-2 h-4 w-4" /> View
                          </Button>
                          <Button variant="outline" size="sm" className="ml-2">
                            Print
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredPrescriptions.filter((p) => p.status === "Pending").length === 0 && (
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
              <CardDescription>Prescriptions that have been completed</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Reg No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrescriptions
                    .filter((p) => p.status === "Completed")
                    .map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell className="font-medium">{prescription.patientName}</TableCell>
                        <TableCell>{prescription.regNo}</TableCell>
                        <TableCell>{prescription.date}</TableCell>
                        <TableCell>{prescription.diagnosis}</TableCell>
                        <TableCell>{prescription.issue}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewPrescription(prescription)}>
                            <FileText className="mr-2 h-4 w-4" /> View
                          </Button>
                          <Button variant="outline" size="sm" className="ml-2">
                            Print
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredPrescriptions.filter((p) => p.status === "Completed").length === 0 && (
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
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {details.medicines.map((medicine, index) => (
                            <TableRow key={index}>
                              <TableCell>{medicine.name}</TableCell>
                              <TableCell>{medicine.dosage}</TableCell>
                              <TableCell>{medicine.duration}</TableCell>
                              <TableCell>{medicine.instructions}</TableCell>
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
                <Button className="bg-blue-600 hover:bg-blue-700">Print Prescription</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
