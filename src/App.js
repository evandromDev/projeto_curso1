
//// componentes para Importar
import StartScreen from "./components/StartScreen.js";
import Game from "./components/Game.js";
import GameOver from "./components/GameOver.js";

///// CSS 
import './App.css';



/// React 
import {useCallback,useEffect,useState} from "react";


//// dados do jogo ///
import { wordsList } from "./data/words.js";



const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},

];

const guessesQty = 3;


function App() {

  const [gameStage,setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord,setPickedWord] = useState("");
  const [pickedCategory,setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const[guessedLetters, setGuessedLetters] = useState([]); //// quantidade de acertos ////
  const[wrongLetters, setWrongLetters] = useState([]); ///// quantidade de erro ////
  const[guesses,setGuesses] = useState(guessesQty);
  const[score,setScore] = useState(50); 



  /// Funções Categoria aleatorias ///

  const pickWordAndCategoria = useCallback(() =>{

    /// tipo de categoria aleatorias
    const categories = Object.keys(words);
    const category = 
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //// itens da categoria 

    const word = 
      words[category][Math.floor(Math.random() * words[category].length)];
    
    return {word, category};
  },[words]);


  /// Funções Start ///
  const startGame = useCallback(() => {
    
    //// restaurando valores
    clearLetterStates();

    //// trazendo a categoria e resultado
    const {word,category} =pickWordAndCategoria();
    
    //// Transformando os Resultados em letras
    let wordLetters = word.split("");
    
    wordLetters = wordLetters.map((l) => l.toLowerCase()); /// transformando todas a Letras iguais 
    
    /// fill states
    
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  },[pickWordAndCategoria]);

  /// Funcões Game

  const verificar = (letter) =>{
    const normalizedLetter = letter.toLowerCase();

    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter))
    {
      return;
    }


    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
      ...actualGuessedLetters,
      normalizedLetter,
      ]);
    } else
    {
        setWrongLetters((actualWrongLetters) => [
          ...actualWrongLetters,
          normalizedLetter,
        ]);


        setGuesses((actualGuesses) => actualGuesses -1);

    }
  };

  const clearLetterStates = () =>{
    setGuessedLetters([]);
    setWrongLetters([]);
  };


  useEffect(() => {
    if (guesses === 0) {
      
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  /// checando condições
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    if(guessedLetters.length === uniqueLetters.length)
    {
      setScore((actualScore) => actualScore += 100);

      startGame();
    }

  },[guessedLetters, letters, startGame])


  /// Funções reniciar Jogo
  const reniciar = () => {
    setScore(0);
    setGuesses(guessesQty); //// reniciando as contas de numeros /////
    setGameStage(stages[0].name);
  };

  return (
    <div className="geral">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && ( 
      <Game 
        verificar={verificar} 
        pickedWord={pickedWord} 
        pickedCategory={pickedCategory} 
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score} 
      />
    )}
      {gameStage === "end" && <GameOver reniciar={reniciar} score={score}/>}
    </div>
  );
}

export default App;
