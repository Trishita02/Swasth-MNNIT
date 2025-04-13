import { useEffect, useState } from "react"
import { Button } from "../../components/Button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/Tabs.jsx"
import { ArrowLeft, Calendar } from "lucide-react"
import { Link, useParams,useNavigate } from "react-router-dom"
import API from "../../utils/axios.jsx"

export default function PatientHistory() {
  const [patient, setPatient] = useState({});
  
  const params = useParams()
  const patientId = params.id;
  // console.log("history id: ",patientId)
  const navigate = useNavigate();

  
  useEffect(() => {
    API.get(`/staff/getPatientbyId/${patientId}`)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setPatient(res.data);
        } else {
          console.error("Failed to fetch patient:", res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching patient:", error);
      });
  }, [patientId]);

  // Mock patient data - in a real app, this would be fetched from an API
 

  // Mock visit history
  const visitHistory = [
    {
      id: 1,
      date: "2025-03-30",
      doctor: "Dr. Kumar",
      diagnosis: "Viral Fever",
      symptoms: "Fever, Headache, Body ache",
      treatment: "Paracetamol 500mg, Rest",
    },
    {
      id: 2,
      date: "2025-02-15",
      doctor: "Dr. Sharma",
      diagnosis: "Common Cold",
      symptoms: "Runny nose, Sore throat",
      treatment: "Cetirizine 10mg, Steam inhalation",
    },
    {
      id: 3,
      date: "2024-11-10",
      doctor: "Dr. Kumar",
      diagnosis: "Gastroenteritis",
      symptoms: "Abdominal pain, Nausea",
      treatment: "ORS, Omeprazole 20mg",
    },
  ]

  // Mock prescription history
  const prescriptionHistory = [
    {
      id: 1,
      date: "2025-03-30",
      doctor: "Dr. Kumar",
      medicines: "Paracetamol 500mg - 1 tablet thrice daily\nDomperidone 10mg - 1 tablet before meals",
      instructions: "Take after food. Drink plenty of fluids.",
    },
    {
      id: 2,
      date: "2025-02-15",
      doctor: "Dr. Sharma",
      medicines: "Cetirizine 10mg - 1 tablet at night\nChloropheniramine 4mg - 1 tablet twice daily",
      instructions: "Avoid cold beverages. Steam inhalation twice daily.",
    },
    {
      id: 3,
      date: "2024-11-10",
      doctor: "Dr. Kumar",
      medicines: "ORS - 1 packet after each loose stool\nOmeprazole 20mg - 1 capsule before breakfast",
      instructions: "Light diet. Avoid spicy food.",
    },
  ]

  return (
    <>
      <div className="mb-6">
        {/* <Link to=".."> */}
          <Button variant="outline" size="sm" onClick={()=>navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Patients
          </Button>
        {/* </Link> */}
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>Personal and medical details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-2 pb-4">
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {patient.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{patient.name}</h3>
                <p className="text-sm text-muted-foreground">{patient.reg_no}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Type:</span>
                  <span className="text-sm">{patient.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Date of Birth:</span>
                  <span className="text-sm">{patient.dob?.slice(0, 10)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Gender:</span>
                  <span className="text-sm">{patient.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Blood Group:</span>
                  <span className="text-sm">{patient.blood_group}</span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-sm font-medium">Contact:</span>
                  <span className="text-sm">{patient.contact}</span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm">{patient.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Allergies:</span>
                  <span className="text-sm">{patient.allergies}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Tabs defaultValue="visits">
            <TabsList>
              <TabsTrigger value="visits">Visit History</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescription History</TabsTrigger>
            </TabsList>
            <TabsContent value="visits">
              <Card>
                <CardHeader>
                  <CardTitle>Visit History</CardTitle>
                  <CardDescription>Past consultations and diagnoses</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Diagnosis</TableHead>
                        <TableHead>Symptoms</TableHead>
                        <TableHead>Treatment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visitHistory.map((visit) => (
                        <TableRow key={visit.id}>
                          <TableCell>{visit.date}</TableCell>
                          <TableCell>{visit.doctor}</TableCell>
                          <TableCell>{visit.diagnosis}</TableCell>
                          <TableCell>{visit.symptoms}</TableCell>
                          <TableCell>{visit.treatment}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="prescriptions">
              <Card>
                <CardHeader>
                  <CardTitle>Prescription History</CardTitle>
                  <CardDescription>Past medications and instructions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {prescriptionHistory.map((prescription) => (
                      <Card key={prescription.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              <Calendar className="mr-2 inline-block h-4 w-4" />
                              {prescription.date}
                            </CardTitle>
                            <span className="text-sm text-muted-foreground">{prescription.doctor}</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <h4 className="text-sm font-medium">Medicines:</h4>
                              <p className="whitespace-pre-line text-sm">{prescription.medicines}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Instructions:</h4>
                              <p className="text-sm">{prescription.instructions}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

