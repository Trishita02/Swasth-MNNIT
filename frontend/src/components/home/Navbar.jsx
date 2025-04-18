import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../Card.jsx";
import {Label} from "../Label.jsx"
import {Input} from "../Input.jsx"
import { NavLink,Link, useNavigate } from "react-router-dom";
import { Menu,Home,Calendar} from "lucide-react";
import { Button } from "../Button.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Table.jsx"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../Dialog.jsx"
import { Sheet, SheetContent, SheetTrigger } from "../Sheet.jsx";

function Navbar(){
    const [open, setOpen] = useState(false);
    // const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false)
    const navigate = useNavigate();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();
    const day = today.getDay();

    // const sideMenu = [
    //     { title: "Home", href: `/`, icon: <Home className="h-5 w-5" /> },
    //     { title: "DutyChart", href: "duty-chart", icon: <Calendar className="h-5 w-5" /> },
        
    // ]

      // const [isValid, setIsValid] = useState(true);
    
      // const validateEmail = (email) => /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@mnnit\.ac\.in$/.test(email);
    
      // const handleChange = (e) => {
      //   setEmail(e.target.value);
      //   setIsValid(validateEmail(e.target.value));
      // }

    return(
        <>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
        {/* Left Side: Sidebar Toggle (Mobile), Logo & Title */}
        <div className="flex items-center gap-4">
          {/* <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link to="#" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setOpen(false)}>
                <div className="flex h-15 w-15 items-center justify-center rounded-full overflow-hidden">
                  <img src="/logo.jpg" alt="Swasth MNNIT Logo" className="h-full w-full object-cover" />
                </div>
                <span>Swasth MNNIT</span>
                </Link>
                <div className="grid gap-1">
                  {sideMenu.map((item, index) => (
                    <NavLink
                      key={index}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className={({isActive})=>`
                        " flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ",
                        ${isActive ? " bg-gray-100 text-gray-900 " : "" }
                      `}
                    >
                      {item.icon}
                      {item.title}
                    </NavLink>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet> */}

          {/* Logo & Title */}
          <div className="flex items-center gap-2">
          <div className="flex h-15 w-15 items-center justify-center rounded-full overflow-hidden">
          <img 
            src="/logo.jpg" 
            alt="Swasth MNNIT Logo"
            className="h-full w-full object-cover" 
         />
          </div>
            <span className="text-lg font-semibold text-gray-900">Swasth MNNIT</span>
          </div>
        </div>

        {/* middle nav items */}
        {/* <div className="hidden bg-white md:block">
          <nav className="flex gap-2  text-md">
            {sideMenu.map((item, index) => (
              <NavLink
                key={index}
                to={item.href}
                className={({isActive})=>`
                  " flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ",
                  ${isActive ? "bg-gray-100 text-gray-900" : "" }
                `}
              >
                {item.icon}
                {item.title}
              </NavLink>
            ))}
          </nav>
        </div> */}

        {/* duty chart  */}
        <div className="flex  gap-3">
        <Dialog open={isPrescriptionDialogOpen} onOpenChange={setIsPrescriptionDialogOpen}>
      <DialogTrigger asChild>
              <button className="border border-blue-600 px-2 rounded-md hover:bg-blue-700 hover:text-white transition-all duration-400">
                Duty Chart
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
            <div className="flex h-15 w-15 items-center justify-center rounded-full overflow-hidden">
          <img 
            src="/logo.jpg" 
            alt="Swasth MNNIT Logo"
            className="h-full w-full object-cover" 
            />
          </div>   
          </DialogTitle>
            <DialogDescription>
                <div className="px-2 flex flex-col justify-center items-center font-bold">
                    <span className="text-xl">Health Center</span>
                    <span className="border-b-2 border-gray-600 pb-1">Motilal Nehru National Institute of Techonology Allahabad - 211004</span>
                </div>
            </DialogDescription>
          </DialogHeader>
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <span className="border-b-2 border-gray-600">{`${date}/${month + 1}/${year} (${dayNames[day]}) Duty chart of Doctor's`}</span>
              </div>


                    <div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>SI.No</TableHead>
                            <TableHead>Name Of Doctor's</TableHead>
                            <TableHead>Duty Time</TableHead>
                            <TableHead>Room No.</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                              <TableCell>1.</TableCell>
                              <TableCell>Dr. Bhawna Verma</TableCell>
                              <TableCell>09:00Am To 11:00Am</TableCell>
                              <TableCell>GF</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>2.</TableCell>
                              <TableCell>Dr. Sherley Paulson</TableCell>
                              <TableCell>11:00Am To 1:00Pm</TableCell>
                              <TableCell>GF</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>3.</TableCell>
                              <TableCell>Dr. Avinash Jaiswal</TableCell>
                              <TableCell>On Leave</TableCell>
                              <TableCell>FF 115</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>4.</TableCell>
                              <TableCell>Dr. Nidhi Bothaju</TableCell>
                              <TableCell>On Leave</TableCell>
                              <TableCell>FF 113</TableCell>
                            </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">Contact: 0532-2271089</h4>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Dr. Shailndra kumar Mishra</h4>
                        <p>(Medical Officer In-Charge)</p>
                      </div>
                    </div>

              <DialogFooter>
                <Button onClick={() => setIsPrescriptionDialogOpen(false)}>Close</Button>
                {/* <Button className="bg-blue-600 hover:bg-blue-700 mb-1">Print</Button> */}
              </DialogFooter>
            </div>
        </DialogContent>
        {/* <DialogContent className="max-w-3xl">
        <Card className="w-full mt-3">
        <CardHeader>
          <CardTitle>Varify your email</CardTitle>
        </CardHeader>
        <form>
          <CardContent className="space-y-4">
            <div className="space-y-2 relative">
              <Label htmlFor="email">Enter your college email:</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="college email"
                  value={email}
                  onChange={handleChange}
                  // className={`border p-2 ${isValid ? "border-green-500" : "border-red-500"}`}
                  required
                />
                {!isValid && email !== "" && (
        <p className="text-red-500">please enter valid college email</p>
      )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={!isValid}>
              {isLoading ? "sending..." : "send code"}
            </Button>
          </CardFooter>
        </form>
      </Card>
           
        </DialogContent> */}
      </Dialog>

        {/* Right Side: Login Button */}
        <Button type="submit" onClick={()=>navigate('/login')} className=" bg-blue-600 hover:bg-blue-700">
              Login
        </Button>
        </div>
      </header>

      {/* <Dialog open={isPrescriptionDialogOpen} onOpenChange={setIsPrescriptionDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
            <div className="flex h-15 w-15 items-center justify-center rounded-full overflow-hidden">
          <img 
            src="/logo.jpg" 
            alt="Swasth MNNIT Logo"
            className="h-full w-full object-cover" 
            />
          </div>   
          </DialogTitle>
            <DialogDescription>
                <div className=" px-2 flex flex-col justify-center items-center font-bold">
                    <span className="text-xl">Health Center</span>
                    <span className="border-b-2 border-gray-600 pb-1">Motilal Nehru National Institute of Techonology Allahabad - 211004</span>
                </div>
            </DialogDescription>
          </DialogHeader>
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <span className="border-b-2 border-gray-600">{`${date}/${month + 1}/${year} (${dayNames[day]}) Duty chart of Doctor's`}</span>
              </div>


                    <div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>SI.No</TableHead>
                            <TableHead>Name Of Doctor's</TableHead>
                            <TableHead>Duty Time</TableHead>
                            <TableHead>Room No.</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                              <TableCell>1.</TableCell>
                              <TableCell>sfd</TableCell>
                              <TableCell>09:00Am To 11:00Am</TableCell>
                              <TableCell>GF</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>2.</TableCell>
                              <TableCell>sfd</TableCell>
                              <TableCell>11:00Am To 1:00Pm</TableCell>
                              <TableCell>GF</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>3.</TableCell>
                              <TableCell>sfd</TableCell>
                              <TableCell>On Leave</TableCell>
                              <TableCell>FF 115</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>4.</TableCell>
                              <TableCell>sfd</TableCell>
                              <TableCell>On Leave</TableCell>
                              <TableCell>FF 113</TableCell>
                            </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">Contact: 0532-2271089</h4>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Dr. Shailndra kumar Mishra</h4>
                        <p>(Medical Officer In-Charge)</p>
                      </div>
                    </div>

              <DialogFooter>
                <Button onClick={() => setIsPrescriptionDialogOpen(false)}>Close</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 mb-1">Print</Button>
              </DialogFooter>
            </div>
        </DialogContent>
      </Dialog> */}
      
        </>
    )
}

export default Navbar;