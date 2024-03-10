const BOARD_SIZE = 9;
const EMPTY_CELL = null;

let sudokuBoard = [];
let solutionBoard = [];
let difficulty = 'easy'; // Default difficulty

// Function to initialise the Sudoku board with a random initial state
function initialiseBoard(){
    // Generate a random Sudoku board and its solution
    [sudokuBoard, solutionBoard] = generateRandomSudoku();

    // Display the Sudoku board
    displaySudoku();
}

// Function to generate a random Sudoku board and its solution
function generateRandomSudoku(){
  // Initialise an empty Sudoku board
  const sudoku = Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => EMPTY_CELL));

  // Generate a random Sudoku solution
  generateRandomSolution(sudoku, 0, 0);

  // Create a copy of the solution to use as the initial state
  const initialSudoku = sudoku.map(row => [...row]);

  // Remove some numbers from the initial state to create the puzzle
  removeNumbers(initialSudoku, difficulty);

  return [initialSudoku, sudoku];
}

// Function to generate a random Sudoku solution using backtracking
function generateRandomSolution(board, row, col){
  if(row === BOARD_SIZE){
    // Move to the next row when the end of the current row is reached
    row = 0;
    col++;

    if(col === BOARD_SIZE){
      // If the entire board is filled, a solution is found
      return true;
    }
  }

  // Try filling the current cell with a random number
  const numbers = shuffleArray([...Array(BOARD_SIZE)].map((_, i) => i + 1));

  for(const num of numbers){
    if(isValidMove(board, row, col, num)){
      board[row][col] = num;

      // Recursively try filling the next cell
      if(generateRandomSolution(board, row + 1, col)){
        return true;
      }

      // If the current choice doesn't lead to a solution, backtrack
      board[row][col] = EMPTY_CELL;
    }
  }

  // No valid number found for the current cell, backtrack
  return false;
}

// Function to check if a move is valid in Sudoku
function isValidMove(board, row, col, num){
  // Check if the number is not present in the current row and column
  return(
    !board[row].includes(num) &&
    !board.map(r => r[col]).includes(num) &&
    !isNumberInBox(board, row - (row % 3), col - (col % 3), num)
  );
}

// Function to check if a number is present in a 3x3 box
function isNumberInBox(board, startRow, startCol, num){
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      if(board[startRow + i][startCol + j] === num){
        return true;
      }
    }
  }

  return false;
}

// Function to remove numbers from (total 91) the Sudoku board to create the puzzle
function removeNumbers(board, difficulty){
  let cellsToKeep;

  switch(difficulty){
    case 'easy':
      cellsToKeep = 55;
      break;
    case 'medium':
      cellsToKeep = 40;
      break;
    case 'hard':
      cellsToKeep = 25;
      break;
    default:
      cellsToKeep = 55; // Default to easy difficulty
      break;
  }

  let cellsRemaining = BOARD_SIZE * BOARD_SIZE;

  while(cellsRemaining > cellsToKeep){
    const row = Math.floor(Math.random() * BOARD_SIZE);
    const col = Math.floor(Math.random() * BOARD_SIZE);

    if(board[row][col] !== EMPTY_CELL){
      board[row][col] = EMPTY_CELL;
      cellsRemaining--;
    }
  }
}

// Function to shuffle the elements in an array
function shuffleArray(array){
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

// Function to display the Sudoku board
function displaySudoku(){
  const sudokuBoardElement = document.getElementById('sudoku-board');
  sudokuBoardElement.innerHTML = '';

  for(let i = 0; i < BOARD_SIZE; i++){
    const row = document.createElement('div');
    row.classList.add('row');
    for(let j = 0; j < BOARD_SIZE; j++){
      const cell = document.createElement('input');
      cell.type = 'text';
      cell.classList.add('cell');
      cell.value = sudokuBoard[i][j] !== EMPTY_CELL ? sudokuBoard[i][j] : '';
      cell.readOnly = sudokuBoard[i][j] !== EMPTY_CELL;

      // Add 'filled' or 'empty' class to distinguish filled and empty cells
      cell.classList.add(sudokuBoard[i][j] !== EMPTY_CELL ? 'filled' : 'empty');

      cell.addEventListener('input', () => handleCellInput(i, j, cell));

      row.appendChild(cell);
    }
        
  sudokuBoardElement.appendChild(row);
  }
}

// Function to handle input in Sudoku cells
function handleCellInput(row, col, cell){
  const inputValue = parseInt(cell.value);

  // Validate input (allow only numbers from 1 to 9)
  if(!isNaN(inputValue) && inputValue >= 1 && inputValue <= 9){
    // Update the Sudoku board with the input value
    sudokuBoard[row][col] = inputValue;
  }else{
    // Clear the cell if the input is invalid
    cell.value = '';
  }
}

// Function to check if the Sudoku board is solved
function checkSolution(){
  // Compare the current state of the board with the correct solution
  const isCorrect = isSudokuCorrect();
  console.log("Sudoku is correct:", isCorrect);
  updateResultMessage(isCorrect);
}

// Function to check if the Sudoku board is correct
function isSudokuCorrect(){
  // Compare the current state of the board with the correct solution
  for(let i = 0; i < BOARD_SIZE; i++){
    for(let j = 0; j < BOARD_SIZE; j++){
      if(sudokuBoard[i][j] !== solutionBoard[i][j]){
        return false;
      }
    }
  }

  return true;
}

// Function to update the result message based on correctness
function updateResultMessage(isCorrect){
  if(isCorrect){
    playSound('buttonSuccessSound');
    Swal.fire({
      icon: 'success',
      title: 'Congratulations!',
      text: 'Sudoku is correct.',
    });
  }else{
    playSound('buttonFailSound');
    Swal.fire({
      icon: 'error',
      title: 'Oops!',
      text: 'Sudoku is incorrect.',
    });
  }
}

// Function to change the difficulty level
function changeDifficulty(selectedDifficulty){
  difficulty = selectedDifficulty;
  initialiseBoard();
}

// Event listener for the "Submit" button
document.getElementById('submit-btn').addEventListener('click', checkSolution);

// Call the initialiseBoard function to start a new game when the page loads
document.addEventListener('DOMContentLoaded', initialiseBoard);

// Function to play the sound
function playSound(soundId){
  const sound = document.getElementById(soundId);
  sound.play();
}

// Modify your existing button click functions to play the sounds
document.getElementById('easy-btn').addEventListener('click', function(){
  changeDifficulty('easy');
  playSound('buttonDifficultSound');
});
document.getElementById('medium-btn').addEventListener('click', function(){
  changeDifficulty('medium');
  playSound('buttonDifficultSound');
});
document.getElementById('hard-btn').addEventListener('click', function(){
  changeDifficulty('hard');
  playSound('buttonDifficultSound');
});