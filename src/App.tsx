import { useState, useCallback } from "react";
import { GameScreenState, Question, AnimalName } from "./types";
import { generateRoundQuestions } from "./data/animals";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import EndScreen from "./components/EndScreen";

export default function App() {
  const [screen, setScreen] = useState<GameScreenState>("start");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  // Start a new round of 10 non-repeating animal questions
  const handleStartGame = useCallback(() => {
    const roundQuestions = generateRoundQuestions();
    setQuestions(roundQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setScreen("playing");
  }, []);

  // Answer handler
  const handleAnswer = useCallback((isCorrect: boolean, _selectedAnimal: AnimalName) => {
    if (isCorrect) {
      setScore((prev) => prev + 10);
    }
  }, []);

  // Next question or finish round
  const handleNext = useCallback(() => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setScreen("end");
    }
  }, [currentQuestionIndex, questions.length]);

  return (
    <main
      id="app-root"
      className="min-h-screen w-full bg-gradient-to-b from-amber-50 via-yellow-50/50 to-orange-50 text-stone-900 flex flex-col justify-center items-center font-['Nunito']"
    >
      <div className="w-full h-full min-h-screen">
        {screen === "start" && <StartScreen onStart={handleStartGame} />}

        {screen === "playing" && questions.length > 0 && (
          <GameScreen
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            score={score}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        )}

        {screen === "end" && (
          <EndScreen
            score={score}
            totalQuestions={questions.length}
            onPlayAgain={handleStartGame}
          />
        )}
      </div>
    </main>
  );
}
