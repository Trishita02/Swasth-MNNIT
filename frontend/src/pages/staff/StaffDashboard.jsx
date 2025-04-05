import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx"
import { AlertTriangle, Calendar, Package, Users } from "lucide-react"

export default function StaffDashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients Served</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">+5 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Prescriptions</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Waiting for pickup</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Medicines need restock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Prescriptions</CardTitle>
            <CardDescription>Prescriptions waiting for pickup</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Rahul Sharma", id: "BT21CS001", time: "10 minutes ago", doctor: "Dr. Kumar" },
                { name: "Priya Singh", id: "BT21EC045", time: "1 hour ago", doctor: "Dr. Sharma" },
                { name: "Amit Kumar", id: "BT20ME032", time: "2 hours ago", doctor: "Dr. Kumar" },
                { name: "Neha Gupta", id: "BT22CS078", time: "Yesterday", doctor: "Dr. Sharma" },
              ].map((prescription, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {prescription.name} <span className="text-muted-foreground">({prescription.id})</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {prescription.doctor} • {prescription.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Medicines</CardTitle>
            <CardDescription>Medicines that need to be restocked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Paracetamol 500mg", stock: "10 strips", threshold: "20 strips" },
                { name: "Azithromycin 250mg", stock: "5 strips", threshold: "15 strips" },
                { name: "Cetirizine 10mg", stock: "8 strips", threshold: "20 strips" },
                { name: "Ibuprofen 400mg", stock: "12 strips", threshold: "25 strips" },
              ].map((medicine, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{medicine.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Current: {medicine.stock} • Threshold: {medicine.threshold}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

