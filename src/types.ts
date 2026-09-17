export type AnimalName =
  | "cat"
  | "dog"
  | "lion"
  | "elephant"
  | "giraffe"
  | "monkey"
  | "rabbit"
  | "bear"
  | "fish"
  | "bird"
  | "cow"
  | "pig"
  | "duck"
  | "frog"
  | "horse";

export interface AnimalInfo {
  name: AnimalName;
  emoji: string;
  article: "a" | "an";
  bgColor: string;
}

export interface Question {
  correctAnimal: AnimalInfo;
  options: AnimalName[];
}

export type GameScreenState = "start" | "playing" | "end";

export interface QuestionResult {
  questionNumber: number;
  animal: AnimalName;
  selectedAnswer: AnimalName;
  isCorrect: boolean;
}
