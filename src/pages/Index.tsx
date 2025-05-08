
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCourses } from "@/contexts/CourseContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { courses, loading } = useCourses();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="edu-container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Learn Programming for Free
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Master various programming languages with our interactive courses and earn certificates upon completion.
          </p>
          <div className="space-x-4">
            <Link to="/courses">
              <Button size="lg" variant="default" className="bg-white text-blue-700 hover:bg-gray-100">
                Explore Courses
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/signup">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                  Sign Up
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="edu-container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Featured Courses</h2>
            <p className="text-gray-600">Start your programming journey with our top courses</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading courses...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.slice(0, 3).map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  language={course.language}
                  image={course.image}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/courses">
              <Button variant="outline">View All Courses</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="edu-container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">How It Works</h2>
            <p className="text-gray-600">Learn, take quizzes, and earn certificates in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-700">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enroll in a Course</h3>
              <p className="text-gray-600">
                Create an account and enroll in any of our free programming language courses.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-700">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete the Quiz</h3>
              <p className="text-gray-600">
                After studying the material, take a 10-question quiz to test your knowledge.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-700">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Your Certificate</h3>
              <p className="text-gray-600">
                Score at least 90% on the quiz to earn your official Education Centre certificate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="edu-container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have enhanced their programming skills with Education Centre.
          </p>
          <Link to={isAuthenticated ? "/courses" : "/signup"}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              {isAuthenticated ? "Explore Courses" : "Get Started for Free"}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
