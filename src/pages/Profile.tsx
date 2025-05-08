
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AuthRequired from "@/components/AuthRequired";
import { Loader, User, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, updateProfile, changePassword, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() === "") {
      toast({
        title: "Invalid name",
        description: "Please enter a valid name",
        variant: "destructive",
      });
      return;
    }
    
    const success = await updateProfile({
      name: name.trim(),
      profilePicture: profilePicture.trim() || undefined,
    });
    
    if (success) {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    const success = await changePassword(currentPassword, newPassword);
    
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <AuthRequired>
        <main className="flex-grow bg-gray-50 py-12">
          <div className="edu-container mx-auto">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-md">
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-blue-100">
                      {user.profilePicture ? (
                        <AvatarImage src={user.profilePicture} alt={user.name} />
                      ) : (
                        <AvatarFallback className="text-lg bg-blue-100 text-blue-800">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl mb-1">{user.name}</CardTitle>
                      <CardDescription className="text-sm">{user.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <Tabs defaultValue="profile">
                    <TabsList className="mb-6">
                      <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User size={16} />
                        Profile
                      </TabsTrigger>
                      <TabsTrigger value="security" className="flex items-center gap-2">
                        <KeyRound size={16} />
                        Security
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="profile">
                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            value={user.email}
                            disabled
                            className="bg-gray-50"
                          />
                          <p className="text-xs text-gray-500">Email cannot be changed</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="profilePicture">Profile Picture URL</Label>
                          <Input
                            id="profilePicture"
                            value={profilePicture}
                            onChange={(e) => setProfilePicture(e.target.value)}
                            placeholder="https://example.com/your-photo.jpg"
                          />
                          <p className="text-xs text-gray-500">Enter a URL to your profile picture</p>
                        </div>
                        
                        <div className="pt-2">
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="security">
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                          />
                        </div>
                        
                        <div className="pt-2">
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              "Change Password"
                            )}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
                  <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </AuthRequired>
      
      <Footer />
    </div>
  );
};

export default Profile;
