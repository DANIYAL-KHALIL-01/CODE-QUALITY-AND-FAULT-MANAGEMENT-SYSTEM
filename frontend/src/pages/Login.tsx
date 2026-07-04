import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  
  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    organization: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!loginData.username || !loginData.password) {
      setErrors({ form: 'Please fill in all fields' });
      return;
    }
    
    setLoading(true);
    const success = await login(loginData.username, loginData.password);
    setLoading(false);
    
    if (success) {
      navigate('/');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    if (!signupData.username || !signupData.email || !signupData.password) {
      setErrors({ form: 'Please fill in all required fields' });
      return;
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    
    if (signupData.password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters' });
      return;
    }
    
    setLoading(true);
    const success = await signup(
      signupData.username,
      signupData.email,
      signupData.password,
      signupData.fullName,
      signupData.organization
    );
    setLoading(false);
    
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#E6EDF3] mb-2">
            Fault Prediction Tool
          </h1>
          <p className="text-[#8B949E]">
            Intelligent test case prioritization for legacy software systems
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#161B22]">
            <TabsTrigger value="login" className="data-[state=active]:bg-[#F97316]">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-[#F97316]">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="bg-[#161B22] border-[#30363D]">
              <CardHeader>
                <CardTitle className="text-[#E6EDF3]">Welcome Back</CardTitle>
                <CardDescription className="text-[#8B949E]">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username" className="text-[#E6EDF3]">
                      Username
                    </Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Enter your username"
                      className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-[#E6EDF3]">
                      Password
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  
                  {errors.form && (
                    <p className="text-sm text-red-500">{errors.form}</p>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full bg-[#F97316] hover:bg-[#F97316]/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="bg-[#161B22] border-[#30363D]">
              <CardHeader>
                <CardTitle className="text-[#E6EDF3]">Create Account</CardTitle>
                <CardDescription className="text-[#8B949E]">
                  Sign up to start analyzing your repositories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username" className="text-[#E6EDF3]">
                      Username <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="Choose a username"
                      className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
                      value={signupData.username}
                      onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-[#E6EDF3]">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-[#E6EDF3]">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="At least 6 characters"
                      className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      disabled={loading}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="text-[#E6EDF3]">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Re-enter your password"
                      className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      disabled={loading}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullname" className="text-[#E6EDF3]">
                      Full Name (Optional)
                    </Label>
                    <Input
                      id="signup-fullname"
                      type="text"
                      placeholder="John Doe"
                      className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-organization" className="text-[#E6EDF3]">
                      Organization (Optional)
                    </Label>
                    <Input
                      id="signup-organization"
                      type="text"
                      placeholder="Your Company"
                      className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
                      value={signupData.organization}
                      onChange={(e) => setSignupData({ ...signupData, organization: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  
                  {errors.form && (
                    <p className="text-sm text-red-500">{errors.form}</p>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full bg-[#F97316] hover:bg-[#F97316]/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Sign Up'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}