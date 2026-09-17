import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, ArrowRight, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { AnimalInfo, AnimalName, Question } from "../types";
import { speakText, playSound } from "../utils/speech";

interface GameScreenProps {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  onAnswer: (isCorrect: boolean, selectedAnimal: AnimalName) => void;
  onNext: () => void;
}

export default function GameScreen({
  questions,
  currentQuestionIndex,
  score,
  onAnswer,
  onNext,
}: GameScreenProps) {
  const currentQuestion = questions[currentQuestionIndex];
  const { correctAnimal, options } = currentQuestion;

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(true);
  const [useFallbackEmoji, setUseFallbackEmoji] = useState<boolean>(false);

  const [selectedOption, setSelectedOption] = useState<AnimalName | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [feedbackSentence, setFeedbackSentence] = useState<string>("");

  const activeAnimalRef = useRef<AnimalName>(correctAnimal.name);

  // Fetch or generate image for the current animal
  useEffect(() => {
    let isCurrent = true;
    activeAnimalRef.current = correctAnimal.name;
    setIsLoadingImage(true);
    setImageSrc(null);
    setUseFallbackEmoji(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setFeedbackSentence("");

    const fetchAnimalImage = async () => {
      // Safety timeout: 7 seconds max. Never freeze!
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, 7000);

      try {
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ animal: correctAnimal.name }),
          signal: abortController.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("Failed response");
        }

        const data = await response.json();
        if (!isCurrent) return;

        if (data.success && data.imageUrl) {
          setImageSrc(data.imageUrl);
          setUseFallbackEmoji(false);
        } else {
          setUseFallbackEmoji(true);
        }
      } catch (err) {
        if (!isCurrent) return;
        // Never freeze; immediately show large cute emoji fallback
        setUseFallbackEmoji(true);
      } finally {
        if (isCurrent) {
          setIsLoadingImage(false);
        }
      }
    };

    fetchAnimalImage();

    return () => {
      isCurrent = false;
    };
  }, [correctAnimal.name, currentQuestionIndex]);

  const handleSelectOption = (chosen: AnimalName) => {
    if (isAnswered) return;

    const isCorrect = chosen === correctAnimal.name;
    setSelectedOption(chosen);
    setIsAnswered(true);

    const sentence = isCorrect
      ? `Correct! It's ${correctAnimal.article} ${correctAnimal.name}.`
      : `It's ${correctAnimal.article} ${correctAnimal.name}.`;

    setFeedbackSentence(sentence);

    // Audio effects & speech
    if (isCorrect) {
      playSound("correct");
    } else {
      playSound("wrong");
    }

    // Read aloud to the student
    setTimeout(() => {
      speakText(sentence);
    }, 150);

    onAnswer(isCorrect, chosen);
  };

  const handleReplayAudio = useCallback(() => {
    if (feedbackSentence) {
      speakText(feedbackSentence);
    } else {
      speakText(correctAnimal.name);
    }
  }, [feedbackSentence, correctAnimal.name]);

  const handleNextQuestion = () => {
    playSound("start");
    onNext();
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div
      id="game-screen"
      className="flex flex-col items-center justify-between min-h-screen max-w-md mx-auto px-4 py-5 select-none font-['Nunito']"
    >
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl p-3 border-2 border-amber-200 shadow-sm">
        {/* Progress pill */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-stone-500">Question</span>
          <span
            id="question-progress"
            className="px-3 py-1 rounded-xl bg-amber-500 text-white font-black text-xl shadow-xs"
          >
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Score display */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-xl bg-emerald-100 border-2 border-emerald-300">
          <Sparkles className="w-5 h-5 text-emerald-600 fill-emerald-500" />
          <span className="text-lg font-bold text-emerald-800">Score</span>
          <span id="current-score" className="text-2xl font-black text-emerald-700">
            {score}
          </span>
        </div>
      </div>

      {/* Center Display Card: Picture or Fallback Emoji */}
      <div className="my-auto w-full flex flex-col items-center py-2">
        <div
          id="animal-card-container"
          className="relative w-full max-w-[320px] aspect-square rounded-3xl bg-white border-4 border-amber-300 shadow-xl overflow-hidden flex items-center justify-center p-2"
        >
          {isLoadingImage ? (
            /* Loading State */
            <div id="loading-state" className="flex flex-col items-center justify-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="text-7xl"
              >
                🎨
              </motion.div>
              <p className="text-2xl font-black text-amber-800 tracking-wide font-['Fredoka']">
                Loading...
              </p>
              <div className="flex gap-1.5 mt-1">
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-3 h-3 rounded-full bg-amber-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          ) : imageSrc && !useFallbackEmoji ? (
            /* AI Generated Picture */
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-amber-50 flex items-center justify-center">
              <img
                id="animal-image"
                src={imageSrc}
                alt={correctAnimal.name}
                referrerPolicy="no-referrer"
                onError={() => setUseFallbackEmoji(true)}
                className="w-full h-full object-cover rounded-2xl select-none pointer-events-none"
              />
            </div>
          ) : (
            /* Large Emoji Fallback (Never Freezes) */
            <motion.div
              id="animal-emoji-fallback"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`w-full h-full rounded-2xl bg-gradient-to-br ${correctAnimal.bgColor} flex flex-col items-center justify-center select-none shadow-inner`}
            >
              <motion.span
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 3, -3, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-9xl filter drop-shadow-md select-none leading-none"
              >
                {correctAnimal.emoji}
              </motion.span>
            </motion.div>
          )}

          {/* Quick Sound/Speaker Button */}
          {isAnswered && (
            <button
              id="btn-replay-audio"
              type="button"
              onClick={handleReplayAudio}
              title="Listen again"
              className="absolute top-3 right-3 w-12 h-12 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-white flex items-center justify-center shadow-md border-2 border-white cursor-pointer transition-transform"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Feedback Sentence Area */}
        <div className="w-full min-h-[64px] flex items-center justify-center mt-3 px-2">
          <AnimatePresence mode="wait">
            {isAnswered ? (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`w-full py-2.5 px-4 rounded-2xl border-2 flex items-center justify-center gap-2 text-center shadow-sm ${
                  selectedOption === correctAnimal.name
                    ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                    : "bg-amber-50 border-amber-400 text-amber-900"
                }`}
              >
                {selectedOption === correctAnimal.name ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                )}
                <span
                  id="feedback-text"
                  className="text-2xl font-black font-['Fredoka'] tracking-wide"
                >
                  {feedbackSentence}
                </span>
                <button
                  type="button"
                  onClick={handleReplayAudio}
                  className="p-1.5 rounded-full hover:bg-black/5 text-stone-600 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <div className="text-xl font-bold text-stone-600 tracking-wide">
                What animal is this?
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Area: 4 Big Answer Buttons or Next Button */}
      <div className="w-full mt-2">
        <div className="grid grid-cols-2 gap-3 w-full">
          {options.map((option, idx) => {
            let buttonStyle =
              "bg-white hover:bg-amber-50 text-stone-800 border-2 border-stone-200 border-b-4 hover:border-amber-300 shadow-sm active:translate-y-0.5";

            if (isAnswered) {
              if (option === correctAnimal.name) {
                // Correct word turns green
                buttonStyle =
                  "bg-emerald-500 text-white border-2 border-emerald-600 border-b-4 border-b-emerald-700 shadow-md";
              } else if (option === selectedOption) {
                // Clicked wrong answer turns red
                buttonStyle =
                  "bg-rose-500 text-white border-2 border-rose-600 border-b-4 border-b-rose-700 shadow-md";
              } else {
                buttonStyle =
                  "bg-stone-100 text-stone-400 border-2 border-stone-200 opacity-60";
              }
            }

            return (
              <button
                key={option}
                id={`btn-option-${idx}`}
                type="button"
                disabled={isAnswered || isLoadingImage}
                onClick={() => handleSelectOption(option)}
                className={`h-16 min-h-[64px] rounded-2xl text-2xl font-black font-['Fredoka'] tracking-wide capitalize flex items-center justify-center transition-all duration-150 cursor-pointer ${buttonStyle}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Next Question Button (revealed after answering) */}
        <div className="mt-3 min-h-[64px]">
          <AnimatePresence>
            {isAnswered && (
              <motion.button
                id="btn-next"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                type="button"
                onClick={handleNextQuestion}
                className="w-full h-16 min-h-[64px] rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all border-b-4 border-amber-700 text-white text-2xl font-black font-['Fredoka'] tracking-wider shadow-lg flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>{isLastQuestion ? "See Result" : "Next"}</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
