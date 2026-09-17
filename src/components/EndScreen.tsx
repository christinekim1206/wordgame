import { useEffect } from "react";
import { motion } from "motion/react";
import { Star, RotateCcw } from "lucide-react";
import { playSound } from "../utils/speech";

interface EndScreenProps {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
}

export default function EndScreen({ score, totalQuestions, onPlayAgain }: EndScreenProps) {
  // Determine star rating:
  // 1 star: 0 - 40 points
  // 2 stars: 50 - 70 points
  // 3 stars: 80 - 100 points
  const starsCount = score >= 80 ? 3 : score >= 50 ? 2 : 1;

  useEffect(() => {
    playSound("cheer");
  }, []);

  const getTitle = () => {
    if (starsCount === 3) return "Super Star!";
    if (starsCount === 2) return "Great Job!";
    return "Good Try!";
  };

  return (
    <div
      id="end-screen"
      className="flex flex-col items-center justify-between min-h-screen max-w-md mx-auto px-6 py-10 text-center select-none font-['Nunito']"
    >
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 px-6 py-2 rounded-full bg-amber-100 border-2 border-amber-300 text-amber-900 text-2xl font-black font-['Fredoka']"
      >
        Round Finished!
      </motion.div>

      {/* Center Trophy / Stars Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="my-auto w-full flex flex-col items-center bg-white/90 backdrop-blur-md rounded-3xl p-6 border-4 border-amber-300 shadow-xl"
      >
        {/* Animated Celebration Icon */}
        <div className="text-7xl mb-4">
          {starsCount === 3 ? "🏆" : starsCount === 2 ? "🎉" : "🎈"}
        </div>

        {/* 1 - 3 Stars */}
        <div id="stars-container" className="flex items-center justify-center gap-3 mb-6">
          {[1, 2, 3].map((starIndex) => {
            const isEarned = starIndex <= starsCount;
            return (
              <motion.div
                key={starIndex}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2 + starIndex * 0.2, type: "spring", stiffness: 280 }}
                className="relative"
              >
                <Star
                  className={`w-16 h-16 ${
                    isEarned
                      ? "text-yellow-400 fill-yellow-400 filter drop-shadow-md"
                      : "text-stone-200 fill-stone-100"
                  }`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Compliment */}
        <h2 className="text-4xl font-black text-amber-900 font-['Fredoka'] mb-2">
          {getTitle()}
        </h2>

        {/* Final Score */}
        <div className="mt-3 flex flex-col items-center">
          <span className="text-xl font-bold text-stone-500">Your Score</span>
          <span
            id="final-score"
            className="text-6xl font-black text-emerald-600 font-['Fredoka'] tracking-tight"
          >
            {score}
            <span className="text-3xl text-stone-400 font-bold"> / {totalQuestions * 10}</span>
          </span>
        </div>

        <p className="mt-4 text-xl font-bold text-stone-600">
          You got {score / 10} out of {totalQuestions} correct!
        </p>
      </motion.div>

      {/* Play Again Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full pb-4"
      >
        <button
          id="btn-play-again"
          type="button"
          onClick={onPlayAgain}
          className="w-full h-18 min-h-[70px] rounded-3xl bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all duration-150 border-b-6 border-amber-700 text-white text-3xl font-black font-['Fredoka'] tracking-wide shadow-lg flex items-center justify-center gap-3 cursor-pointer"
        >
          <RotateCcw className="w-8 h-8 stroke-[2.5]" />
          <span>Play Again</span>
        </button>
      </motion.div>
    </div>
  );
}
