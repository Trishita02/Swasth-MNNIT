import React, { useState } from "react";
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
import DashboardLayout from "../../components/DashboardLayout.jsx";
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ManageUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  
  const [users, setUsers] = useState([
    { id: 1, name: "Dr. Sharma", username: "sharma.doctor", role: "doctor", phone: "9876543210" },
    { id: 2, name: "Dr. Kumar", username: "kumar.doctor", role: "doctor", phone: "9876543211" },
    { id: 3, name: "Nurse Patel", username: "patel.staff", role: "staff", phone: "9876543212" },
    { id: 4, name: "Nurse Singh", username: "singh.staff", role: "staff", phone: "9876543213" },
    { id: 5, name: "Admin User", username: "admin.admin", role: "admin", phone: "9876543214" },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    role: "staff",
    phone: "",
  });
  
  const [editingUser, setEditingUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.phone.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    if (newUser.role === 'admin' && !newUser.designation?.trim()) {
    toast.error("Please enter designation for admin");
    return;
  }

  if (newUser.role === 'doctor' && !newUser.specialization?.trim()) {
    toast.error("Please enter specialization for doctor");
    return;
  }

    const username = `${newUser.name.toLowerCase().split(" ")[0]}.${newUser.role}`;

    setUsers([
      ...users,
      {
        id: users.length + 1,
        name: newUser.name,
        username,
        role: newUser.role,
        phone: newUser.phone,
      },
    ]);

    setNewUser({
      name: "",
      role: "staff",
      phone: "",
    });
    
    toast.success("New user has been added successfully");
    setTimeout(() => {
      document.querySelector("[data-state='open']")?.click();
    },800);
  };
  
  const handleEditUser = () => {
    if (!editingUser) return;
    
    if (!editingUser.name.trim() || !editingUser.phone.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    
    setEditingUser(null);
    setIsEditDialogOpen(false);
    
    toast.success("User information has been updated successfully");
    setTimeout(() => {
      document.querySelector("[data-state='open']")?.click();
    },800);
  };
  
  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success("User has been deleted successfully");
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
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newUser.role === 'admin' && (
        <div className="grid gap-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            value={newUser.designation || ''}
            onChange={(e) => setNewUser({ ...newUser, designation: e.target.value })}
            placeholder="Enter designation"
            required={newUser.role === 'admin'}
          />
        </div>
      )}

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
              <SelectItem value="cardiology">Dental</SelectItem>
              <SelectItem value="neurology">Physiotherapist</SelectItem>
              <SelectItem value="pediatrics">Neuro Physician</SelectItem>
              <SelectItem value="orthopedics">Orthopedic</SelectItem>
              <SelectItem value="dermatology">Ayurvedic</SelectItem>
              <SelectItem value="general">Homeopathic</SelectItem>
               <SelectItem value="general">Gynecologist</SelectItem>
                <SelectItem value="general">Pediatrician</SelectItem>
              <SelectItem value="general">General Physician</SelectItem>
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
          <TabsTrigger value="admin">Admins</TabsTrigger>
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
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
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
                          onClick={() => handleDeleteUser(user.id)}
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
                    .map((user) => (
                      <TableRow key={user.id}>
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
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredUsers.filter((user) => user.role === "doctor").length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No doctors found matching your search.
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
                      <TableRow key={user.id}>
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
                            onClick={() => handleDeleteUser(user.id)}
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
        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle>Admins</CardTitle>
              <CardDescription>Manage admin users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers
                    .filter((user) => user.role === "admin")
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email || '-'}</TableCell>
                        <TableCell>{user.designation}</TableCell>
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
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredUsers.filter((user) => user.role === "admin").length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No admin users found matching your search.
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
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={editingUser.role} 
                  onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  placeholder="Enter phone number"
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
      </Dialog>
    </>
  );
}

export default ManageUsers;