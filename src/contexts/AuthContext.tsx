import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
  completedQuizzes: Record<string, number>;
  certificates: string[];
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  enrollInCourse: (courseId: string) => void;
  saveQuizResult: (courseId: string, score: number) => void;
  addCertificate: (courseId: string) => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock implementation using localStorage
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('educationCentreUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('educationCentreUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('educationCentreUser');
    }
  }, [user]);

  // Mock user database
  const users = JSON.parse(localStorage.getItem('educationCentreUsers') || '[]');

  const updateUsersInLocalStorage = (updatedUsers: any[]) => {
    localStorage.setItem('educationCentreUsers', JSON.stringify(updatedUsers));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    setIsLoading(false);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome back to Education Centre!",
      });
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser) {
      setIsLoading(false);
      toast({
        title: "Signup failed",
        description: "Email already in use",
        variant: "destructive",
      });
      return false;
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      enrolledCourses: [],
      completedQuizzes: {},
      certificates: [],
    };
    
    const updatedUsers = [...users, newUser];
    localStorage.setItem('educationCentreUsers', JSON.stringify(updatedUsers));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    setIsLoading(false);
    
    toast({
      title: "Signup successful",
      description: "Welcome to Education Centre!",
    });
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const enrollInCourse = (courseId: string) => {
    if (!user) return;
    
    if (user.enrolledCourses.includes(courseId)) {
      toast({
        title: "Already enrolled",
        description: "You are already enrolled in this course",
      });
      return;
    }
    
    const updatedUser = {
      ...user,
      enrolledCourses: [...user.enrolledCourses, courseId],
    };
    
    setUser(updatedUser);
    
    // Update in users array
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, enrolledCourses: updatedUser.enrolledCourses } : u
    );
    localStorage.setItem('educationCentreUsers', JSON.stringify(updatedUsers));
    
    toast({
      title: "Enrollment successful",
      description: "You have successfully enrolled in the course",
    });
  };

  const saveQuizResult = (courseId: string, score: number) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      completedQuizzes: {
        ...user.completedQuizzes,
        [courseId]: score,
      },
    };
    
    setUser(updatedUser);
    
    // Update in users array
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, completedQuizzes: updatedUser.completedQuizzes } : u
    );
    localStorage.setItem('educationCentreUsers', JSON.stringify(updatedUsers));
    
    toast({
      title: "Quiz completed",
      description: `Your score: ${score}%`,
    });
  };

  const addCertificate = (courseId: string) => {
    if (!user) return;
    
    if (user.certificates.includes(courseId)) return;
    
    const updatedUser = {
      ...user,
      certificates: [...user.certificates, courseId],
    };
    
    setUser(updatedUser);
    
    // Update in users array
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, certificates: updatedUser.certificates } : u
    );
    localStorage.setItem('educationCentreUsers', JSON.stringify(updatedUsers));
  };

  // New function to update user profile
  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    
    if (!user) {
      setIsLoading(false);
      return false;
    }
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update user in state
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
      // Update user in "database"
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, ...data } : u
      );
      updateUsersInLocalStorage(updatedUsers);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  // New function to request password reset
  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userExists = users.some((u: any) => u.email === email);
    
    if (userExists) {
      // In a real app, this would send an email
      toast({
        title: "Password reset link sent",
        description: "If an account exists with this email, you will receive a password reset link",
      });
      setIsLoading(false);
      return true;
    } else {
      // For security reasons, don't reveal if email exists or not
      toast({
        title: "Password reset link sent",
        description: "If an account exists with this email, you will receive a password reset link",
      });
      setIsLoading(false);
      return false;
    }
  };

  // New function to change password
  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    
    if (!user) {
      setIsLoading(false);
      return false;
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in "database" and check old password
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    
    if (userIndex === -1 || users[userIndex].password !== oldPassword) {
      toast({
        title: "Password change failed",
        description: "Current password is incorrect",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
    
    // Update password in "database"
    const updatedUsers = [...users];
    updatedUsers[userIndex] = { ...updatedUsers[userIndex], password: newPassword };
    updateUsersInLocalStorage(updatedUsers);
    
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully",
    });
    
    setIsLoading(false);
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated, 
      login, 
      signup, 
      logout,
      enrollInCourse,
      saveQuizResult,
      addCertificate,
      updateProfile,
      resetPassword,
      changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
