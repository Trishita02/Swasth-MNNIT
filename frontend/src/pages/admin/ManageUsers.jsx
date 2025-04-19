import React, { useState,useEffect } from "react";
import { Button } from "../../components/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/Card.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/Dialog.jsx";
import { Input } from "../../components/Input.jsx";
import { Label } from "../../components/Label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/Select.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/Table.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/Tabs.jsx";
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addUserAPI,getAllUsersAPI,deleteUserAPI ,updateUserAPI} from "../../utils/api.jsx";

function ManageUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsersAPI();
      setUsers(response.data || []);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };
  

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff",
    specialization: "", 
  });
  
  const [editingUser, setEditingUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddUser = async() => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.phone.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

  if (newUser.role === 'doctor' && !newUser.specialization?.trim()) {
    toast.error("Please enter specialization for doctor");
    return;
  }
  const exists = users.some(
    (u) => u.email === newUser.email || u.phone === newUser.phone
  );
  
  if (exists) {
    toast.error("User with this email or phone already exists");
    return;
  }
  const username = `${newUser.name.trim().toLowerCase().split(" ")[0]}.${newUser.role}`;

  const userData = {
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    role: newUser.role,
    specialization: newUser.role === 'doctor' ? newUser.specialization : "",
    username,
  };
  try {
    // Call the API to add user
    await addUserAPI(userData);
  setUsers([...users, userData]);

  setNewUser({
    name: "",
    email: "",
    phone: "",
    role: "staff",
    specialization: "",
  });
    
    
    toast.success("New user has been added successfully");
    setTimeout(() => {
      document.querySelector("[data-state='open']")?.click();
    },800);
  }catch(error){
    console.log("error adding user",error)
  }
  };
  
  const handleEditUser = async () => {
    if (!editingUser) return;
  
    try {
      const userData = {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        ...(editingUser.role === 'doctor' && { 
          specialization: editingUser.specialization 
        }),
      };
  
      await updateUserAPI(editingUser.role, editingUser._id, userData);
      toast.success("User updated successfully");
      fetchUsers(); // Refresh the user list
      setIsEditDialogOpen(false); // Close the modal
      
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };
  
  
  const handleDeleteUser = async (role, id) => {
    try {
      await deleteUserAPI(role, id);
      toast.success("User deleted successfully");
      fetchUsers(); // refetch after delete
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (searchType === "name") {
      return user.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchType === "phone") {
      return user.phone.includes(searchQuery);
    }
    return true;
  });

  return (
    <>
    <div className="toast-container">
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      style={{
        top: '1rem',
        right: '1rem',
        width: 'auto',
        maxWidth: '400px',
        zIndex: 9999
      }}
    />
    </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="!w-[150px]">
                <SelectValue placeholder="Search by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="phone">Phone Number</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search by ${searchType}`}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"/>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newUser.role === "doctor" && (
        <div className="grid gap-2">
          <Label htmlFor="specialization">Specialization</Label>
          <Select
            value={newUser.specialization}
            onValueChange={(value) => setNewUser({ ...newUser, specialization: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dental">Dental</SelectItem>
              <SelectItem value="Physiotherapist">Physiotherapist</SelectItem>
              <SelectItem value="Neuro Physician">Neuro Physician</SelectItem>
              <SelectItem value="Orthopedic">Orthopedic</SelectItem>
              <SelectItem value="Ayurvedic">Ayurvedic</SelectItem>
              <SelectItem value="Homeopathic">Homeopathic</SelectItem>
               <SelectItem value="Gynecologist">Gynecologist</SelectItem>
                <SelectItem value="Pediatrician">Pediatrician</SelectItem>
              <SelectItem value="General Physician">General Physician</SelectItem>
            </SelectContent>
          </Select>
        </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                  <p className="text-xs text-muted-foreground">This will be used as the initial password</p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email || '-'}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setEditingUser(user);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setUserToDelete({ role: user.role, id: user._id });
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No users found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="doctors">
  <Card>
    <CardHeader>
      <CardTitle>Doctors</CardTitle>
      <CardDescription>Manage doctors in the system</CardDescription>
    </CardHeader>
    <CardContent>
    <div className="flex items-center gap-4 mb-4">
  <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
    <SelectTrigger className="w-[200px]">
      <SelectValue placeholder="Filter by specialization" />
    </SelectTrigger>
    <SelectContent 
      position="popper"
      side="bottom"
      align="start"
      className="w-[200px] max-h-[300px] overflow-y-auto" // Added max height and scroll
      style={{
        scrollbarWidth: 'thin', // For Firefox
      }}
    >
      <SelectItem value="all">All Specializations</SelectItem>
      <SelectItem value="Dental">Dental</SelectItem>
      <SelectItem value="Physiotherapist">Physiotherapist</SelectItem>
      <SelectItem value="Neuro Physician">Neuro Physician</SelectItem>
      <SelectItem value="Orthopedic">Orthopedic</SelectItem>
      <SelectItem value="Ayurvedic">Ayurvedic</SelectItem>
      <SelectItem value="Homeopathic">Homeopathic</SelectItem>
      <SelectItem value="Gynecologist">Gynecologist</SelectItem>
      <SelectItem value="Pediatrician">Pediatrician</SelectItem>
      <SelectItem value="General Physician">General Physician</SelectItem>
      {/* Add more specializations if needed */}
    </SelectContent>
  </Select>
</div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers
            .filter((user) => user.role === "doctor")
            .filter((user) => 
              specializationFilter === "all" || 
              user.specialization === specializationFilter
            )
            .map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email || '-'}</TableCell>
                <TableCell>{user.specialization || '-'}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setEditingUser(user);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setUserToDelete({ role: user.role, id: user._id });
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          {filteredUsers
            .filter((user) => user.role === "doctor")
            .filter((user) => 
              specializationFilter === "all" || 
              user.specialization === specializationFilter
            ).length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No doctors found matching your criteria.
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</TabsContent>
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Staff</CardTitle>
              <CardDescription>Manage staff members in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers
                    .filter((user) => user.role === "staff")
                    .map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email || '-'}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setEditingUser(user);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setUserToDelete({ role: user.role, id: user._id });
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredUsers.filter((user) => user.role === "staff").length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No staff members found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit User</DialogTitle>
      <DialogDescription>Update user information.</DialogDescription>
    </DialogHeader>
    {editingUser && (
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="edit-name">Full Name</Label>
          <Input
            id="edit-name"
            value={editingUser.name}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            placeholder="Enter full name"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-email">Email</Label>
          <Input
            id="edit-email"
            type="email"
            value={editingUser.email}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            placeholder="Enter email"
            required
          />
        </div>
        {editingUser.role === "doctor" && (
          <div className="grid gap-2">
            <Label htmlFor="edit-specialization">Specialization</Label>
            <Select
              value={editingUser.specialization}
              onValueChange={(value) => setEditingUser({ ...editingUser, specialization: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dental">Dental</SelectItem>
                <SelectItem value="Physiotherapist">Physiotherapist</SelectItem>
                <SelectItem value="Neuro Physician">Neuro Physician</SelectItem>
                <SelectItem value="Orthopedic">Orthopedic</SelectItem>
                <SelectItem value="Ayurvedic">Ayurvedic</SelectItem>
                <SelectItem value="Homeopathic">Homeopathic</SelectItem>
                <SelectItem value="Gynecologist">Gynecologist</SelectItem>
                <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                <SelectItem value="General Physician">General Physician</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="edit-phone">Phone Number</Label>
          <Input
            id="edit-phone"
            value={editingUser.phone}
            onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
            placeholder="Enter phone number"
            required
          />
        </div>
      </div>
    )}
    <DialogFooter>
      <Button onClick={handleEditUser} className="bg-blue-600 hover:bg-blue-700">
        Update User
      </Button>
    </DialogFooter>
  </DialogContent>
  {/* Delete Confirmation Dialog */}
<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this user?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button 
        variant="outline" 
        onClick={() => setIsDeleteDialogOpen(false)}
      >
        Cancel
      </Button>
      <Button 
        variant="destructive"
        onClick={() => {
          if (userToDelete) {
            handleDeleteUser(userToDelete.role, userToDelete.id);
          }
        }}
      >
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
</Dialog>
    </>
  );
}

export default ManageUsers;