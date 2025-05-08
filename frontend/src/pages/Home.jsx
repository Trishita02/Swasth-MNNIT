import { useState } from "react";
import Navbar from "../components/home/Navbar"
import { Link } from "react-router-dom";
import { Button } from "../components/Button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/Card.jsx"
import { Badge } from "../components/Badge.jsx"
import { Input } from "../components/Input.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/Select.jsx"
import { Calendar, Clock, FileText, Heart, MapPin, Phone, Search, User, Users, X } from "lucide-react"

function Home(){
   // State for doctor filtering
   const [searchQuery, setSearchQuery] = useState("")
   const [filterSpecialization, setFilterSpecialization] = useState("all")
   const [filterTime, setFilterTime] = useState("all")
 
   // Mock data for doctors' duty schedule
   const doctorSchedules = [
     {
       id: 1,
       name: "Dr. Sharma",
       specialization: "General Physician",
       date: "Monday - Friday",
       time: "9:00 AM - 1:00 PM",
       room: "Room 101",
       phone: "+91-9876543210",
     },
     {
       id: 2,
       name: "Dr. Kumar",
       specialization: "Orthopedic",
       date: "Monday, Wednesday, Friday",
       time: "1:00 PM - 5:00 PM",
       room: "Room 102",
       phone: "+91-9876543211",
     },
     {
       id: 3,
       name: "Dr. Gupta",
       specialization: "Dermatologist",
       date: "Tuesday, Thursday",
       time: "9:00 AM - 1:00 PM",
       room: "Room 103",
       phone: "+91-9876543212",
     },
     {
       id: 4,
       name: "Dr. Verma",
       specialization: "ENT Specialist",
       date: "Tuesday, Thursday, Saturday",
       time: "1:00 PM - 5:00 PM",
       room: "Room 104",
       phone: "+91-9876543213",
     },
     {
       id: 5,
       name: "Dr. Patel",
       specialization: "Cardiologist",
       date: "Monday, Thursday",
       time: "10:00 AM - 2:00 PM",
       room: "Room 105",
       phone: "+91-9876543214",
     },
     {
       id: 6,
       name: "Dr. Singh",
       specialization: "General Physician",
       date: "Wednesday, Friday",
       time: "2:00 PM - 6:00 PM",
       room: "Room 106",
       phone: "+91-9876543215",
     },
   ]
 
   // List of unique specializations for filter dropdown
   const specializations = ["all", ...new Set(doctorSchedules.map((doctor) => doctor.specialization))]
 
   // List of unique time slots for filter dropdown
   const timeSlots = ["all", ...new Set(doctorSchedules.map((doctor) => doctor.time))]
 
   // Helper function to get color for specialization
   const getSpecializationColor = (specialization) => {
     switch (specialization) {
       case "General Physician":
         return "bg-blue-500"
       case "Orthopedic":
         return "bg-purple-500"
       case "Dermatologist":
         return "bg-pink-500"
       case "ENT Specialist":
         return "bg-green-500"
       case "Cardiologist":
         return "bg-red-500"
       default:
         return "bg-gray-500"
     }
   }
 
   // Helper function to get background color for specialization
   const getSpecializationBgColor = (specialization) => {
     switch (specialization) {
       case "General Physician":
         return "bg-blue-500"
       case "Orthopedic":
         return "bg-purple-500"
       case "Dermatologist":
         return "bg-pink-500"
       case "ENT Specialist":
         return "bg-green-500"
       case "Cardiologist":
         return "bg-red-500"
       default:
         return "bg-gray-500"
     }
   }
 
   // Filter doctors based on search query and filters
   const filteredDoctors = doctorSchedules.filter((doctor) => {
     const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
     const matchesSpecialization = filterSpecialization === "all" || doctor.specialization === filterSpecialization
     const matchesTime = filterTime === "all" || doctor.time === filterTime
 
     return matchesSearch && matchesSpecialization && matchesTime
   })
 
   // Clear all filters
   const clearFilters = () => {
     setSearchQuery("")
     setFilterSpecialization("all")
     setFilterTime("all")
   }

    return(
        <>
<div className="min-h-screen flex flex-col">
        {/* Navbar section */}
        <Navbar />
      {/* Hero Section */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90 mix-blend-multiply"
          aria-hidden="true"
        />
        <div
          className="bg-cover bg-center h-[400px] md:h-[500px]"
          style={{
            backgroundImage: "url('../public/background.webp')",
            backgroundPosition: "center",
          }}
        >
          <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Swasth MNNIT</h1>
              <p className="text-xl md:text-2xl mb-8">Creating a healthier, stronger MNNIT together</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <button className="py-2 px-3 rounded-md bg-white text-blue-700 hover:bg-blue-700 hover:text-white transition-all duration-300 border">
                    Login to Portal
                  </button>
                </Link>
                {/* <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Emergency Contact
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Our Health Center</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The Health Center at Motilal Nehru National Institute of Technology (MNNIT) Allahabad is committed to
              providing comprehensive healthcare services to students, faculty, and staff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 text-blue-500 mr-2" />
                  Quality Care
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our health center is equipped with modern facilities and staffed by experienced healthcare
                  professionals dedicated to providing the highest quality of care
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 text-blue-500 mr-2" />
                  Expert Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                Our team of qualified doctors is dedicated to providing exceptional care for the health and well-being of everyone at MNNIT
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                  24/7 Emergency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                Emergency services are available 24/7 to provide medical assistance whenever needed
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* College Info Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">MNNIT Allahabad</h2>
              <p className="text-gray-600 mb-4">
                Motilal Nehru National Institute of Technology Allahabad (MNNIT) is an Institute of National Importance.
                Established in 1961, MNNIT is known for its excellence in technical education and research.
              </p>
              <p className="text-gray-600 mb-6">
                The institute is spread over a sprawling campus of 222 acres with lush green surroundings. The Health
                Center is an integral part of the campus, ensuring the well-being of over 5,000 students and 500 faculty
                and staff members.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-gray-700">Teliarganj, Prayagraj, UP 211004</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-500 mr-2" />
                  <a href="tel:05322271089" className="text-gray-700 hover:underline">0532 227 1089</a>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img src="/mnnitHealth.jpg" alt="MNNIT Campus" className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Schedule Section with Filtering */}
      {/* <section className="py-16 bg-white" id="doctors">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Doctors' Duty Schedule</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Doctors are available according to the following schedule. Please check the timings before your
              visit.
            </p>
          </div> */}

          {/* Search and Filter Controls */}
          {/* <div className="mb-8 p-4 bg-blue-50 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by doctor name"
                  className="pl-9 border-blue-200 focus:border-blue-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
                <SelectTrigger className="w-full md:w-48 border-blue-200">
                  <SelectValue placeholder="Filter by specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {specializations
                    .filter((s) => s !== "all")
                    .map((specialization) => (
                      <SelectItem key={specialization} value={specialization}>
                        {specialization}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Select value={filterTime} onValueChange={setFilterTime}>
                <SelectTrigger className="w-full md:w-48 border-blue-200">
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time Slots</SelectItem>
                  {timeSlots
                    .filter((t) => t !== "all")
                    .map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {(searchQuery || filterSpecialization !== "all" || filterTime !== "all") && (
                <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto">
                  Clear Filters
                </Button>
              )}
            </div>
          </div> */}

          {/* Doctor Cards Grid */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className={`h-2 ${getSpecializationColor(doctor.specialization)}`}></div>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${getSpecializationBgColor(doctor.specialization)}`}
                      >
                        <span className="text-xl font-bold text-white">{doctor.name.split(" ")[1][0]}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{doctor.name}</h3>
                        <p className="text-sm text-gray-500">{doctor.specialization}</p>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                            <span>{doctor.date}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 text-blue-500 mr-2" />
                            <span>{doctor.time}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                            <span>{doctor.room}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 text-blue-500 mr-2" />
                            <span>{doctor.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Available</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-blue-50 rounded-full p-6 mb-4">
                  <Search className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No doctors found</h3>
                <p className="mt-2 text-gray-500 max-w-md">
                  No doctors match your search criteria. Please try different filters or clear your search.
                </p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section> */}

      {/* Services Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We provide a wide range of healthcare services to meet the needs of our community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="mt-4">General Consultation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Regular check-ups and consultations for general health concerns.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="mt-4">Prescriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Medication prescriptions and refills for ongoing treatments.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="mt-4">Emergency Care</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Immediate medical attention for urgent health issues.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="mt-4">Health Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Regular health awareness programs and vaccination drives.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
          {/* Simple footer with copyright */}
         <div className="bg-gray-700 text-white py-6 text-center">
            <p className="text-sm text-gray-100">Copyright © {new Date().getFullYear()} - All Rights Reserved - Swasth MNNIT Hospital Unit</p>
        </div>

    </div>
        </>
    )
}

export default Home