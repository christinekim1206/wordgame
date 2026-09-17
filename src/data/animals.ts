import { AnimalInfo, AnimalName } from "../types";

export const ANIMALS: Record<AnimalName, AnimalInfo> = {
  cat: {
    name: "cat",
    emoji: "🐱",
    article: "a",
    bgColor: "from-amber-100 to-orange-200 border-amber-300",
  },
  dog: {
    name: "dog",
    emoji: "🐶",
    article: "a",
    bgColor: "from-blue-100 to-sky-200 border-sky-300",
  },
  lion: {
    name: "lion",
    emoji: "🦁",
    article: "a",
    bgColor: "from-yellow-100 to-amber-200 border-yellow-400",
  },
  elephant: {
    name: "elephant",
    emoji: "🐘",
    article: "an",
    bgColor: "from-indigo-100 to-blue-200 border-indigo-300",
  },
  giraffe: {
    name: "giraffe",
    emoji: "🦒",
    article: "a",
    bgColor: "from-amber-100 to-yellow-200 border-amber-300",
  },
  monkey: {
    name: "monkey",
    emoji: "🐵",
    article: "a",
    bgColor: "from-orange-100 to-amber-200 border-orange-300",
  },
  rabbit: {
    name: "rabbit",
    emoji: "🐰",
    article: "a",
    bgColor: "from-pink-100 to-rose-200 border-pink-300",
  },
  bear: {
    name: "bear",
    emoji: "🐻",
    article: "a",
    bgColor: "from-stone-100 to-amber-200 border-stone-300",
  },
  fish: {
    name: "fish",
    emoji: "🐟",
    article: "a",
    bgColor: "from-cyan-100 to-teal-200 border-cyan-300",
  },
  bird: {
    name: "bird",
    emoji: "🐦",
    article: "a",
    bgColor: "from-sky-100 to-blue-200 border-sky-300",
  },
  cow: {
    name: "cow",
    emoji: "🐮",
    article: "a",
    bgColor: "from-emerald-100 to-green-200 border-emerald-300",
  },
  pig: {
    name: "pig",
    emoji: "🐷",
    article: "a",
    bgColor: "from-rose-100 to-pink-200 border-rose-300",
  },
  duck: {
    name: "duck",
    emoji: "🦆",
    article: "a",
    bgColor: "from-yellow-100 to-lime-200 border-yellow-300",
  },
  frog: {
    name: "frog",
    emoji: "🐸",
    article: "a",
    bgColor: "from-lime-100 to-green-200 border-lime-300",
  },
  horse: {
    name: "horse",
    emoji: "🐴",
    article: "a",
    bgColor: "from-amber-100 to-stone-200 border-amber-400",
  },
};

export const ANIMAL_NAMES: AnimalName[] = Object.keys(ANIMALS) as AnimalName[];

// Utility to shuffle an array
export function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Generate 10 distinct questions with 0 repeats in a round
export function generateRoundQuestions(): { correctAnimal: AnimalInfo; options: AnimalName[] }[] {
  // Shuffle all 15 animals and pick first 10
  const chosenAnimals = shuffleArray(ANIMAL_NAMES).slice(0, 10);

  return chosenAnimals.map((animalName) => {
    const correctAnimal = ANIMALS[animalName];
    // Pick 3 wrong options from the remaining 14 animals
    const otherAnimals = ANIMAL_NAMES.filter((name) => name !== animalName);
    const wrongOptions = shuffleArray(otherAnimals).slice(0, 3);
    const options = shuffleArray([animalName, ...wrongOptions]);

    return {
      correctAnimal,
      options,
    };
  });
}
