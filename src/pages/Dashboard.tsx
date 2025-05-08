
import { useCourses } from "@/contexts/CourseContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import AuthRequired from "@/components/AuthRequired";
import { Award, BookOpen, CheckCircle } from "lucide-react";

const Dashboard = () => {
  const { courses } = useCourses();
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }
  
  const enrolledCourses = courses.filter((course) => 
    user.enrolledCourses.includes(course.id)
  );
  
  const certificateCourses = courses.filter((course) => 
    user.certificates.includes(course.id)
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <AuthRequired>
        <main className="flex-grow">
          <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
            <div className="edu-container mx-auto">
              <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
              <p className="text-xl">Track your learning progress and certificates</p>
            </div>
          </section>
          
          <section className="py-12">
            <div className="edu-container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Enrolled Courses
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.enrolledCourses.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {user.enrolledCourses.length === 0 ? "No courses enrolled" : "Currently enrolled"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Quizzes Completed
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Object.keys(user.completedQuizzes).length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Out of {user.enrolledCourses.length} enrolled courses
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Certificates Earned
                    </CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.certificates.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {user.certificates.length === 0 
                        ? "Complete quizzes with 90%+ to earn" 
                        : "Congratulations!"
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="enrolled" className="space-y-8">
                <TabsList>
                  <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
                  <TabsTrigger value="certificates">My Certificates</TabsTrigger>
                </TabsList>
                
                <TabsContent value="enrolled">
                  {enrolledCourses.length > 0 ? (
                    <div className="space-y-8">
                      {enrolledCourses.map((course) => {
                        const quizScore = user.completedQuizzes[course.id] ?? 0;
                        const hasCertificate = user.certificates.includes(course.id);
                        
                        return (
                          <Card key={course.id} className="overflow-hidden">
                            <div className="md:flex">
                              <div className="md:w-1/4 bg-gray-100 flex items-center justify-center p-6">
                                <div className="text-center">
                                  <div className="text-3xl font-bold mb-2">
                                    {quizScore ? `${quizScore}%` : "—"}
                                  </div>
                                  <p className="text-sm text-gray-500">Quiz Score</p>
                                </div>
                              </div>
                              <div className="md:w-3/4 p-6">
                                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                                <p className="text-gray-600 mb-4">{course.description}</p>
                                
                                <div className="mb-4">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Progress</span>
                                    <span>{quizScore ? `${quizScore}%` : "Not started"}</span>
                                  </div>
                                  <Progress value={quizScore} className="h-2" />
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div>
                                    {hasCertificate && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <Award className="mr-1 h-3 w-3" />
                                        Certificate Earned
                                      </span>
                                    )}
                                  </div>
                                  <Link to={`/courses/${course.id}`} className="text-blue-600 hover:underline text-sm">
                                    {quizScore ? "View Course" : "Start Learning"}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>No Courses Yet</CardTitle>
                        <CardDescription>
                          You haven't enrolled in any courses yet.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link to="/courses" className="text-blue-600 hover:underline">
                          Browse our courses and start learning today
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="certificates">
                  {certificateCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {certificateCourses.map((course) => (
                        <Card key={course.id} className="overflow-hidden">
                          <CardHeader className="bg-blue-50 pb-2">
                            <div className="flex justify-between">
                              <CardTitle>{course.title}</CardTitle>
                              <Award className="h-5 w-5 text-blue-600" />
                            </div>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <p className="text-gray-600 mb-4">{course.description}</p>
                            <p className="text-sm text-gray-500 mb-2">
                              Score: <span className="font-semibold">{user.completedQuizzes[course.id]}%</span>
                            </p>
                            <Link 
                              to={`/courses/${course.id}`} 
                              state={{ activeTab: "certificate" }}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              View Certificate
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>No Certificates Yet</CardTitle>
                        <CardDescription>
                          Complete course quizzes with at least 90% score to earn certificates.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {enrolledCourses.length > 0 ? (
                          <p>
                            You have {enrolledCourses.length} enrolled courses. Complete their quizzes 
                            to earn certificates.
                          </p>
                        ) : (
                          <Link to="/courses" className="text-blue-600 hover:underline">
                            Browse our courses and start learning today
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </main>
      </AuthRequired>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
