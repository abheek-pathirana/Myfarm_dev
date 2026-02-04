import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  gpsLocation: z.string().min(3, 'GPS location is required'),
  birthday: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 13;
  }, 'You must be at least 13 years old'),
  gender: z.enum(['Male', 'Female', 'Other']),
  referralSource: z.enum(['Friends or Family', 'Online', 'Found it Myself', 'Colleagues']),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, login, signup } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    address: '',
    gpsLocation: '',
    birthday: '',
    gender: '',
    referralSource: '',
  });

  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    }
  }, [user, navigate, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });

      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = signupSchema.parse(formData);

      await signup({
        email: validated.email,
        password: validated.password,
        fullName: validated.fullName,
        address: validated.address,
        gpsLocation: validated.gpsLocation,
        birthday: validated.birthday,
        gender: validated.gender,
        referralSource: validated.referralSource,
      });

      toast({
        title: 'Account created!',
        description: 'Welcome to My Farm. You can now start shopping.',
      });

      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-4 bg-[url('https://images.unsplash.com/photo-1595855709940-5776ee7a1160?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        <Card className="w-full max-w-md relative z-10 shadow-2xl border-white/20 bg-white/95 backdrop-blur-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-serif font-bold text-primary">
              {isLogin ? 'Welcome Back' : 'Join Our Community'}
            </CardTitle>
            <CardDescription className="text-base">
              {isLogin
                ? 'Enter your credentials to access your account'
                : 'Start your journey to healthier living today'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="bg-white"
                />
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Farm Lane"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gpsLocation">GPS Location</Label>
                    <Input
                      id="gpsLocation"
                      placeholder="Coordinates or Plus Code"
                      value={formData.gpsLocation}
                      onChange={(e) => setFormData({ ...formData, gpsLocation: e.target.value })}
                      required
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={formData.birthday}
                      onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                      required
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referralSource">How did you hear about us?</Label>
                    <Select
                      value={formData.referralSource}
                      onValueChange={(value) => setFormData({ ...formData, referralSource: value })}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Friends or Family">Friends or Family</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="Found it Myself">Found it Myself</SelectItem>
                        <SelectItem value="Colleagues">Colleagues</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full font-bold text-lg py-6 mt-6" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isLogin ? 'Logging in...' : 'Creating account...'}
                  </>
                ) : isLogin ? (
                  'Login'
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </p>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {isLogin ? "Sign up for free" : 'Login to your account'}
              </button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}