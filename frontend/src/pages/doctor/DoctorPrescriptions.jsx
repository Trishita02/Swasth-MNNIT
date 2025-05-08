
import { useState, useEffect } from "react"
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
import API from "../../utils/axios.jsx"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { printPrescriptionAPI } from "../../utils/api.jsx"

export default function DoctorPrescriptions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("regNo")
  const [filterDate, setFilterDate] = useState(undefined)
  const [filterIssue, setFilterIssue] = useState("all")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [allPrescriptions, setAllPrescriptions] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // const { toast } = useToast()

  const [prescriptions, setPrescriptions] = useState([])
  const [newPrescription, setNewPrescription] = useState([])
  const [patientSuggestions, setPatientSuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);
const [allPatients, setAllPatients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    reg_no: '',
    diagnosis: '',
    prev_issue: '',
    remark: '',
    investigation: '',
    medicines: [{ name: '', dosage: '', duration: '', instructions: '' }],
    advice: '',
  })
  // Fetch all patients on component mount
useEffect(() => {
  const fetchAllPatients = async () => {
    try {
      const res = await API.get("/staff/getAllPatients");
      setAllPatients(res.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };
  fetchAllPatients();
}, []);

// Filter patients based on input
const handleRegNoChange = (e) => {
  const value = e.target.value;
  setFormData({ ...formData, reg_no: value });
  
  if (value.length > 0) {
    const filtered = allPatients.filter(patient => 
      patient.reg_no.toLowerCase().includes(value.toLowerCase())
    );
    setPatientSuggestions(filtered.slice(0, 5)); // Show top 5 matches
    setShowSuggestions(true);
  } else {
    setPatientSuggestions([]);
    setShowSuggestions(false);
  }
};

  useEffect(() => {
    const fetchPresciptions = async () => {
        try {
            const res = await API.get("/doctor/getAllPrescriptions");
            const today = getTodayUTCDate();
            
            const todaysPrescriptions = res.data.filter(prescription => 
                new Date(prescription.date_of_visit).toISOString().slice(0, 10) === today
            );
            
            setAllPrescriptions(res.data);
            setPrescriptions(todaysPrescriptions);
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    };
    
    fetchPresciptions();
}, []);
  
 // Remove the handleSearch function and replace it with:
 useEffect(() => {
  const today = getTodayUTCDate();
  
  if (!searchQuery) {
    // When search is empty, show all of today's prescriptions
    const todaysPrescriptions = allPrescriptions.filter(prescription => 
      prescription.date_of_visit?.slice(0, 10) === today
    );
    setPrescriptions(todaysPrescriptions);
    return;
  }
  
  // When searching, still filter by today's date
  const filtered = allPrescriptions.filter(prescription => 
    prescription.reg_no.toLowerCase().includes(searchQuery.toLowerCase()) &&
    prescription.date_of_visit?.slice(0, 10) === today
  );
  setPrescriptions(filtered);
}, [searchQuery, allPrescriptions]);
  
  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleAddMedicine = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { name: '', dosage: '', duration: '', instructions: '' }],
    });
  };

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = formData.medicines.filter((_, i) => i !== index);
    setFormData({ ...formData, medicines: updatedMedicines });
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...formData.medicines];
    updatedMedicines[index][field] = value;
    setFormData({ ...formData, medicines: updatedMedicines });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true); // Show confirmation dialog
  };
  const confirmSubmit = async () => {
    setIsLoading(true); // Start loading
    
    try {
      const res = await API.post("/doctor/addPrescription", formData);
      const formDataName = formData.name;
      
      // Reset form
      setFormData({
        name: "", 
        reg_no: "",
        diagnosis: "",
        prev_issue: "",
        remark: "",
        investigation: "",
        medicines: [{ name: "", dosage: "", duration: "", instructions: "" }],
        advice: "",
      });
      
      setSelectedPatient(null);
      setIsFormOpen(false);
      setIsConfirmOpen(false);
      
      toast.success(`Prescription for ${formDataName} has been created successfully`, {
        autoClose: 3000,
      });
  
      // Refresh prescriptions list
      const updatedRes = await API.get("/doctor/getAllPrescriptions");
      setAllPrescriptions(updatedRes.data);
      setPrescriptions(updatedRes.data);
      
    } catch (error) {
      console.error("Error submitting prescription:", error);
      toast.error("Failed to create prescription");
    } finally {
      setIsLoading(false); // End loading regardless of success/error
    }
  };

  // const handleAddPrescription = () => {
  //   if (!selectedPatient) return

  //   setPrescriptions([
  //     ...prescriptions,
  //     {
  //       id: prescriptions.length + 1,
  //       patientName: selectedPatient.name,
  //       regNo: selectedPatient.regNo,
  //       date: new Date().toISOString().split("T")[0],
  //       diagnosis: newPrescription.diagnosis,
  //       issue: newPrescription.chiefComplaints.split(",")[0], // Use first complaint as issue
  //       status: "Pending",
  //     },
  //   ])

  //   setNewPrescription({
  //     diagnosis: "",
  //     chiefComplaints: "",
  //     pastHistory: "",
  //     medicines: [{ name: "", dosage: "", duration: "", instructions: "" }],
  //     advice: "",
  //     followUp: "",
  //   })

  //   setSelectedPatient(null)
  //   setSearchQuery("")

  //   toast({
  //     title: "Prescription Created",
  //     description: `Prescription for ${selectedPatient.name} has been created successfully`,
  //   })
  // }

  // Filter prescriptions based on search query, date, and issue
  // function filteredPrescriptions(prescriptions, searchQuery) {
  //   return prescriptions.filter((prescription) => {
  //     const matchesSearch = prescription.reg_no
  //       .toLowerCase()
  //       .includes(searchQuery.toLowerCase());
  
  //     return matchesSearch;
  //   });
  // }
  

  // const clearFilters = () => {
  //   setFilterDate(undefined)
  //   setFilterIssue("all")
  // }

  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false)

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription)
    setIsPrescriptionDialogOpen(true)
  }

  // Mock prescription details for the selected prescription
  const getPrescriptionDetails = (prescription) => {
    if (!prescription) return null
    console.log(prescription)
    return {
      id: prescription.id,
      patientName: prescription.name,
      regNo: prescription.reg_no,
      date: prescription.date,
      diagnosis: prescription.diagnosis,
      issue: prescription.issue,
      status: prescription.status,
      chiefComplaints: `${prescription.issue}`,
      pastHistory: prescription.prev_issue.length>0 ? prescription.prev_issue : "No significant past history",
      medicines: prescription.medicines,
      advice: prescription.advice,
    }
  }
  const getTodayUTCDate = () => {
    const today = new Date();
    return new Date(Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate()
    )).toISOString().slice(0, 10); 
};
useEffect(() => {
  const handleClickOutside = (event) => {
    if (event.target.id !== 'reg_no') {
      setShowSuggestions(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);
  return (
    <>
        <ToastContainer 
            position="top-right"
            autoClose={1000}
            
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
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
              
            </div>
           

            {/* <Popover>
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
            )} */}
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>

  <DialogTrigger asChild>
    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsFormOpen(true)}>
      <Plus className="mr-2 h-4 w-4" /> Create Prescription
    </Button>
  </DialogTrigger>

  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Create New Prescription</DialogTitle>
      <DialogDescription>Create a detailed prescription for a patient.</DialogDescription>
    </DialogHeader>

    

    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-md rounded-md">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="name" className="font-medium">Patient Name</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange(e, 'name')}
            placeholder="Enter patient name"
            required
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid gap-2 relative">
  <label htmlFor="reg_no" className="font-medium">Registration Number</label>
  <input
    id="reg_no"
    type="text"
    value={formData.reg_no}
    onChange={handleRegNoChange}
    placeholder="Enter registration number"
    required
    className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
    autoComplete="off"
  />
  {showSuggestions && patientSuggestions.length > 0 && (
    <div className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
      {patientSuggestions.map((patient) => (
        <div
          key={patient._id}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
          onClick={() => {
            setFormData({
              ...formData,
              reg_no: patient.reg_no,
              name: patient.name,
            });
            setShowSuggestions(false);
          }}
        >
          <span>{patient.reg_no}</span>
          <span className="text-gray-600">{patient.name}</span>
        </div>
      ))}
    </div>
  )}
</div>  
        <div className="grid gap-2">
          <label htmlFor="diagnosis" className="font-medium">Diagnosis</label>
          <input
            id="diagnosis"
            type="text"
            value={formData.diagnosis}
            onChange={(e) => handleInputChange(e, 'diagnosis')}
            placeholder="Enter diagnosis"
            required
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="prev_issue" className="font-medium">Previous Medical Issue</label>
          <input
            id="prev_issue"
            type="text"
            value={formData.prev_issue}
            onChange={(e) => handleInputChange(e, 'prev_issue')}
            placeholder="Enter previous medical issue"
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="remark" className="font-medium">Remark</label>
          <input
            id="remark"
            type="text"
            value={formData.remark}
            onChange={(e) => handleInputChange(e, 'remark')}
            placeholder="Enter additional remarks"
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="investigation" className="font-medium">Investigation</label>
          <input
            id="investigation"
            type="text"
            value={formData.investigation}
            onChange={(e) => handleInputChange(e, 'investigation')}
            placeholder="Enter suggested investigation"
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Medicines Section */}
        <div className="grid gap-4">
          <label className="font-medium">Medicines</label>
          {formData.medicines.map((medicine, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-md">
              <div className="grid gap-2">
                <label htmlFor={`medicine-name-${index}`} className="font-medium">Medicine Name</label>
                <input
                  id={`medicine-name-${index}`}
                  type="text"
                  value={medicine.name}
                  onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                  placeholder="Enter medicine name"
                  required
                  className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex-1">
                <label htmlFor={`medicine-dosage-${index}`} className="font-medium">Dosage</label>
                <input
                  id={`medicine-dosage-${index}`}
                  type="text"
                  value={medicine.dosage}
                  onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                  placeholder="e.g., 500mg"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor={`medicine-duration-${index}`} className="font-medium">Duration</label>
                <input
                  id={`medicine-duration-${index}`}
                  type="text"
                  value={medicine.duration}
                  onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                  placeholder="e.g., 5 days"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor={`medicine-instructions-${index}`} className="font-medium">Instructions</label>
                <input
                  id={`medicine-instructions-${index}`}
                  type="text"
                  value={medicine.instructions}
                  onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                  placeholder="e.g., After meals"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMedicine(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove Medicine
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddMedicine}
            className="text-blue-600 hover:text-blue-700"
          >
            Add Another Medicine
          </button>
        </div>

        {/* Doctor's Advice Section */}
        <div className="grid gap-2">
          <label htmlFor="advice" className="font-medium">Doctor's Advice</label>
          <input
            id="advice"
            type="text"
            value={formData.advice}
            onChange={(e) => handleInputChange(e, 'advice')}
            placeholder="Enter doctor's advice"
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Submit Prescription
        </button>
      </div>
    </form>
  </DialogContent>
</Dialog>

        </div>
      </div>

      {(searchQuery || filterDate || filterIssue !== "all") && (
        <div className="mt-2 flex flex-wrap items-center gap-2">


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
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Today's Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Reg No.</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    {/* <TableHead>Issue</TableHead> */}
                    
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell className="font-medium">{prescription.name}</TableCell>
                      <TableCell>{prescription.reg_no}</TableCell>
                      <TableCell>{prescription.diagnosis}</TableCell>
                      {/* <TableCell>{prescription.prev_issue||'-'}</TableCell> */}
                      
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewPrescription(prescription)}>
                          <FileText className="mr-2 h-4 w-4" /> View
                        </Button>
                        
                      </TableCell>
                    </TableRow>
                  ))}
                  {prescriptions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No prescriptions found
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
                `Prescription for ${selectedPrescription.name} (${selectedPrescription.reg_no})`}
            </DialogDescription>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedPrescription.name}</h3>
                  <p className="text-sm text-muted-foreground">Reg No: {selectedPrescription.reg_no}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Date: {selectedPrescription.date_of_visit?.slice(0, 10)}</p>
                  {/* <p className="text-sm text-muted-foreground">
                    Status:{" "}
                    <span className={selectedPrescription.status === "Completed" ? "text-green-600" : "text-amber-600"}>
                      {selectedPrescription.status}
                    </span>
                  </p> */}
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
                      {/* <div>
                        <h4 className="font-medium mb-1">Chief Complaints</h4>
                        <p>{details.chiefComplaints}</p>
                      </div> */}
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
                        <p>{details.advice||"Take medicines as prescribed"}</p>
                      </div>
                      {/* <div>
                        <h4 className="font-medium mb-1">Follow-up</h4>
                        <p>{details.followUp}</p>
                      </div> */}
                    </div>
                  </>
                )
              })()}

              <DialogFooter>
                <Button onClick={() => setIsPrescriptionDialogOpen(false)}>Close</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => printPrescriptionAPI(selectedPrescription._id)}>Print Prescription</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Confirmation Dialog */}
<Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Prescription</DialogTitle>
      <DialogDescription>
        Are you sure you want to submit this prescription for {formData.name}?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
  <Button variant="outline" onClick={() => setIsConfirmOpen(false)} disabled={isLoading}>
    Cancel
  </Button>
  <Button 
    className="bg-blue-600 hover:bg-blue-700" 
    onClick={confirmSubmit}
    disabled={isLoading}
  >
    {isLoading ? (
      <>
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      </>
    ) : "Confirm"}
  </Button>
</DialogFooter>
  </DialogContent>
</Dialog>
    </>
  )
}
