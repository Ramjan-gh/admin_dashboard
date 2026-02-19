import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User } from '../App';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Sparkles, LogIn, UserPlus } from 'lucide-react';

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
};

export function AuthModal({ open, onClose, onLogin }: AuthModalProps) {
  const [loginPhone, setLoginPhone] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.phone === loginPhone);

    if (user) {
      onLogin(user);
      toast.success('Logged in successfully!');
      onClose();
      setLoginPhone('');
    } else {
      toast.error('User not found. Please register first.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find((u: User) => u.phone === registerPhone)) {
      toast.error('User with this phone number already exists.');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: registerName,
      phone: registerPhone,
      email: registerEmail || undefined,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    onLogin(newUser);
    toast.success('Account created successfully!');
    onClose();
    setRegisterName('');
    setRegisterPhone('');
    setRegisterEmail('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-600" />
            Login or Register
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <motion.form 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleLogin} 
              className="space-y-4 mt-4"
            >
              <div className="space-y-2">
                <Label htmlFor="login-phone">Phone Number</Label>
                <Input
                  id="login-phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  required
                  className="border-2 focus:border-green-500"
                />
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 ">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </motion.div>
            </motion.form>
          </TabsContent>

          <TabsContent value="register">
            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleRegister} 
              className="space-y-4 mt-4"
            >
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Enter your name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                  className="border-2 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-phone">Phone Number</Label>
                <Input
                  id="register-phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  required
                  className="border-2 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email (Optional)</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="border-2 focus:border-green-500"
                />
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 ">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </Button>
              </motion.div>
            </motion.form>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" />
            Optional: Register to save your details and view booking history
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
