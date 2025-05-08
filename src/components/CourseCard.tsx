
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  language: string;
  image: string;
  isEnrolled?: boolean;
}

const CourseCard = ({ id, title, description, language, image, isEnrolled }: CourseCardProps) => {
  return (
    <Card className="course-card h-full flex flex-col">
      <CardHeader>
        <div className="mb-3 h-40 bg-blue-100 rounded-md flex items-center justify-center overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="object-cover w-full h-full"
            onError={(e) => {
              // If image fails to load, replace with language name
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const div = document.createElement('div');
                div.className = 'w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white text-3xl font-bold';
                div.innerText = language;
                parent.appendChild(div);
              }
            }}
          />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600">{description}</p>
      </CardContent>
      <CardFooter>
        <Link to={`/courses/${id}`} className="w-full">
          <Button variant={isEnrolled ? "outline" : "default"} className="w-full">
            {isEnrolled ? "Continue Learning" : "View Course"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
