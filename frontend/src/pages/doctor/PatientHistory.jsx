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

  const [prescriptionHistory, setPrescriptionHistory] = useState([]);

  useEffect(() => {
    API.get(`/doctor/getPrescriptionById/${patientId}`)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setPrescriptionHistory(res.data);
        } else {
          console.error("Failed to fetch prescription history:", res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching prescription history:", error);
      });
  }
  , [patientId]);



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
                <Tabs defaultValue="prescriptions">
                  <TabsList>
                    {/* <TabsTrigger value="visits">Visit History</TabsTrigger> */}
                    <TabsTrigger value="prescriptions">Prescription History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="prescriptions">
                  <Card className="rounded-2xl shadow-md border border-gray-200">
                <CardHeader className="bg-blue-50 rounded-t-2xl p-6">
                  <CardTitle className="text-xl text-blue-700 font-bold">Prescription History</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Past medications and instructions
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {prescriptionHistory.map((prescription) => (
                      <Card
                        key={prescription._id}
                        className="border border-blue-100 rounded-xl shadow-sm bg-white hover:shadow-md transition-all duration-300"
                      >
                        <CardHeader className="pb-2 border-b px-4 pt-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2 text-blue-600 font-semibold">
                              <Calendar className="h-4 w-4" />
                              {new Date(prescription.date_of_visit).toLocaleDateString('en-GB')}
                            </CardTitle>
                            <span className="text-sm text-muted-foreground font-medium">
                              Dr. {prescription.doctor_name}
                              <p className="text-xs text-gray-600">{prescription.specialization}</p>
                            </span>
                          </div>
                        </CardHeader>

                        <CardContent className="p-4 space-y-4 text-sm text-gray-700">
                          <div>
                            <h4 className="font-medium text-gray-600">Diagnosis:</h4>
                            <p className="">{prescription.diagnosis}</p>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-600">Medicines:</h4>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              {prescription.medicines.map((med, index) => (
                                <li key={index}>
                                  <span className="font-semibold text-gray-800">{med.name}</span> — {med.dosage}, {med.duration}
                                  <span className="italic text-gray-600"> ({med.instructions})</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {prescription.investigation && (
                            <div>
                              <h4 className="font-medium text-gray-600">Investigation:</h4>
                              <p>{prescription.investigation}</p>
                            </div>
                          )}

                          {prescription.advice && (
                            <div>
                              <h4 className="font-medium text-gray-600">Doctor's Advice:</h4>
                              <p>{prescription.advice}</p>
                            </div>
                          )}

                          {prescription.remark && (
                            <div>
                              <h4 className="font-medium text-gray-600">Remarks:</h4>
                              <p>{prescription.remark}</p>
                            </div>
                          )}
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

