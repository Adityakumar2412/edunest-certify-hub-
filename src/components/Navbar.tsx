
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-4 shadow-sm">
      <div className="edu-container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-blue-600">Education Centre</span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/courses" className="text-gray-700 hover:text-blue-600 transition-colors">
            Courses
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <Avatar className="h-8 w-8">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="hidden md:inline">{user?.name}</span>
              </Link>
              <Button variant="outline" onClick={logout} className="flex items-center gap-2">
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button className="flex items-center gap-2">
                <LogIn size={18} />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
