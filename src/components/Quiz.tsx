
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question } from "@/contexts/CourseContext";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle } from "lucide-react";

interface QuizProps {
  questions: Question[];
  courseId: string;
  onComplete: (score: number) => void;
}

const Quiz = ({ questions, courseId, onComplete }: QuizProps) => {
  const { saveQuizResult } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<number | null>(null);

  const handleAnswerSelect = (value: string) => {
    setCurrentAnswer(parseInt(value));
  };

  const handleNextQuestion = () => {
    if (currentAnswer === null) return;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = currentAnswer;
    setAnswers(newAnswers);
    setCurrentAnswer(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
      
      // Calculate score
      const correctAnswers = newAnswers.filter(
        (answer, index) => answer === questions[index].correctOption
      ).length;
      const scorePercentage = Math.round((correctAnswers / questions.length) * 100);
      
      // Save score
      saveQuizResult(courseId, scorePercentage);
      onComplete(scorePercentage);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  
  if (showResults) {
    const correctAnswers = answers.filter(
      (answer, index) => answer === questions[index].correctOption
    ).length;
    const scorePercentage = Math.round((correctAnswers / questions.length) * 100);
    
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold mb-4">{scorePercentage}%</div>
            <p className="text-lg text-gray-600">
              You got {correctAnswers} out of {questions.length} questions correct.
            </p>
          </div>
          
          <Progress value={scorePercentage} className="h-3" />
          
          <div className="text-center">
            {scorePercentage >= 90 ? (
              <div className="flex flex-col items-center gap-2 text-green-600">
                <CheckCircle className="h-12 w-12" />
                <p className="font-medium text-lg">
                  Congratulations! You've passed with a score of {scorePercentage}%.
                </p>
                <p>Your certificate has been generated.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-amber-600">
                <AlertCircle className="h-12 w-12" />
                <p className="font-medium text-lg">
                  Almost there! You need a score of at least 90% to receive a certificate.
                </p>
                <p>Feel free to review the course and try again.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Quiz: Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
        <Progress value={(currentQuestionIndex / questions.length) * 100} className="mt-2 h-1" />
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
          <RadioGroup value={currentAnswer?.toString()} onValueChange={handleAnswerSelect}>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleNextQuestion} 
          disabled={currentAnswer === null}
        >
          {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Submit Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Quiz;
