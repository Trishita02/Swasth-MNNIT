
import { useEffect, useState } from "react"
import { Button } from "../../components/Button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx"
import { Input } from "../../components/Input.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table.jsx"
import { AlertTriangle, Bell, Calendar, Search } from "lucide-react"
import API from "../../utils/axios.jsx"

export default function MedicineStock() {
  const [searchQuery, setSearchQuery] = useState("")
  const [medicines, setMedicines] = useState([])
  
  useEffect(() => {
    // Fetch medicines from the server (mocked here for demonstration)
    const fetchMedicines = async () => {
      try {
        const response = await API.get("/doctor/getAllMedicines") // Replace with your API endpoint
        console.log(response)
        const data = await response.data
        setMedicines(data)
      } catch (error) {
        console.error("Error fetching medicines:", error)
      }
    } 
    fetchMedicines()
  }, []);


  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate days until expiry
  const calculateDaysUntilExpiry = (expiryDate) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleSendNotification = () => {
    // In a real app, this would send a notification to staff
    alert("Notification sent to staff successfully!")
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Medicine Stock</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or category"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicines.filter((m) => m.stock < m.threshold).length}</div>
            <p className="text-xs text-muted-foreground">Medicines below threshold</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={handleSendNotification}>
              <Bell className="mr-2 h-4 w-4" /> Notify Staff
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {medicines.filter((m) => calculateDaysUntilExpiry(m.expiry) <= 30).length}
            </div>
            <p className="text-xs text-muted-foreground">Medicines expiring in 30 days</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={handleSendNotification}>
              <Bell className="mr-2 h-4 w-4" /> Notify Staff
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicines.length}</div>
            <p className="text-xs text-muted-foreground">Different medicines in stock</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Medicine Inventory</CardTitle>
          <CardDescription>View medicine stock and expiry dates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.map((medicine) => {
                const daysUntilExpiry = calculateDaysUntilExpiry(medicine.expiry)
                const isLowStock = medicine.stock < medicine.threshold
                const isExpiringSoon = daysUntilExpiry <= 30

                return (
                  <TableRow key={medicine._id}>
                    <TableCell className="font-medium">{medicine.name}</TableCell>
                    <TableCell>{medicine.category}</TableCell>
                    <TableCell>
                      {medicine.stock} {medicine.unit}
                    </TableCell>
                    <TableCell>
                      {medicine.threshold} {medicine.unit}
                    </TableCell>
                    <TableCell>{medicine.expiry?.slice(0, 10)}</TableCell>
                    <TableCell>
                      {isLowStock && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 mr-1">
                          Low Stock
                        </span>
                      )}
                      {isExpiringSoon && (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          Expiring Soon
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

