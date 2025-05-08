
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/Tabs.jsx"
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/Select.jsx"; 
import { AlertTriangle, Calendar, Plus, Search } from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from "../../utils/axios.jsx"

export default function MedicinesInventory() {

  const [editingMedicine, setEditingMedicine] = useState({medicineName: "",
    batchNumber: "",
    type: "",
    expiryDate: "",
    quantity: 0,
    invoiceDate: "",
    invoiceNumber: "",
    supplier: "",});

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("")
    const [medicines, setMedicines] = useState([]);
    
    const [newMedicine, setNewMedicine] = useState({
      medicineName: "",
      batchNumber: "",
      type: "",
      expiryDate: "",
      quantity: 0,
      invoiceDate: "",
      invoiceNumber: "",
      supplier: "",
    });
    const [lowStockUpdate, setLowStockUpdate] = useState({
      id: "",
      quantity: 0,
    });
    const [isLowStockDialogOpen, setIsLowStockDialogOpen] = useState(false);
    useEffect(()=>{
      const fetchMedicines = async () => {
        try {
          const response = await API.get("/doctor/getAllMedicines")
          setMedicines(response.data)
        } catch (error) {
          console.error("Error fetching medicines:", error)
        }
      }
      fetchMedicines()
    }, [])

  const medicineTypes = [
    "Tablet",
    "Capsule",
    "Syrup",
    "Injection",
    "Ointment",
    "Drops",
    "Cream",
    "Gel",
    "Powder",
    "Inhaler",
    "Lotion",
    "Spray",
    "Suppository",
    "Patch",
    "Solution",
    "Suspension",
    "Granules",
    "Lozenge",
    "Nasal Spray",
    "Ear Drops",
    "Eye Ointment"
  ];
  
  const handleAddMedicine = async () => {
    const {
      medicineName,
      batchNumber,
      type,
      expiryDate,
      quantity,
      invoiceDate,
      invoiceNumber,
      supplier,
    } = newMedicine;
  
    if (
      !medicineName.trim() ||
      !batchNumber.trim() ||
      !type.trim() ||
      !expiryDate.trim() ||
      !invoiceDate.trim() ||
      !invoiceNumber.trim() ||
      !supplier.trim() ||
      quantity === 0
    ) {
      toast.error("Please fill out all fields", { autoClose: 2000 });
      return;
    }
    
    if(quantity <= 0 || !Number.isInteger(Number(quantity))) {
      toast.error("Please fill right quantity", { autoClose: 2000 });
      return;
    }
  
    try {
      const res = await API.post("/staff/addMedicine", {
        ...newMedicine
      });
      
      if(res.status === 200) {
        toast.success("Added new medicine", { autoClose: 2000 });
        
        // Fetch the updated list of medicines
        const response = await API.get("/doctor/getAllMedicines");
        setMedicines(response.data);
        
        // Reset form
        setNewMedicine({
          medicineName: "",
          batchNumber: "",
          type: "",
          expiryDate: "",
          quantity: 0,
          invoiceDate: "",
          invoiceNumber: "",
          supplier: "",
        });
        setIsAddDialogOpen(false); 
      }
    } catch (error) {
      console.error("Error adding medicine:", error);
      console.log(error)
      toast.error(error.response?.data?.message || "Error adding medicine", { autoClose: 2000 });

    }
  };

  const handleEditMedicine = async () => {
    if (!editingMedicine) return;
  
    const {
      medicineName,
      batchNumber,
      type,
      expiryDate,
      quantity,
      invoiceDate,
      invoiceNumber,
      supplier,
    } = editingMedicine;
  
    // Validation checks...
  
    try {
      const res = await API.post("/staff/updateMedicine", {
        ...editingMedicine
      });
      
      if(res.status === 200) {
        toast.success("Updated medicine", { autoClose: 2000 });
        
        // Fetch the updated list of medicines
        const response = await API.get("/doctor/getAllMedicines");
        setMedicines(response.data);
        
        setEditingMedicine({
          medicineName: "",
          batchNumber: "",
          type: "",
          expiryDate: "",
          quantity: 0,
          invoiceDate: "",
          invoiceNumber: "",
          supplier: "",
        });
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating medicine:", error);
      toast.error(error.response?.data?.message||"Error updating medicine", { autoClose: 2000 });
    }
  };
  
  const handleLowStockUpdate = async () => {
    if (!lowStockUpdate.id || lowStockUpdate.quantity <= 0) {
      toast.error("Please enter a valid quantity", { autoClose: 2000 });
      return;
    }
  
    try {
      const res = await API.post("/staff/updateLowStock", {
        id: lowStockUpdate.id,
        quantity: lowStockUpdate.quantity,
      });
      
      if(res.status === 200) {
        toast.success("Stock updated successfully", { autoClose: 2000 });
        
        // Fetch the updated list of medicines
        const response = await API.get("/doctor/getAllMedicines");
        setMedicines(response.data);
        
        setLowStockUpdate({
          id: "",
          quantity: 0,
        });
        setIsLowStockDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error(error.response?.data?.message || "Error updating stock", { autoClose: 2000 });
    }
  };

  const filteredMedicines = medicines.filter((medicine) => {
    if (!medicine || typeof medicine !== "object") return false;
  
    // console.log("Checking:", medicine);
  
    const name = medicine.name || "";
    const category = medicine.category || "";
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

const disposeMedicine = async (medicine) => {
  try {
    const res = await API.post("/staff/disposeMedicine", {
      id: medicine._id,
    });
    if (res.status === 200) {
      toast.success("Disposed medicine", {
        autoClose: 2000,
      });
      // Update the medicines state by removing the disposed medicine
      setMedicines(prevMedicines => prevMedicines.filter((m) => m._id !== medicine._id));
    }
  } catch (error) {
    console.error("Error disposing medicine:", error);
    toast.error("Error disposing medicine", {
      autoClose: 2000,
    });
  }
}
  

  // Calculate days until expiry
  const calculateDaysUntilExpiry = (expiryDate) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get low stock medicines
  const lowStockMedicines = medicines.filter((m) => m.stock < 10)

  // Get expiring medicines (within 30 days)
  const expiringMedicines = medicines.filter((m) => {
    const days = calculateDaysUntilExpiry(m.expiry);
    return days > 0 && days <= 30;
  });
  

  // Get expired medicines
  const expiredMedicines = medicines.filter((m) => calculateDaysUntilExpiry(m.expiry) <= 0)

  return (
    <>
     <ToastContainer 
        position="top-right"
        autoClose={2000}
        
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
        <h1 className="text-2xl font-bold">Medicine Inventory</h1>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or type"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700"  onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Medicine
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Medicine to Inventory !!!</DialogTitle>
                {/* <DialogDescription>Add a new medicine to the inventory.</DialogDescription> */}
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-4">
                {/* <div className="grid gap-2">
                  <Label htmlFor="saltName">Salt Name</Label>
                  <Input
                    id="saltName"
                    value={newMedicine.saltName}
                    onChange={(e) => setNewMedicine({ ...newMedicine, saltName: e.target.value })}
                    placeholder="Salt"
                  />
                </div> */}
                <div className="grid gap-2">
                  <Label htmlFor="medicineName">Medicine Name</Label>
                  <Input
                    id="medicineName"
                    value={newMedicine.medicineName}
                    onChange={(e) => setNewMedicine({ ...newMedicine, medicineName: e.target.value })}
                    placeholder="Paracetamol"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="batchNumber">Batch No.:</Label>
                  <Input
                    id="batchNumber"
                    value={newMedicine.batchNumber}
                    onChange={(e) => setNewMedicine({ ...newMedicine, batchNumber: e.target.value })}
                    placeholder=""
                  />
                </div>
               <div className="grid gap-2">
               <Label htmlFor="type">Medicine Type</Label>
                <Select
                id="type"
                  value={newMedicine.type}
                  onValueChange={(value) => setNewMedicine({ ...newMedicine, type: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select medicine type" />
                  </SelectTrigger>

                  <SelectContent className="max-h-48 overflow-y-auto">
                    {medicineTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newMedicine.expiryDate}
                    onChange={(e) => setNewMedicine({ ...newMedicine, expiryDate: e.target.value })}
                  />
                </div>
               
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity:</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={newMedicine.quantity}
                    onChange={(e) => setNewMedicine({ ...newMedicine, quantity: e.target.value })}
                    placeholder=""
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="invoiceDate">Invoice Date:</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={newMedicine.invoiceDate}
                    onChange={(e) => setNewMedicine({ ...newMedicine, invoiceDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="invoiceNumber">Invoice No.:</Label>
                  <Input
                    id="invoiceNumber"
                    value={newMedicine.invoiceNumber}
                    onChange={(e) => setNewMedicine({ ...newMedicine, invoiceNumber: e.target.value })}
                    placeholder=""
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier">Supplier:</Label>
                  <Input
                    id="supplier"
                    value={newMedicine.supplier}
                    onChange={(e) => setNewMedicine({ ...newMedicine, supplier: e.target.value })}
                    placeholder=""
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
            {/* table */}
            <div className="w-full border rounded-md overflow-hidden text-sm">
  {/* Header */}
  <div className="grid grid-cols-8 gap-2 px-4 py-2 bg-gray-100 font-semibold text-gray-700">
    {/* <div className="col-span-1">Salt Name</div> */}
    <div className="col-span-1">Medicine Name</div>
    <div className="col-span-1">Batch</div>
    <div className="col-span-1">Type</div>
    <div className="col-span-1">Stock</div>
    <div className="col-span-1">Expiry Date</div>
    <div className="col-span-1">Status</div>
    <div className="col-span-1">Days Left</div>
    <div className="col-span-1 text-right">Actions</div>
  </div>

  {/* Body */}
  <div className="max-h-[300px] overflow-y-auto">
    {filteredMedicines.map((medicine) => {
      const daysUntilExpiry = calculateDaysUntilExpiry(medicine.expiry);
      const isLowStock = medicine.stock < 10;
      const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      const isExpired = daysUntilExpiry <= 0;

      return (
        <div
          key={medicine.id}
          className="grid grid-cols-8 gap-2 px-4 py-2 items-center text-gray-800 border-b hover:bg-gray-50"
        >
          {/* <div className="col-span-1 truncate">{medicine.saltName}</div> */}
          <div className="col-span-1 font-medium truncate">{medicine.name}</div>
          <div className="col-span-1 truncate">{medicine.batches[0].batch_no}</div>
          <div className="col-span-1">{medicine.category}</div>
          <div className="col-span-1">{medicine.stock}</div>
          <div className="col-span-1">{medicine.expiry?.slice(0, 10)}</div>

          {/* Status */}
          <div className="col-span-1 space-y-1">
            {isLowStock && (
              <span className="block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800 w-fit">
                Low Stock
              </span>
            )}
            {isExpiringSoon && (
              <span className="block rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800 w-fit">
                Expiring Soon
              </span>
            )}
            {isExpired && (
              <span className="block rounded bg-red-100 px-2 py-0.5 text-xs text-red-800 w-fit">
                Expired
              </span>
            )}
            {!isLowStock && !isExpiringSoon && !isExpired && (
            <span className="block rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 w-fit">
              Up-to-Date
            </span>
            )}
          </div>

          {/* Days Left */}
          <div className="col-span-1">
            {isExpired ? (
              <span className="text-red-600">Expired</span>
            ) : (
              `${daysUntilExpiry} days`
            )}
          </div>

          {/* Actions */}
          <div className="col-span-1 text-right">
          <button 
  className="px-2 py-1 text-xs rounded border hover:bg-gray-100"
  onClick={() => {
    // Format dates for the input fields (YYYY-MM-DD)
    const formattedExpiry = medicine.expiry?.split('T')[0] || "";
    const formattedInvoiceDate = medicine.batches[0].invoice_date?.split('T')[0] || "";
    
    setEditingMedicine({
      id: medicine._id,
      medicineName: medicine.name,
      batchNumber: medicine.batches[0].batch_no,
      type: medicine.category,
      expiryDate: formattedExpiry,
      quantity: medicine.stock,
      invoiceDate: formattedInvoiceDate,
      invoiceNumber: medicine.batches[0].invoice_no || "",
      supplier: medicine.supplier || "",
    });
    setIsEditDialogOpen(true);
  }}
>
  Update
</button>
            
          </div>
        </div>
      );
    })}
  </div>
             </div>
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
      {/* table */}
      <div className="w-full border rounded-md overflow-hidden text-sm">
  {/* Header */}
  <div className="grid grid-cols-5 gap-2 px-4 py-2 bg-gray-100 font-semibold text-gray-700">
    <div>Medicine Name</div>
    <div>Quantity</div>
    <div>Type</div>
    <div>Expiry Date</div>
    <div className="text-right">Actions</div>
  </div>

  {/* Body */}
  <div className="max-h-[300px] overflow-y-auto">
    {lowStockMedicines.length > 0 ? (
      lowStockMedicines.map((medicine) => (
        <div
          key={medicine.id}
          className="grid grid-cols-5 gap-2 px-4 py-2 items-center border-b hover:bg-gray-50"
        >
          <div className="font-medium truncate">{medicine.name}</div>
          <div className="text-amber-600 font-medium">
            {medicine.stock} {medicine.category}
          </div>
          <div>
            {medicine.category}
          </div>
          <div>{medicine.expiry?.slice(0, 10)}</div>
          <div className="text-right">
            <button 
  className="px-2 py-1 text-xs rounded border hover:bg-gray-100"
  onClick={() => {
    setLowStockUpdate({
      id: medicine._id,
      quantity: medicine.stock,
    });
    setIsLowStockDialogOpen(true);
  }}
>
  Update Stock
</button>
          </div>
        </div>
      ))
    ) : (
      <div className="px-4 py-6 text-center text-gray-500">
        No low stock medicines found.
      </div>
    )}
  </div>
    </div>

     

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
      {/* table */}
      <div className="w-full border rounded-md overflow-hidden text-sm">
  {/* Header */}
  <div className="grid grid-cols-5 gap-2 px-4 py-2 bg-gray-100 font-semibold text-gray-700">
    <div>Medicine Name</div>
    <div>Quantity</div>
    <div>Expiry Date</div>
    <div>Days Left</div>
    <div className="text-right">Actions</div>
  </div>

  {/* Body */}
  <div className="max-h-[300px] overflow-y-auto">
    {expiringMedicines.filter((m) => calculateDaysUntilExpiry(m.expiry) > 0).length > 0 ? (
      expiringMedicines
        .filter((m) => calculateDaysUntilExpiry(m.expiry) > 0)
        .map((medicine) => (
          <div
            key={medicine.id}
            className="grid grid-cols-5 gap-2 px-4 py-2 items-center border-b hover:bg-gray-50"
          >
            <div className="font-medium truncate">{medicine.name}</div>
            <div>
              {medicine.stock} {medicine.category}
            </div>
            <div>{medicine.expiry?.slice(0, 10)}</div>
            <div className="text-amber-600 font-medium">
              {calculateDaysUntilExpiry(medicine.expiry)} days
            </div>
            <div className="text-right">
              <button onClick={()=>{disposeMedicine(medicine)}} className="px-2 py-1 text-xs rounded border hover:bg-gray-100">
                Mark Used
              </button>
            </div>
          </div>
        ))
    ) : (
      <div className="px-4 py-6 text-center text-gray-500">
        No medicines expiring soon.
      </div>
    )}
  </div>
</div>

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
     {/* table */}
     <div className="w-full border rounded-md overflow-hidden text-sm">
  {/* Header */}
  <div className="grid grid-cols-4 gap-2 px-4 py-2 bg-gray-100 font-semibold text-gray-700">
    <div>Medicine Name</div>
    <div>Quantity</div>
    <div>Expiry Date</div>
    <div className="text-right">Actions</div>
  </div>

  {/* Body */}
  <div className="max-h-[300px] overflow-y-auto">
    {expiredMedicines.length > 0 ? (
      expiredMedicines.map((medicine) => (
        <div
          key={medicine.id}
          className="grid grid-cols-4 gap-2 px-4 py-2 items-center border-b hover:bg-gray-50"
        >
          <div className="font-medium truncate">{medicine.name}</div>
          <div>
            {medicine.stock} {medicine.category}
          </div>
          <div className="text-red-600 font-medium">{medicine.expiry?.slice(0, 10)}</div>
          <div className="text-right">
            <button onClick={()=>{disposeMedicine(medicine)}} className="px-2 py-1 text-xs rounded border hover:bg-gray-100">
              Dispose
            </button>
          </div>
        </div>
      ))
    ) : (
      <div className="px-4 py-6 text-center text-gray-500">
        No expired medicines found.
      </div>
    )}
  </div>
</div>

    </CardContent>
  </Card>
        </TabsContent>

      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Medicine to Inventory !!!</DialogTitle>
                <DialogDescription>Update Medicine</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="medicineName">Medicine Name</Label>
                  <Input
                    id="medicineName"
                    value={editingMedicine.medicineName}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, medicineName: e.target.value })}
                    placeholder="Paracetamol"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="batchNumber">Batch No.:</Label>
                  <Input
                    id="batchNumbner"
                    value={editingMedicine.batchNumber}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, batchNumber: e.target.value })}
                    placeholder=""
                  />
                </div>
               <div className="grid gap-2">
               <Label htmlFor="type">Medicine Type</Label>
                <Select
                id="type"
                  value={editingMedicine.type}
                  onValueChange={(value) => setEditingMedicine({ ...editingMedicine, type: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select medicine type" />
                  </SelectTrigger>

                  <SelectContent className="max-h-48 overflow-y-auto">
                    {medicineTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={editingMedicine.expiryDate}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, expiryDate: e.target.value })}
                  />
                </div>
               
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity:</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={editingMedicine.quantity}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, quantity: e.target.value })}
                    placeholder=""
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="invoiceDate">Invoice Date:</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={editingMedicine.invoiceDate}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, invoiceDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="invoiceNumber">Invoice No.:</Label>
                  <Input
                    id="invoiceNumber"
                    value={editingMedicine.invoiceNumber}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, invoiceNumber: e.target.value })}
                    placeholder=""
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier">Supplier:</Label>
                  <Input
                    id="supplier"
                    value={editingMedicine.supplier}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, supplier: e.target.value })}
                    placeholder=""
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleEditMedicine} className="bg-blue-600 hover:bg-blue-700">
                  Update Medicine
                </Button>
              </DialogFooter>
      </DialogContent>
      </Dialog>
      <Dialog open={isLowStockDialogOpen} onOpenChange={setIsLowStockDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Update Stock Level</DialogTitle>
      <DialogDescription>Increase the stock quantity for this medicine</DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="quantity">New Quantity:</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={lowStockUpdate.quantity}
          onChange={(e) => setLowStockUpdate({
            ...lowStockUpdate,
            quantity: parseInt(e.target.value) || 0
          })}
        />
      </div>
    </div>
    <DialogFooter>
      <Button onClick={handleLowStockUpdate} className="bg-blue-600 hover:bg-blue-700">
        Update Stock
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </>
  )
}