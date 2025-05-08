import { useState } from "react";
import { Input } from "../../components/Input.jsx";
import { Button } from "../../components/Button.jsx";
import API from "../../utils/axios.jsx";

export default function AddPatient() {
  const [regNo, setRegNo] = useState("");
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    reg_no: "",
    age: "",
    gender: "",
    address: "",
    blood_group: "",
    dob: "",
    issue: "",
    type: "Student",
    email: "",
    allergies: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    try {
      const res = await API.get(`/staff/getPatientById/${regNo}`);
      if (res.data) {
        const fetchedPatient = res.data;
        setPatient(fetchedPatient);
        setShowForm(false);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setPatient(null);
        setFormData({
          reg_no: regNo,
          name: "",
          age: "",
          gender: "",
          address: "",
          blood_group: "",
          dob: "",
          issue: "",
          type: "Student",
          email: "",
          allergies: "",
        });
        setShowForm(true);
      } else {
        setMessage("Server error. Please try again later.");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.age || !formData.gender || !formData.address || 
        !formData.blood_group || !formData.dob || !formData.issue || !formData.email || 
        !formData.allergies) {
      setMessage("Please fill all required fields");
      return;
    }
      await API.post("/staff/addPatient", formData);
      setMessage("Patient added successfully!");
      setShowForm(false);
    } catch (error) {
      setMessage("Failed to add patient.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add / Find Patient</h2>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Enter Reg No"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {patient && (
        <div className="bg-green-100 p-4 rounded">
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Reg No:</strong> {patient.reg_no}</p>
          <p><strong>Type:</strong> {patient.type}</p>
          <p><strong>Issue:</strong> {patient.issue}</p>
        </div>
      )}

      {showForm && (
  <div className="space-y-4">
    {[
      { label: "Name", name: "name" },
      { label: "Age", name: "age", type: "number" },
      { label: "Address", name: "address" },
      { label: "Blood Group", name: "blood_group" },
      { label: "DOB", name: "dob", type: "date" },
      { label: "Issue", name: "issue", placeholder: "Enter NA if none" },
      { label: "Email", name: "email", type: "email" },
      { label: "Allergies", name: "allergies", placeholder: "Enter NA if none" },
    ].map(({ label, name, type = "text", placeholder }) => (  // Add placeholder here
      <div key={name}>
        <label>{label}</label>
        <Input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}  // Now this will work
        />
      </div>
    ))}
          {/* Gender Dropdown */}
          <div>
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Type Dropdown */}
          <div>
            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
            </select>
          </div>

          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      )}

      {message && <p className="mt-4 text-blue-600">{message}</p>}
    </div>
  );
}
