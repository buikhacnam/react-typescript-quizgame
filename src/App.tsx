import React, { useState } from 'react';
import { Difficulty, fetchQuizQuestions, QuestionState } from './API';
import QuestionCard from './components/QuestionCard';
import { GlobalStyle, Wrapper } from './App.styles';


export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTION = 10;
function App() {

  
  
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [ score, setScore ] = useState(0);
  const [ gameOver, setGameOver ] = useState(true);

  //console.log(fetchQuizQuestions(TOTAL_QUESTION, Difficulty.EASY));
  console.log(questions);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTION, Difficulty.EASY);

    setQuestions(newQuestions);
    setLoading(false);
    
  }
  //callback after click an answer
  const checkAnswer = (e : React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //user answer
      const answer = e.currentTarget.value;
      // check answer
      const correct = questions[number].correct_answer === answer;
      // add score
      if (correct) setScore(prevScore => prevScore + 1);
      // save answer in the userAnswer state:
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prevAns) => [...prevAns, answerObject]);
    }
  }

  const nextQuestion = () => {
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTION) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  }

  return (
    <>
    <GlobalStyle />
    <Wrapper>     
      <h1>REACT QUIZ</h1>
      { gameOver || userAnswers.length === TOTAL_QUESTION ? 
        <button className="start" onClick={startTrivia}>
          Start
        </button>
        : null
      }
      { !gameOver ? 
        <p className="score">Score: {score}</p>
        : null
      }
      { loading ?
        <p>Loading Questions ...</p>
        : null
      }
      { !loading && !gameOver && (
          <QuestionCard 
          questionNr={number + 1}
          totalQuestions={TOTAL_QUESTION}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      )}
      {   !gameOver && 
          !loading && 
          userAnswers.length === number + 1 && 
          number !== TOTAL_QUESTION - 1 ?
            (
              <button className="next" onClick={nextQuestion}>
                Next Question
              </button>
            )
            : null
      }
      
    </Wrapper>
    </>
  );
}

export default App;
