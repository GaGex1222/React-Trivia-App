import { useEffect, useState } from "react";

function Cards() {

  const API_URL =
    "https://opentdb.com/api.php?amount=30&type=boolean";

  interface Question {
    question: string;
    difficulty: string;
    category: string;
    incorrect_answers: string[]
    correct_answer: string;
    hasBeenAnswered: boolean;
    questionBackground: string;
  }
  const [showGameOver, setShowGameOver] = useState<boolean>(false)
  const [hasBeenAnsweredCount, setHasBeenAnsweredCount] = useState(0)
  const [userScore, setUserScore] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch(API_URL);
      const data = await response.json();
      const updatedQuestions = data.results.map((q: Omit<Question, 'hasBeenAnswered' | 'questionBackground'>) => ({
        ...q,
        hasBeenAnswered: false,
        questionBackground: 'primary',
      }));
      setQuestions(updatedQuestions);
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return <>
    <div className="spinner-border" role="status">
        <span className="sr-only"></span>
    </div>
    </>; // Render a loading indicator
  }


  const handleAnswerClick = (answer: string, index: number) => {
    const questionToHandle = questions[index];
    if (questionToHandle.correct_answer == answer && !questionToHandle.hasBeenAnswered) {
        console.log('GOT HERE')
        questionToHandle.hasBeenAnswered = true;
        setHasBeenAnsweredCount(hasBeenAnsweredCount + 1)
        questionToHandle.questionBackground = 'success';
        setUserScore(userScore + 1);
        console.log(userScore)
    } else if (questionToHandle.correct_answer != answer && !questionToHandle.hasBeenAnswered) {
        console.log('GOT HERE2')
        questionToHandle.hasBeenAnswered = true;
        setHasBeenAnsweredCount(hasBeenAnsweredCount + 1)
        questionToHandle.questionBackground = 'danger';
    }
    
    if (hasBeenAnsweredCount == questions.length - 1)
        setShowGameOver(true)


  }

  return (
    <>
      <ul className="list-group">
        {questions.map((question, index) => (
        <div key={index}>
            <li key={index} className={`list-group-item text-bg-${question.questionBackground}`}>
            {`Question number: ${index + 1} - ${question.question}`}
            <button onClick={() => handleAnswerClick('True', index)} className="btn btn-success">True</button>
            <button onClick={() => handleAnswerClick('False', index)} className="btn btn-danger">False</button>
          </li>
        </div>
        ))}
      </ul>
      {showGameOver ? <p className="fs-1">{`Game Over, Your Score : ${userScore}, To play again restart the page.`}</p> : null}
    </>
  );
}
export default Cards;

