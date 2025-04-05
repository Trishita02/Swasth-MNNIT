
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/Tabs.jsx"
import { AlertTriangle, Calendar, Plus, Search } from "lucide-react"

export default function MedicinesInventory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: "Paracetamol 500mg",
      category: "Analgesic",
      stock: 10,
      unit: "strips",
      threshold: 20,
      expiry: "2026-03-30",
    },
    {
      id: 2,
      name: "Azithromycin 250mg",
      category: "Antibiotic",
      stock: 5,
      unit: "strips",
      threshold: 15,
      expiry: "2026-06-15",
    },
    {
      id: 3,
      name: "Cetirizine 10mg",
      category: "Antihistamine",
      stock: 8,
      unit: "strips",
      threshold: 20,
      expiry: "2026-05-22",
    },
    {
      id: 4,
      name: "Ibuprofen 400mg",
      category: "NSAID",
      stock: 12,
      unit: "strips",
      threshold: 25,
      expiry: "2026-04-18",
    },
    {
      id: 5,
      name: "Omeprazole 20mg",
      category: "PPI",
      stock: 30,
      unit: "strips",
      threshold: 15,
      expiry: "2025-04-30",
    },
    {
      id: 6,
      name: "Amoxicillin 500mg",
      category: "Antibiotic",
      stock: 25,
      unit: "strips",
      threshold: 20,
      expiry: "2025-04-15",
    },
  ])

  const [newMedicine, setNewMedicine] = useState({
    name: "",
    category: "",
    stock: "",
    unit: "strips",
    threshold: "",
    expiry: "",
  })

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      {
        id: medicines.length + 1,
        name: newMedicine.name,
        category: newMedicine.category,
        stock: Number.parseInt(newMedicine.stock),
        unit: newMedicine.unit,
        threshold: Number.parseInt(newMedicine.threshold),
        expiry: newMedicine.expiry,
      },
    ])

    setNewMedicine({
      name: "",
      category: "",
      stock: "",
      unit: "strips",
      threshold: "",
      expiry: "",
    })
  }

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

  // Get low stock medicines
  const lowStockMedicines = medicines.filter((m) => m.stock < m.threshold)

  // Get expiring medicines (within 30 days)
  const expiringMedicines = medicines.filter((m) => calculateDaysUntilExpiry(m.expiry) <= 30)

  // Get expired medicines
  const expiredMedicines = medicines.filter((m) => calculateDaysUntilExpiry(m.expiry) <= 0)

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Medicine Inventory</h1>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or category"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> Add Medicine
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Medicine</DialogTitle>
                <DialogDescription>Add a new medicine to the inventory.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Medicine Name</Label>
                  <Input
                    id="name"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                    placeholder="Enter medicine name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newMedicine.category}
                    onChange={(e) => setNewMedicine({ ...newMedicine, category: e.target.value })}
                    placeholder="Enter category"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newMedicine.stock}
                      onChange={(e) => setNewMedicine({ ...newMedicine, stock: e.target.value })}
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={newMedicine.unit}
                      onChange={(e) => setNewMedicine({ ...newMedicine, unit: e.target.value })}
                      placeholder="e.g., strips, bottles"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="threshold">Threshold Quantity</Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={newMedicine.threshold}
                    onChange={(e) => setNewMedicine({ ...newMedicine, threshold: e.target.value })}
                    placeholder="Enter threshold for low stock alert"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    type="date"
                    value={newMedicine.expiry}
                    onChange={(e) => setNewMedicine({ ...newMedicine, expiry: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddMedicine} className="bg-blue-600 hover:bg-blue-700">
                  Add Medicine
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockMedicines.length}</div>
            <p className="text-xs text-muted-foreground">Medicines below threshold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringMedicines.length}</div>
            <p className="text-xs text-muted-foreground">Medicines expiring in 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Calendar className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredMedicines.length}</div>
            <p className="text-xs text-muted-foreground">Medicines already expired</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All Medicines</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Medicine Inventory</CardTitle>
              <CardDescription>View and manage medicine stock</CardDescription>
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicines.map((medicine) => {
                    const daysUntilExpiry = calculateDaysUntilExpiry(medicine.expiry)
                    const isLowStock = medicine.stock < medicine.threshold
                    const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0
                    const isExpired = daysUntilExpiry <= 0

                    return (
                      <TableRow key={medicine.id}>
                        <TableCell className="font-medium">{medicine.name}</TableCell>
                        <TableCell>{medicine.category}</TableCell>
                        <TableCell>
                          {medicine.stock} {medicine.unit}
                        </TableCell>
                        <TableCell>
                          {medicine.threshold} {medicine.unit}
                        </TableCell>
                        <TableCell>{medicine.expiry}</TableCell>
                        <TableCell>
                          {isLowStock && (
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 mr-1">
                              Low Stock
                            </span>
                          )}
                          {isExpiringSoon && (
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                              Expiring Soon
                            </span>
                          )}
                          {isExpired && (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              Expired
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="low-stock">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Medicines</CardTitle>
              <CardDescription>Medicines that need to be restocked</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockMedicines.map((medicine) => (
                    <TableRow key={medicine.id}>
                      <TableCell className="font-medium">{medicine.name}</TableCell>
                      <TableCell>{medicine.category}</TableCell>
                      <TableCell className="text-amber-600 font-medium">
                        {medicine.stock} {medicine.unit}
                      </TableCell>
                      <TableCell>
                        {medicine.threshold} {medicine.unit}
                      </TableCell>
                      <TableCell>{medicine.expiry}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Update Stock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {lowStockMedicines.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No low stock medicines found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expiring">
          <Card>
            <CardHeader>
              <CardTitle>Expiring Soon</CardTitle>
              <CardDescription>Medicines expiring within 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringMedicines
                    .filter((m) => calculateDaysUntilExpiry(m.expiry) > 0)
                    .map((medicine) => (
                      <TableRow key={medicine.id}>
                        <TableCell className="font-medium">{medicine.name}</TableCell>
                        <TableCell>{medicine.category}</TableCell>
                        <TableCell>
                          {medicine.stock} {medicine.unit}
                        </TableCell>
                        <TableCell>{medicine.expiry}</TableCell>
                        <TableCell className="text-amber-600 font-medium">
                          {calculateDaysUntilExpiry(medicine.expiry)} days
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Mark Used
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {expiringMedicines.filter((m) => calculateDaysUntilExpiry(m.expiry) > 0).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No medicines expiring soon.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expired">
          <Card>
            <CardHeader>
              <CardTitle>Expired Medicines</CardTitle>
              <CardDescription>Medicines that have already expired</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiredMedicines.map((medicine) => (
                    <TableRow key={medicine.id}>
                      <TableCell className="font-medium">{medicine.name}</TableCell>
                      <TableCell>{medicine.category}</TableCell>
                      <TableCell>
                        {medicine.stock} {medicine.unit}
                      </TableCell>
                      <TableCell className="text-red-600 font-medium">{medicine.expiry}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Dispose
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {expiredMedicines.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No expired medicines found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

