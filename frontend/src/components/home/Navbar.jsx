import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../Card.jsx";
import {Label} from "../Label.jsx"
import {Input} from "../Input.jsx"
import { Link, useNavigate } from "react-router-dom";
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
    const [email, setEmail] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [emailCode, setEmailCode] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
    const [isDutychartDialogOpen, setIsDutychartDialogOpen] = useState(false)

    const navigate = useNavigate();


    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();
    const day = today.getDay();

    
      const validateEmail = (email) => /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@mnnit\.ac\.in$/.test(email);
    
      const handleChange = (e) => {
        setEmail(e.target.value);
        setIsValid(validateEmail(e.target.value));
      }

      const sendEmail = async () => {
        setIsLoading(true);
        // await send email API
        setTimeout(() => {
          setCodeSent(true);
          setIsLoading(false);
        }, 1500);
      };

      const handleCodeChange = (e, index) => {
        let newCode = emailCode.split("");
        newCode[index] = e.target.value;
        setEmailCode(newCode.join(""));
      };
      
      const resendCode = () => {
        sendEmail(); // Just re-trigger
      };
      
      const verifyEmailCode = async () => {
        setIsVerifying(true);
        // await verify code logic
        setTimeout(() => {
          setIsVerifying(false);
          setEmail("");
          setEmailCode("");
          setIsValid(false);
          setCodeSent(false);
          setIsLoading(false);
          setIsVerifying(false);
          setIsEmailDialogOpen(false);
          setIsDutychartDialogOpen(true);
        }, 1500);
      };

    return(
        <>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
        <div className="flex items-center gap-4">

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

        {/* duty chart email dilog  */}
        <div className="flex  gap-3">
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
      <DialogTrigger asChild>
              <button className="border border-blue-600 px-2 rounded-md hover:bg-blue-700 hover:text-white transition-all duration-400">
                Duty Chart
              </button>
            </DialogTrigger>
        <DialogContent className="max-w-3xl">

        <Card className="w-full mt-3">
  <CardHeader>
    <CardTitle>Verify your email</CardTitle>
  </CardHeader>

  <form onSubmit={(e) => e.preventDefault()}>
    <CardContent className="space-y-4">
      {/* Email Input Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Enter your college email:</Label>
        <Input
          id="email"
          type="email"
          placeholder="college email"
          value={email}
          onChange={handleChange}
          className="outline-black outline-1"
          required
        />
        {!isValid && email !== "" && (
          <p className="text-red-700 text-sm">Please enter a valid college email</p>
        )}
      </div>

      {/* Send Code Button - only show before code sent */}
      {!codeSent && (
        <Button
          type="button"
          onClick={sendEmail}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={!isValid || isLoading || email.trim()===""}
        >
          {isLoading ? "Sending..." : "Send Code"}
        </Button>
      )}

      {/* Code Input and Verify Button - show after code is sent */}
      {codeSent && (
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="emailCode">Enter verification code:</Label>
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <Input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={emailCode[i] || ""}
                  onChange={(e) => handleCodeChange(e, i)}
                  className="w-12 text-center outline-1 outline-black"
                />
              ))}
            </div>
          </div>

          <Button
            type="button"
            onClick={verifyEmailCode}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={emailCode.length !== 4 || isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
          </Button>

          <p className="text-sm text-gray-600 text-center">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={resendCode}
              className="text-blue-600 hover:underline"
            >
              Resend Code
            </button>
          </p>
        </div>
      )}
    </CardContent>
  </form>
        </Card>
           
        </DialogContent>
      </Dialog>

        {/* Right Side: Login Button */}
        <Button onClick={()=>navigate('/login')} className=" bg-blue-600 hover:bg-blue-700">
              Login
        </Button>
        </div>
      </header>

      {/* duty chart table show */}
      <Dialog open={isDutychartDialogOpen} onOpenChange={setIsDutychartDialogOpen}>
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
                              <TableCell>Dr Bhawna verma</TableCell>
                              <TableCell>09:00Am To 11:00Am</TableCell>
                              <TableCell>GF</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>2.</TableCell>
                              <TableCell>Dr. Shirley Paulson</TableCell>
                              <TableCell>11:00Am To 1:00Pm</TableCell>
                              <TableCell>GF</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>3.</TableCell>
                              <TableCell>Dr. Pushkar Nigam</TableCell>
                              <TableCell>On Leave</TableCell>
                              <TableCell>FF 115</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>4.</TableCell>
                              <TableCell>Dr. Seema Sahu</TableCell>
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
                <Button onClick={() => setIsDutychartDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
        </DialogContent>
      </Dialog>
      
        </>
    )
}

export default Navbar;