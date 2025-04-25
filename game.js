document.addEventListener('DOMContentLoaded', function() {
    // Game state
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let gameMode = 'offline'; // 'offline', 'online', 'computer'
    let computerLevel = 'medium'; // 'easy', 'medium', 'hard', 'impossible'
    let redPlayerName = 'Player 1';
    let bluePlayerName = 'Player 2';
    
    // Statistics
    let stats = {
        offline: { redWins: 0, blueWins: 0, draws: 0, totalGames: 0 },
        online: { redWins: 0, blueWins: 0, draws: 0, totalGames: 0 },
        computer: { redWins: 0, computerWins: 0, draws: 0, totalGames: 0 }
    };
    
    // DOM elements
    const gameBoard = document.getElementById('gameBoard');
    const gameStatus = document.getElementById('gameStatus');
    const currentTurnDisplay = document.getElementById('currentTurn');
    const redPlayerInput = document.getElementById('redPlayer');
    const bluePlayerInput = document.getElementById('bluePlayer');
    const resetButton = document.getElementById('resetGame');
    const newGameButton = document.getElementById('newGame');
    const themeToggle = document.getElementById('themeToggle');
    const modeOffline = document.getElementById('modeOffline');
    const modeOnline = document.getElementById('modeOnline');
    const modeComputer = document.getElementById('modeComputer');
    const computerLevelContainer = document.getElementById('computerLevelContainer');
    const levelEasy = document.getElementById('levelEasy');
    const levelMedium = document.getElementById('levelMedium');
    const levelHard = document.getElementById('levelHard');
    const levelImpossible = document.getElementById('levelImpossible');
    const currentModeDisplay = document.getElementById('currentModeDisplay');
    const toggleStats = document.getElementById('toggleStats');
    const allStatsContainer = document.getElementById('allStatsContainer');
    
    // Stats display
    const redWinsDisplay = document.getElementById('redWins');
    const blueWinsDisplay = document.getElementById('blueWins');
    const drawsDisplay = document.getElementById('draws');
    const totalGamesDisplay = document.getElementById('totalGames');
    const offlineStatsDisplay = document.getElementById('offlineStats');
    const onlineStatsDisplay = document.getElementById('onlineStats');
    const computerStatsDisplay = document.getElementById('computerStats');
    
    // Initialize the game board
    function initializeBoard() {
        gameBoard.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell bg-gray-700 rounded-lg flex items-center justify-center text-6xl font-bold cursor-pointer aspect-square';
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', () => handleCellClick(i));
            gameBoard.appendChild(cell);
        }
        
        updateBoard();
    }
    
    // Update the board display
    function updateBoard() {
        document.querySelectorAll('.cell').forEach((cell, index) => {
            if (board[index] === 'X') {
                cell.textContent = 'X';
                cell.classList.add('text-red-500', 'occupied');
                cell.classList.remove('text-blue-500');
            } else if (board[index] === 'O') {
                cell.textContent = 'O';
                cell.classList.add('text-blue-500', 'occupied');
                cell.classList.remove('text-red-500');
            } else {
                cell.textContent = '';
                cell.classList.remove('text-red-500', 'text-blue-500', 'occupied', 'winning-cell');
            }
        });
        
        updateCurrentTurnDisplay();
    }
    
    // Handle cell click
    function handleCellClick(index) {
        if (!gameActive || board[index] !== '') return;
        
        board[index] = currentPlayer;
        updateBoard();
        
        if (checkWin()) {
            handleWin();
            return;
        }
        
        if (checkDraw()) {
            handleDraw();
            return;
        }
        
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        
        // If playing against computer and it's computer's turn
        if (gameMode === 'computer' && currentPlayer === 'O' && gameActive) {
            setTimeout(computerMove, 500);
        }
    }
    
    // Check for win
    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return board[a] !== '' && board[a] === board[b] && board[a] === board[c];
        });
    }
    
    // Check for draw
    function checkDraw() {
        return board.every(cell => cell !== '');
    }
    
    // Handle win
    function handleWin() {
        gameActive = false;
        
        // Highlight winning cells
        const winningPattern = findWinningPattern();
        if (winningPattern) {
            winningPattern.forEach(index => {
                document.querySelector(`.cell[data-index="${index}"]`).classList.add('winning-cell');
            });
        }
        
        // Update stats
        if (currentPlayer === 'X') {
            if (gameMode === 'computer') {
                stats.computer.redWins++;
            } else if (gameMode === 'online') {
                stats.online.redWins++;
            } else {
                stats.offline.redWins++;
            }
            
            gameStatus.textContent = `${redPlayerInput.value || 'Player 1'} (X) wins!`;
            gameStatus.className = 'mt-4 text-center text-lg font-semibold text-red-500';
        } else {
            if (gameMode === 'computer') {
                stats.computer.computerWins++;
                gameStatus.textContent = `Computer (O) wins!`;
            } else if (gameMode === 'online') {
                stats.online.blueWins++;
                gameStatus.textContent = `${bluePlayerInput.value || 'Player 2'} (O) wins!`;
            } else {
                stats.offline.blueWins++;
                gameStatus.textContent = `${bluePlayerInput.value || 'Player 2'} (O) wins!`;
            }
            gameStatus.className = 'mt-4 text-center text-lg font-semibold text-blue-500';
        }
        
        if (gameMode === 'computer') {
            stats.computer.totalGames++;
        } else if (gameMode === 'online') {
            stats.online.totalGames++;
        } else {
            stats.offline.totalGames++;
        }
        
        updateStats();
    }
    
    // Find the winning pattern
    function findWinningPattern() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        
        return winPatterns.find(pattern => {
            const [a, b, c] = pattern;
            return board[a] !== '' && board[a] === board[b] && board[a] === board[c];
        });
    }
    
    // Handle draw
    function handleDraw() {
        gameActive = false;
        gameStatus.textContent = 'Game ended in a draw!';
        gameStatus.className = 'mt-4 text-center text-lg font-semibold text-gray-500';
        
        if (gameMode === 'computer') {
            stats.computer.draws++;
            stats.computer.totalGames++;
        } else if (gameMode === 'online') {
            stats.online.draws++;
            stats.online.totalGames++;
        } else {
            stats.offline.draws++;
            stats.offline.totalGames++;
        }
        
        updateStats();
    }
    
    // Reset game
    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('winning-cell');
        });
        
        gameStatus.textContent = '';
        gameStatus.className = 'mt-4 text-center text-lg font-semibold';
        
        updateBoard();
    }
    
    // Computer move with different difficulty levels
    function computerMove() {
        if (!gameActive) return;
        
        let move;
        
        switch (computerLevel) {
            case 'easy':
                // Random moves
                move = findRandomMove();
                break;
                
            case 'medium':
                // 50% chance to make a smart move, 50% random
                if (Math.random() < 0.5) {
                    move = findWinningMove('O') || findWinningMove('X') || findRandomMove();
                } else {
                    move = findRandomMove();
                }
                break;
                
            case 'hard':
                // Always try to win or block, then random
                move = findWinningMove('O') || findWinningMove('X') || findRandomMove();
                break;
                
            case 'impossible':
                // Perfect AI - minimax algorithm
                move = findBestMove();
                break;
                
            default:
                move = findRandomMove();
        }
        
        if (move !== null) {
            board[move] = 'O';
            updateBoard();
            
            if (checkWin()) {
                handleWin();
                return;
            }
            
            if (checkDraw()) {
                handleDraw();
                return;
            }
            
            currentPlayer = 'X';
            updateCurrentTurnDisplay();
        }
    }
    
    // Minimax algorithm for impossible difficulty
    function findBestMove() {
        // AI is 'O', human is 'X'
        let bestScore = -Infinity;
        let bestMove = null;
        
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }
    
    function minimax(board, depth, isMaximizing) {
        // Check terminal states
        if (checkWin()) {
            return isMaximizing ? -10 + depth : 10 - depth;
        } else if (checkDraw()) {
            return 0;
        }
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    
    // Find winning move for a player
    function findWinningMove(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            // Check if two in a row and third is empty
            if (board[a] === player && board[b] === player && board[c] === '') return c;
            if (board[a] === player && board[c] === player && board[b] === '') return b;
            if (board[b] === player && board[c] === player && board[a] === '') return a;
        }
        
        return null;
    }
    
    // Find random valid move
    function findRandomMove() {
        const emptyCells = board.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);
        
        if (emptyCells.length > 0) {
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
        
        return null;
    }
    
    // Update current turn display
    function updateCurrentTurnDisplay() {
        if (currentPlayer === 'X') {
            currentTurnDisplay.textContent = `Red (X)`;
            currentTurnDisplay.className = 'text-lg font-bold text-red-500';
        } else {
            if (gameMode === 'computer') {
                currentTurnDisplay.textContent = `Computer (O)`;
            } else {
                currentTurnDisplay.textContent = `Blue (O)`;
            }
            currentTurnDisplay.className = 'text-lg font-bold text-blue-500';
        }
    }
    
    // Update statistics display
    function updateStats() {
        if (gameMode === 'computer') {
            redWinsDisplay.textContent = stats.computer.redWins;
            blueWinsDisplay.textContent = stats.computer.computerWins;
            drawsDisplay.textContent = stats.computer.draws;
            totalGamesDisplay.textContent = stats.computer.totalGames;
        } else if (gameMode === 'online') {
            redWinsDisplay.textContent = stats.online.redWins;
            blueWinsDisplay.textContent = stats.online.blueWins;
            drawsDisplay.textContent = stats.online.draws;
            totalGamesDisplay.textContent = stats.online.totalGames;
        } else {
            redWinsDisplay.textContent = stats.offline.redWins;
            blueWinsDisplay.textContent = stats.offline.blueWins;
            drawsDisplay.textContent = stats.offline.draws;
            totalGamesDisplay.textContent = stats.offline.totalGames;
        }
        
        // Update all stats display
        offlineStatsDisplay.textContent = `Red: ${stats.offline.redWins}, Blue: ${stats.offline.blueWins}, Draws: ${stats.offline.draws}`;
        onlineStatsDisplay.textContent = `Red: ${stats.online.redWins}, Blue: ${stats.online.blueWins}, Draws: ${stats.online.draws}`;
        computerStatsDisplay.textContent = `You: ${stats.computer.redWins}, Computer: ${stats.computer.computerWins}, Draws: ${stats.computer.draws}`;
    }
    
    // Reset all statistics
    function resetAllStats() {
        stats = {
            offline: { redWins: 0, blueWins: 0, draws: 0, totalGames: 0 },
            online: { redWins: 0, blueWins: 0, draws: 0, totalGames: 0 },
            computer: { redWins: 0, computerWins: 0, draws: 0, totalGames: 0 }
        };
        updateStats();
    }
    
    // Set game mode
    function setGameMode(mode) {
        gameMode = mode;
        
        // Update button styles
        modeOffline.className = 'game-mode-btn bg-gray-600 hover:bg-gray-500 text-gray-200 py-2 px-2 rounded transition';
        modeOnline.className = 'game-mode-btn bg-gray-600 hover:bg-gray-500 text-gray-200 py-2 px-2 rounded transition';
        modeComputer.className = 'game-mode-btn bg-gray-600 hover:bg-gray-500 text-gray-200 py-2 px-2 rounded transition';
        
        // Show/hide computer level selector
        if (mode === 'computer') {
            computerLevelContainer.classList.remove('hidden');
            bluePlayerInput.value = 'Computer';
            bluePlayerInput.disabled = true;
            currentModeDisplay.textContent = 'vs Computer (' + computerLevel.charAt(0).toUpperCase() + computerLevel.slice(1) + ')';
        } else {
            computerLevelContainer.classList.add('hidden');
            bluePlayerInput.disabled = false;
            
            if (mode === 'online') {
                currentModeDisplay.textContent = 'Online';
                // Online functionality would go here
                alert('Online mode is not implemented in this demo. Playing offline instead.');
                gameMode = 'offline';
                modeOffline.className = 'game-mode-btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded transition';
                currentModeDisplay.textContent = 'Offline';
            } else {
                currentModeDisplay.textContent = 'Offline';
            }
        }
        
        if (mode === 'offline') {
            modeOffline.className = 'game-mode-btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded transition';
        } else if (mode === 'online') {
            modeOnline.className = 'game-mode-btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded transition';
        } else if (mode === 'computer') {
            modeComputer.className = 'game-mode-btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded transition';
        }
        
        resetGame();
        updateStats();
    }
    
    // Set computer level
    function setComputerLevel(level) {
        computerLevel = level;
        
        // Update button styles
        levelEasy.className = 'game-mode-btn bg-gray-600 hover:bg-gray-500 text-gray-200 py-2 px-2 rounded transition';
        levelMedium.className = 'game-mode-btn bg-gray-600 hover:bg-gray-500 text-gray-200 py-2 px-2 rounded transition';
        levelHard.className = 'game-mode-btn bg-gray-600 hover:bg-gray-500 text-gray-200 py-2 px-2 rounded transition';
        levelImpossible.className = 'game-mode-btn bg-gray-600 hover:bg-gray-500 text-gray-200 py-2 px-2 rounded transition';
        
        if (level === 'easy') {
            levelEasy.className = 'game-mode-btn bg-green-500 hover:bg-green-600 text-white py-2 px-2 rounded transition';
        } else if (level === 'medium') {
            levelMedium.className = 'game-mode-btn bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-2 rounded transition';
        } else if (level === 'hard') {
            levelHard.className = 'game-mode-btn bg-orange-500 hover:bg-orange-600 text-white py-2 px-2 rounded transition';
        } else if (level === 'impossible') {
            levelImpossible.className = 'game-mode-btn bg-red-500 hover:bg-red-600 text-white py-2 px-2 rounded transition';
        }
        
        currentModeDisplay.textContent = 'vs Computer (' + level.charAt(0).toUpperCase() + level.slice(1) + ')';
    }
    
    // Toggle all statistics display
    function toggleAllStats() {
        if (allStatsContainer.classList.contains('hidden')) {
            allStatsContainer.classList.remove('hidden');
            toggleStats.textContent = 'Hide All Statistics';
        } else {
            allStatsContainer.classList.add('hidden');
            toggleStats.textContent = 'Show All Statistics';
        }
    }
    
    // Event listeners
    resetButton.addEventListener('click', resetGame);
    newGameButton.addEventListener('click', resetAllStats);
    
    modeOffline.addEventListener('click', () => setGameMode('offline'));
    modeOnline.addEventListener('click', () => setGameMode('online'));
    modeComputer.addEventListener('click', () => setGameMode('computer'));
    
    levelEasy.addEventListener('click', () => setComputerLevel('easy'));
    levelMedium.addEventListener('click', () => setComputerLevel('medium'));
    levelHard.addEventListener('click', () => setComputerLevel('hard'));
    levelImpossible.addEventListener('click', () => setComputerLevel('impossible'));
    
    redPlayerInput.addEventListener('input', updateCurrentTurnDisplay);
    bluePlayerInput.addEventListener('input', updateCurrentTurnDisplay);
    
    toggleStats.addEventListener('click', toggleAllStats);
    
    // Initialize the game
    initializeBoard();
    setGameMode('offline');
    setComputerLevel('medium');
});
