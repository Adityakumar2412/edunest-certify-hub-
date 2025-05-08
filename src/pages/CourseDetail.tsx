
import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useCourses } from "@/contexts/CourseContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthRequired from "@/components/AuthRequired";
import Quiz from "@/components/Quiz";
import Certificate from "@/components/Certificate";
import { Loader, Book, Award, CheckCircle2 } from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getCourse, loading } = useCourses();
  const { user, isAuthenticated, enrollInCourse, addCertificate } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  
  const course = id ? getCourse(id) : undefined;
  
  const isEnrolled = user?.enrolledCourses.includes(id || "");
  const hasCertificate = user?.certificates.includes(id || "");
  const previousScore = user?.completedQuizzes[id || ""] ?? 0;
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-lg">Loading course details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!course) {
    return <Navigate to="/courses" />;
  }
  
  const handleEnroll = () => {
    if (isAuthenticated) {
      enrollInCourse(course.id);
    }
  };
  
  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setQuizCompleted(true);
    if (score >= 90) {
      addCertificate(course.id);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Course Header */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="edu-container mx-auto">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl mb-6">{course.description}</p>
            
            {isAuthenticated ? (
              isEnrolled ? (
                <div className="flex items-center">
                  <CheckCircle2 className="text-green-300 mr-2" />
                  <span>You are enrolled in this course</span>
                </div>
              ) : (
                <Button onClick={handleEnroll}>Enroll Now</Button>
              )
            ) : (
              <Button asChild>
                <a href="/login">Login to Enroll</a>
              </Button>
            )}
          </div>
        </section>
        
        {/* Course Content */}
        <section className="py-12">
          <div className="edu-container mx-auto">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Book size={18} />
                  Overview
                </TabsTrigger>
                
                {isEnrolled && (
                  <TabsTrigger value="quiz" className="flex items-center gap-2">
                    <Award size={18} />
                    Quiz
                  </TabsTrigger>
                )}
                
                {(hasCertificate || (quizCompleted && quizScore >= 90)) && (
                  <TabsTrigger value="certificate" className="flex items-center gap-2">
                    <Award size={18} />
                    Certificate
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="overview" className="space-y-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4">About this Course</h2>
                  <p className="text-gray-600 mb-4">
                    This course provides a comprehensive introduction to {course.language} programming.
                    You'll learn from the fundamentals to advanced concepts, with practical examples
                    and interactive exercises.
                  </p>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2">What you'll learn:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Fundamentals of {course.language} syntax and structure</li>
                      <li>Building real-world applications and projects</li>
                      <li>Best practices and optimization techniques</li>
                      <li>Problem-solving approaches specific to {course.language}</li>
                    </ul>
                  </div>
                  
                  {previousScore > 0 && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Your Progress:</h3>
                      <p>
                        Quiz score: <strong>{previousScore}%</strong>
                        {previousScore >= 90 ? (
                          <span className="text-green-600 ml-2">
                            (Certificate earned)
                          </span>
                        ) : (
                          <span className="text-amber-600 ml-2">
                            (90% required for certificate)
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  {!isEnrolled && (
                    <div className="mt-8">
                      <Button onClick={handleEnroll} size="lg" className="w-full sm:w-auto">
                        Enroll Now (Free)
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {isEnrolled && (
                <TabsContent value="quiz">
                  <AuthRequired>
                    <Quiz 
                      questions={course.quiz} 
                      courseId={course.id} 
                      onComplete={handleQuizComplete}
                    />
                  </AuthRequired>
                </TabsContent>
              )}
              
              {(hasCertificate || (quizCompleted && quizScore >= 90)) && (
                <TabsContent value="certificate">
                  <AuthRequired>
                    <Certificate 
                      course={course}
                      score={quizCompleted ? quizScore : previousScore}
                    />
                  </AuthRequired>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseDetail;
