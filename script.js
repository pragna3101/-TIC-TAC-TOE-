document.addEventListener('DOMContentLoaded', () => {
  const boxes = document.querySelectorAll('.box');
  const turnIndicator = document.querySelector('.turn-indicator');
  const playerXScore = document.getElementById('playerX');
  const playerOScore = document.getElementById('playerO');
  const restartBtn = document.getElementById('restartbtn');
  const newGameBtn = document.getElementById('newGameBtn');
  const modal = document.querySelector('.modal');
  const modalMessage = document.querySelector('.modal .message');
  const modalRestartBtn = document.getElementById('modalRestartBtn');

  const X_TEXT = 'X';
  const O_TEXT = 'O';
  
  let currentPlayer = X_TEXT;
  let gameBoard = Array(9).fill(null);
  let gameActive = true;
  let scores = { X: 0, O: 0 };

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  // Initialize the game
  function initGame() {
    boxes.forEach(box => {
      box.textContent = '';
      box.classList.remove('winning-box');
      box.style.pointerEvents = 'auto';
    });
    
    gameBoard = Array(9).fill(null);
    gameActive = true;
    currentPlayer = X_TEXT;
    updateTurnIndicator();
  }

  // Handle box clicks
  function handleBoxClick(e) {
    const box = e.target;
    const boxId = parseInt(box.id);
    
    if (!gameActive || gameBoard[boxId] !== null) return;
    
    gameBoard[boxId] = currentPlayer;
    box.textContent = currentPlayer;
    
    if (checkWin()) {
      handleWin();
      return;
    }
    
    if (checkDraw()) {
      handleDraw();
      return;
    }
    
    switchPlayer();
    updateTurnIndicator();
  }

  // Check for win
  function checkWin() {
    return winningCombinations.some(combination => {
      const [a, b, c] = combination;
      return gameBoard[a] && 
             gameBoard[a] === gameBoard[b] && 
             gameBoard[a] === gameBoard[c];
    });
  }

  // Handle win
  function handleWin() {
    gameActive = false;
    scores[currentPlayer]++;
    updateScores();
    
    // Highlight winning boxes
    const winningCombo = winningCombinations.find(combination => {
      const [a, b, c] = combination;
      return gameBoard[a] && 
             gameBoard[a] === gameBoard[b] && 
             gameBoard[a] === gameBoard[c];
    });
    
    winningCombo.forEach(index => {
      boxes[index].classList.add('winning-box');
    });
    
    showModal(`Player ${currentPlayer} wins!`);
  }

  // Check for draw
  function checkDraw() {
    return !gameBoard.includes(null) && !checkWin();
  }

  // Handle draw
  function handleDraw() {
    gameActive = false;
    showModal("It's a draw!");
  }

  // Switch player
  function switchPlayer() {
    currentPlayer = currentPlayer === X_TEXT ? O_TEXT : X_TEXT;
  }

  // Update turn indicator
  function updateTurnIndicator() {
    turnIndicator.textContent = `Player ${currentPlayer}'s turn`;
  }

  // Update scores
  function updateScores() {
    playerXScore.textContent = `Player X: ${scores.X}`;
    playerOScore.textContent = `Player O: ${scores.O}`;
  }

  // Show modal
  function showModal(message) {
    modalMessage.textContent = message;
    modal.classList.add('active');
  }

  // Hide modal
  function hideModal() {
    modal.classList.remove('active');
  }

  // Event listeners
  boxes.forEach(box => {
    box.addEventListener('click', handleBoxClick);
  });

  restartBtn.addEventListener('click', initGame);

  newGameBtn.addEventListener('click', () => {
    scores = { X: 0, O: 0 };
    updateScores();
    initGame();
  });

  modalRestartBtn.addEventListener('click', () => {
    hideModal();
    initGame();
  });

  // Initialize the game
  initGame();
});