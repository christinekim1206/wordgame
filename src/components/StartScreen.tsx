import { motion } from "motion/react";
import { Play } from "lucide-react";
import { playSound } from "../utils/speech";

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const handleStart = () => {
    playSound("start");
    onStart();
  };

  return (
    <div
      id="start-screen"
      className="flex flex-col items-center justify-between min-h-screen max-w-md mx-auto px-6 py-10 text-center select-none"
    >
      {/* Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-amber-100 border-2 border-amber-300 text-amber-900 text-xl font-bold tracking-wide shadow-sm"
      >
        <span>🌟</span>
        <span>English Word Game</span>
        <span>🌟</span>
      </motion.div>

      {/* Main Mascot & Title Area */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="my-auto flex flex-col items-center"
      >
        {/* Animated Animal Cluster */}
        <div className="relative mb-6">
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-44 h-44 rounded-3xl bg-gradient-to-tr from-amber-200 via-yellow-100 to-orange-200 border-4 border-amber-400 shadow-xl flex items-center justify-center text-7xl"
          >
            🦁
          </motion.div>

          {/* Floating mini animal badges */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            className="absolute -top-3 -right-3 w-14 h-14 rounded-2xl bg-sky-200 border-2 border-sky-400 shadow-md flex items-center justify-center text-3xl"
          >
            🐱
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.6 }}
            className="absolute -bottom-3 -left-3 w-14 h-14 rounded-2xl bg-pink-200 border-2 border-pink-400 shadow-md flex items-center justify-center text-3xl"
          >
            🐰
          </motion.div>
        </div>

        {/* App Title */}
        <h1
          id="app-title"
          className="text-5xl font-black text-amber-900 tracking-tight drop-shadow-sm font-['Fredoka'] mb-3"
        >
          Picture Guess
        </h1>

        {/* Subtitle / Short English prompt */}
        <p className="text-2xl font-bold text-amber-800/90 max-w-xs font-['Nunito']">
          Look at the picture.
          <br />
          Guess the animal!
        </p>

        {/* Quick hint pill */}
        <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/80 border-2 border-amber-200 text-stone-600 text-lg font-semibold">
          <span>🎯 10 Questions</span>
          <span>•</span>
          <span>⭐ Win Stars</span>
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full pb-4"
      >
        <button
          id="btn-start"
          type="button"
          onClick={handleStart}
          className="w-full h-18 min-h-[70px] rounded-3xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all duration-150 border-b-6 border-emerald-700 text-white text-3xl font-black tracking-wide shadow-lg flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play className="w-8 h-8 fill-current" />
          <span>START</span>
        </button>
      </motion.div>
    </div>
  );
}
