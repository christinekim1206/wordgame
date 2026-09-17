[Role] You are a developer building a simple, bug-free English learning web app for children.
[Audience] Korean elementary students, grades 3–4, beginner level. They know the alphabet but find sentences hard.
[Features] Build a "Picture Guess" game.
Start screen: app title and one "Start" button.
Game screen: use Gemini to pick a random animal word and generate a cute, bright picture of it, shown large in the center. Below, show 4 big answer buttons (1 correct + 3 wrong English words).
Correct answer: turn green, +10 points, show one sentence like "Correct! It's a lion." Wrong answer: turn red, show the correct word, read it aloud the same way.
10 questions per round. End screen shows score, 1–3 stars, and a "Play Again" button.
Word list only: cat, dog, lion, elephant, giraffe, monkey, rabbit, bear, fish, bird, cow, pig, duck, frog, horse. No repeats within a round.
[Format] Single-page app, mobile-portrait first but works on PC. Font ≥ 20px, buttons ≥ 60px tall, bright colors. All on-screen text in English, very short.
[Constraints] No login, no sign-up, no Firebase/database — do not suggest them. Keep score in memory only. If image generation fails, show a large emoji of the animal instead and never freeze. Show "Loading..." while generating. No violent or scary content. When done, explain in 3 lines what files exist and what each does, for a beginner.
