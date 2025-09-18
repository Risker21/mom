// 游戏常量定义
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const NEXT_BLOCK_SIZE = 25;
const NEXT_BLOCK_COLS = 4;
const NEXT_BLOCK_ROWS = 4;

// 游戏状态
let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let level = 1;
let lines = 0;
let gameInterval = null;
let gameSpeed = 1000; // 毫秒
let isGameRunning = false;
let isPaused = false;

// 获取DOM元素
const canvas = document.getElementById('tetris-board');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-piece-canvas');
const nextCtx = nextCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreElement = document.getElementById('final-score');
const playAgainButton = document.getElementById('play-again-button');
const toggleSoundButton = document.getElementById('toggle-sound');

// 获取移动端触摸控制器按钮
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');
const downButton = document.getElementById('down-button');
const rotateButton = document.getElementById('rotate-button');
const dropButton = document.getElementById('drop-button');

// 音效控制
let soundEnabled = true;
let audioContext = null;

// 调整画布尺寸以适应屏幕
function adjustCanvasSize() {
    // 检查是否在移动设备上
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // 在移动设备上，计算合适的方块大小
        const maxBoardWidth = window.innerWidth - 40; // 减去边距
        const adjustedBlockSize = Math.floor(maxBoardWidth / COLS);
        
        // 设置调整后的尺寸
        canvas.width = COLS * adjustedBlockSize;
        canvas.height = ROWS * adjustedBlockSize;
        
        // 调整下一个方块预览的尺寸
        nextCanvas.width = NEXT_BLOCK_COLS * adjustedBlockSize * 0.8;
        nextCanvas.height = NEXT_BLOCK_ROWS * adjustedBlockSize * 0.8;
        
        // 存储调整后的方块大小，用于重绘
        window.adjustedBlockSize = adjustedBlockSize;
    } else {
        // 在桌面设备上使用原始尺寸
        canvas.width = COLS * BLOCK_SIZE;
        canvas.height = ROWS * BLOCK_SIZE;
        nextCanvas.width = NEXT_BLOCK_COLS * NEXT_BLOCK_SIZE;
        nextCanvas.height = NEXT_BLOCK_ROWS * NEXT_BLOCK_SIZE;
        window.adjustedBlockSize = BLOCK_SIZE;
    }
}

// 初始调整画布尺寸
adjustCanvasSize();

// 监听窗口大小变化，调整画布尺寸
window.addEventListener('resize', adjustCanvasSize);

// 方块形状定义
const TETROMINOS = {
    0: { shape: [], color: '0, 0, 0' },
    I: { 
        shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], 
        color: '80, 227, 230' 
    },
    J: { 
        shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]], 
        color: '36, 95, 223' 
    },
    L: { 
        shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]], 
        color: '223, 173, 36' 
    },
    O: { 
        shape: [[1, 1], [1, 1]], 
        color: '223, 217, 36' 
    },
    S: { 
        shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], 
        color: '48, 211, 56' 
    },
    T: { 
        shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]], 
        color: '132, 61, 198' 
    },
    Z: { 
        shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], 
        color: '227, 78, 78' 
    }
};

// 颜色定义
const COLORS = {
    empty: 'rgba(0, 0, 0, 0)',
    I: 'rgba(0, 255, 255, 0.9)', // 青色
    J: 'rgba(0, 0, 255, 0.9)', // 蓝色
    L: 'rgba(255, 165, 0, 0.9)', // 橙色
    O: 'rgba(255, 255, 0, 0.9)', // 黄色
    S: 'rgba(0, 255, 0, 0.9)', // 绿色
    T: 'rgba(128, 0, 128, 0.9)', // 紫色
    Z: 'rgba(255, 0, 0, 0.9)', // 红色
    border: 'rgba(51, 51, 51, 0.5)',
    ghost: 'rgba(255, 255, 255, 0.2)'
};

// 初始化Web Audio API
function initAudio() {
    if (!audioContext && typeof AudioContext !== 'undefined') {
        try {
            audioContext = new AudioContext();
        } catch (e) {
            console.log('Web Audio API 初始化失败:', e);
        }
    }
}

// 创建简单的音效
function createTone(type, frequency, duration) {
    if (!audioContext) return;
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = type; // 'sine', 'square', 'triangle', 'sawtooth'
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
        console.log('创建音效失败:', e);
    }
}

// 播放不同类型的游戏音效
function playSound(type) {
    if (!soundEnabled || !audioContext) return;
    
    // 确保audioContext处于running状态
    if (audioContext.state === 'suspended') {
        audioContext.resume().catch(e => console.log('恢复音频上下文失败:', e));
    }
    
    switch (type) {
        case 'move':
            createTone('sine', 440, 0.1);
            break;
        case 'rotate':
            createTone('triangle', 523, 0.15);
            break;
        case 'drop':
            // 硬下落音效
            createTone('sine', 880, 0.2);
            setTimeout(() => {
                createTone('square', 660, 0.15);
            }, 100);
            break;
        case 'clearLine':
            // 更丰富的消行音效
            createTone('square', 659, 0.1);
            setTimeout(() => {
                createTone('square', 784, 0.1);
            }, 100);
            setTimeout(() => {
                createTone('square', 988, 0.15);
            }, 200);
            break;
        case 'gameOver':
            createTone('sawtooth', 220, 0.5);
            setTimeout(() => {
                createTone('sawtooth', 180, 0.5);
            }, 300);
            break;
        default:
            break;
    }
}

// 切换音效开关
function toggleSound() {
    soundEnabled = !soundEnabled;
    
    if (toggleSoundButton) {
        const icon = toggleSoundButton.querySelector('i');
        const text = toggleSoundButton.querySelector('span');
        
        if (soundEnabled) {
            icon.className = 'fas fa-volume-up';
            text.textContent = '音效: 开启';
        } else {
            icon.className = 'fas fa-volume-mute';
            text.textContent = '音效: 关闭';
        }
    }
}

// 初始化游戏板
function initializeBoard() {
    board = [];
    for (let row = 0; row < ROWS; row++) {
        board[row] = [];
        for (let col = 0; col < COLS; col++) {
            board[row][col] = 0;
        }
    }
}

// 创建新方块
function createPiece() {
    const tetrominoKeys = 'IJLOSTZ';
    const randomTetromino = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
    const piece = TETROMINOS[randomTetromino];
    
    return {
        shape: piece.shape,
        color: piece.color,
        x: Math.floor((COLS - piece.shape[0].length) / 2),
        y: 0
    };
}

// 检查方块移动是否有效
function isValidMove(piece, offsetX = 0, offsetY = 0) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col]) {
                const newX = piece.x + col + offsetX;
                const newY = piece.y + row + offsetY;
                
                // 检查边界
                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return false;
                }
                
                // 检查碰撞
                if (newY >= 0 && board[newY][newX]) {
                    return false;
                }
            }
        }
    }
    return true;
}

// 将方块固定到游戏板上
function lockPiece() {
    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col]) {
                const boardRow = currentPiece.y + row;
                const boardCol = currentPiece.x + col;
                
                if (boardRow >= 0) {
                    board[boardRow][boardCol] = currentPiece.color;
                }
            }
        }
    }
}

// 旋转方块
function rotatePiece() {
    const originalShape = currentPiece.shape;
    const numRows = originalShape.length;
    const numCols = originalShape[0].length;
    const rotatedShape = [];
    
    // 创建旋转后的形状
    for (let i = 0; i < numCols; i++) {
        rotatedShape[i] = [];
        for (let j = 0; j < numRows; j++) {
            rotatedShape[i][j] = originalShape[numRows - 1 - j][i];
        }
    }
    
    // 保存原始形状
    currentPiece.shape = rotatedShape;
    
    // 检查旋转是否有效，如果无效则恢复原始形状
    if (!isValidMove(currentPiece)) {
        // 尝试墙踢
        if (isValidMove(currentPiece, -1, 0)) {
            currentPiece.x--;
        } else if (isValidMove(currentPiece, 1, 0)) {
            currentPiece.x++;
        } else if (isValidMove(currentPiece, 0, -1)) {
            currentPiece.y--;
        } else {
            currentPiece.shape = originalShape;
        }
    }
}

// 清除完整的行
function clearLines() {
    let linesCleared = 0;
    
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            // 移除完整的行
            board.splice(row, 1);
            // 在顶部添加新的空行
            board.unshift(new Array(COLS).fill(0));
            // 增加行数
            linesCleared++;
            // 由于移除了一行，需要重新检查当前行
            row++;
        }
    }
    
    if (linesCleared > 0) {
        updateScore(linesCleared);
        drawLineClearAnimation(linesCleared);
        playSound('clearLine');
    }
}

// 更新分数
function updateScore(linesCleared) {
    const linePoints = [0, 100, 300, 500, 800]; // 0, 1, 2, 3, 4行的分数
    const scoreIncrease = linePoints[linesCleared] * level;
    
    score += scoreIncrease;
    lines += linesCleared;
    
    // 每清除10行升级
    const newLevel = Math.floor(lines / 10) + 1;
    if (newLevel > level) {
        level = newLevel;
        updateGameSpeed();
    }
    
    // 更新显示
    scoreElement.textContent = score;
    levelElement.textContent = level;
    linesElement.textContent = lines;
}

// 更新游戏速度
function updateGameSpeed() {
    gameSpeed = Math.max(100, 1000 - (level - 1) * 100);
    
    if (isGameRunning && !isPaused) {
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
}

// 绘制游戏板
function drawBoard() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const blockSize = window.adjustedBlockSize || BLOCK_SIZE;
    
    // 绘制游戏板背景
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格线
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
            ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
    }
    
    // 绘制已固定的方块
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                drawBlock(ctx, x, y, `rgba(${board[y][x]}, 0.8)`, blockSize);
            }
        }
    }
    
    // 绘制影子方块
    if (isGameRunning && !isPaused && currentPiece) {
        drawGhostPiece(blockSize);
    }
    
    // 绘制当前方块
    if (currentPiece) {
        const shape = currentPiece.shape;
        const color = `rgba(${currentPiece.color}, 0.9)`;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const boardRow = currentPiece.y + y;
                    const boardCol = currentPiece.x + x;
                    if (boardRow >= 0) {
                        drawBlock(ctx, boardCol, boardRow, color, blockSize);
                    }
                }
            }
        }
    }
    
    // 如果游戏暂停，显示暂停信息
    if (isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
}

// 绘制单个方块
function drawBlock(ctx, x, y, color, blockSize) {
    const padding = 2;
    
    // 绘制方块主体
    ctx.fillStyle = color;
    ctx.fillRect(x * blockSize + padding, y * blockSize + padding, 
                 blockSize - padding * 2, blockSize - padding * 2);
    
    // 绘制方块边框阴影
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 3;
    ctx.strokeRect(x * blockSize + padding + 1, y * blockSize + padding + 1, 
                   blockSize - padding * 2, blockSize - padding * 2);
    
    // 绘制方块边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x * blockSize + padding, y * blockSize + padding, 
                   blockSize - padding * 2, blockSize - padding * 2);
    
    // 绘制方块高光（更明显的高光效果）
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(x * blockSize + padding, y * blockSize + padding, 
                 blockSize - padding * 2, (blockSize - padding * 2) / 3);
    ctx.fillRect(x * blockSize + padding, y * blockSize + padding, 
                 (blockSize - padding * 2) / 3, blockSize - padding * 2);
    
    // 右下角添加细微的暗部，增强立体感
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(x * blockSize + padding + (blockSize - padding * 2) * 0.67, 
                 y * blockSize + padding + (blockSize - padding * 2) * 0.67, 
                 (blockSize - padding * 2) * 0.33, 
                 (blockSize - padding * 2) * 0.33);
}

// 绘制下一个方块预览
function drawNextPiece() {
    const ctx = nextCanvas.getContext('2d');
    ctx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    // 绘制预览区域背景
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    // 绘制下一个方块
    if (nextPiece) {
        const shape = nextPiece.shape;
        const color = `rgba(${nextPiece.color}, 0.8)`;
        const isMobile = window.innerWidth <= 768;
        const nextBlockSize = isMobile ? (window.adjustedBlockSize || BLOCK_SIZE) * 0.8 : NEXT_BLOCK_SIZE;
        
        // 计算居中位置
        const offsetX = (nextCanvas.width - shape[0].length * nextBlockSize) / 2;
        const offsetY = (nextCanvas.height - shape.length * nextBlockSize) / 2;
        
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    // 绘制预览方块
                    const padding = 1;
                    
                    ctx.fillStyle = color;
                    ctx.fillRect(offsetX + x * nextBlockSize + padding, 
                                 offsetY + y * nextBlockSize + padding, 
                                 nextBlockSize - padding * 2, 
                                 nextBlockSize - padding * 2);
                    
                    // 绘制边框
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(offsetX + x * nextBlockSize + padding, 
                                   offsetY + y * nextBlockSize + padding, 
                                   nextBlockSize - padding * 2, 
                                   nextBlockSize - padding * 2);
                }
            }
        }
    }
}

// 绘制影子方块
function drawGhostPiece(blockSize) {
    if (!currentPiece) return;
    
    const ctx = canvas.getContext('2d');
    const tempPiece = { ...currentPiece };
    
    // 找到影子方块的最终位置
    while (isValidMove(tempPiece, 0, 1)) {
        tempPiece.y++;
    }
    
    // 绘制影子方块
    const shape = tempPiece.shape;
    
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const padding = 2;
                const boardRow = tempPiece.y + y;
                const boardCol = tempPiece.x + x;
                
                if (boardRow >= 0) {
                    ctx.fillStyle = COLORS.ghost;
                    ctx.globalAlpha = 0.2;
                    ctx.fillRect(boardCol * blockSize + padding, 
                                boardRow * blockSize + padding, 
                                blockSize - padding * 2, 
                                blockSize - padding * 2);
                    
                    // 绘制边框
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(boardCol * blockSize + padding, 
                                  boardRow * blockSize + padding, 
                                  blockSize - padding * 2, 
                                  blockSize - padding * 2);
                }
            }
        }
    }
    
    // 重置透明度
    ctx.globalAlpha = 1;
}

// 绘制消行动画
function drawLineClearAnimation(linesCleared) {
    // 优化：使用更生动的消行动画效果
    const ctx = canvas.getContext('2d');
    const blockSize = window.adjustedBlockSize || BLOCK_SIZE;
    
    // 闪烁动画
    let flashCount = 0;
    const flashInterval = setInterval(() => {
        flashCount++;
        drawBoard(); // 先绘制基础画面
        
        // 找出被清除的行
        const clearedLines = [];
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row].every(cell => cell !== 0)) {
                clearedLines.push(row);
            }
        }
        
        // 绘制闪光效果
        if (flashCount % 2 === 0) {
            clearedLines.forEach(line => {
                ctx.fillStyle = `rgba(255, 255, 255, ${0.7 - flashCount * 0.1})`;
                ctx.fillRect(0, line * blockSize, canvas.width, blockSize);
            });
        }
        
        // 结束动画
        if (flashCount >= 5) {
            clearInterval(flashInterval);
            drawBoard();
        }
    }, 80);
}

// 游戏主循环
function gameLoop() {
    if (!isPaused && isGameRunning) {
        // 尝试下移方块
        if (isValidMove(currentPiece, 0, 1)) {
            currentPiece.y++;
        } else {
            // 方块无法下移，固定到游戏板上
            lockPiece();
            // 清除完整的行
            clearLines();
            // 生成新方块
            spawnNewPiece();
            // 检查游戏是否结束
            if (!isValidMove(currentPiece)) {
                endGame();
                return; // 游戏结束，不再继续循环
            }
        }
        
        // 直接绘制，避免嵌套的requestAnimationFrame导致的延迟问题
        drawBoard();
    }
}

// 生成新方块
function spawnNewPiece() {
    currentPiece = nextPiece || createPiece();
    nextPiece = createPiece();
    drawNextPiece();
    
    // 绘制幽灵方块（显示方块将落到的位置）
    drawBoard();
}

// 开始游戏
function startGame() {
    initializeBoard();
    score = 0;
    level = 1;
    lines = 0;
    isGameRunning = true;
    isPaused = false;
    
    // 更新显示
    scoreElement.textContent = score;
    levelElement.textContent = level;
    linesElement.textContent = lines;
    
    // 生成初始方块
    spawnNewPiece();
    
    // 开始游戏循环
    updateGameSpeed();
    
    // 更新按钮状态
    startButton.disabled = true;
    pauseButton.disabled = false;
    
    // 隐藏游戏结束弹窗
    gameOverModal.classList.add('hidden');
    
    // 播放开始游戏音效
    if (soundEnabled && audioContext) {
        playSound('rotate');
    }
}

// 暂停游戏
function pauseGame() {
    if (isGameRunning) {
        isPaused = !isPaused;
        
        if (isPaused) {
            clearInterval(gameInterval);
            pauseButton.innerHTML = '<i class="fas fa-play"></i> 继续';
            // 绘制暂停文字
            drawBoard();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('游戏暂停', canvas.width / 2, canvas.height / 2);
        } else {
            updateGameSpeed();
            pauseButton.innerHTML = '<i class="fas fa-pause"></i> 暂停';
        }
    }
}

// 重置游戏
function resetGame() {
    // 停止游戏循环
    clearInterval(gameInterval);
    
    // 重置游戏状态
    isGameRunning = false;
    isPaused = false;
    
    // 更新按钮状态
    startButton.disabled = false;
    pauseButton.disabled = true;
    pauseButton.innerHTML = '<i class="fas fa-pause"></i> 暂停';
    
    // 清空游戏板
    initializeBoard();
    currentPiece = null;
    nextPiece = null;
    
    // 重置显示
    scoreElement.textContent = '0';
    levelElement.textContent = '1';
    linesElement.textContent = '0';
    
    // 重绘游戏
    drawBoard();
    drawNextPiece();
    
    // 隐藏游戏结束弹窗
    gameOverModal.classList.add('hidden');
}

// 结束游戏
function endGame() {
    // 停止游戏循环
    clearInterval(gameInterval);
    
    // 播放游戏结束音效
    playSound('gameOver');
    
    // 更新游戏状态
    isGameRunning = false;
    
    // 更新按钮状态
    startButton.disabled = false;
    pauseButton.disabled = true;
    
    // 显示游戏结束弹窗
    finalScoreElement.textContent = score;
    gameOverModal.classList.remove('hidden');
}

// 处理键盘输入
function handleKeyPress(event) {
    if (!isGameRunning || isPaused) return;
    
    switch (event.key) {
        case 'ArrowLeft':
            if (isValidMove(currentPiece, -1, 0)) {
                currentPiece.x--;
                drawBoard();
                playSound('move');
            }
            break;
        case 'ArrowRight':
            if (isValidMove(currentPiece, 1, 0)) {
                currentPiece.x++;
                drawBoard();
                playSound('move');
            }
            break;
        case 'ArrowDown':
            if (isValidMove(currentPiece, 0, 1)) {
                currentPiece.y++;
                drawBoard();
                // 下移得分
                score += 1;
                scoreElement.textContent = score;
                playSound('move');
            }
            break;
        case 'ArrowUp':
            rotatePiece();
            drawBoard();
            playSound('rotate');
            break;
        case ' ':
            // 直接落地（硬下落）
            let dropped = false;
            while (isValidMove(currentPiece, 0, 1)) {
                currentPiece.y++;
                score += 2; // 落地得分
                dropped = true;
            }
            if (dropped) {
                scoreElement.textContent = score;
                drawBoard();
                playSound('drop'); // 使用专门的硬下落音效
            }
            // 立即处理方块固定
            setTimeout(() => {
                if (isGameRunning && !isPaused) {
                    lockPiece();
                    clearLines();
                    spawnNewPiece();
                    if (!isValidMove(currentPiece)) {
                        endGame();
                    } else {
                        drawBoard();
                    }
                }
            }, 50);
            break;
        case 'p':
        case 'P':
            pauseGame();
            break;
    }
}

// 初始化游戏
function initGame() {
    // 初始化游戏板
    initializeBoard();
    
    // 初始化音频系统
    initAudio();
    
    // 绘制初始游戏板
    drawBoard();
    drawNextPiece();
    
    // 添加事件监听
    startButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', pauseGame);
    resetButton.addEventListener('click', resetGame);
    playAgainButton.addEventListener('click', startGame);
    toggleSoundButton.addEventListener('click', toggleSound);
    document.addEventListener('keydown', handleKeyPress);
    
    // 添加点击事件以启用音效（解决自动播放限制）
    function checkAndResumeAudio() {
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().catch(e => console.log('恢复音频上下文失败:', e));
        }
    }
    
    // 在任何用户交互时尝试恢复音频上下文
    document.addEventListener('click', checkAndResumeAudio);
    document.addEventListener('keydown', checkAndResumeAudio);
    document.addEventListener('touchstart', checkAndResumeAudio);
    
    // 添加移动端触摸控制事件监听
    
    // 添加移动端触摸控制事件监听
    if (leftButton) {
        leftButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (isGameRunning && !isPaused && isValidMove(currentPiece, -1, 0)) {
                currentPiece.x--;
                drawBoard();
                playSound('move');
            }
        });
    }
    
    if (rightButton) {
        rightButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (isGameRunning && !isPaused && isValidMove(currentPiece, 1, 0)) {
                currentPiece.x++;
                drawBoard();
                playSound('move');
            }
        });
    }
    
    if (downButton) {
        downButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (isGameRunning && !isPaused && isValidMove(currentPiece, 0, 1)) {
                currentPiece.y++;
                drawBoard();
                score += 1;
                scoreElement.textContent = score;
                playSound('move');
            }
        });
    }
    
    if (rotateButton) {
        rotateButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (isGameRunning && !isPaused) {
                rotatePiece();
                drawBoard();
                playSound('rotate');
            }
        });
    }
    
    if (dropButton) {
        dropButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (isGameRunning && !isPaused) {
                let dropped = false;
                while (isValidMove(currentPiece, 0, 1)) {
                    currentPiece.y++;
                    score += 2;
                    dropped = true;
                }
                if (dropped) {
                    scoreElement.textContent = score;
                    drawBoard();
                    playSound('drop'); // 使用专门的硬下落音效
                }
                // 立即处理方块固定
                setTimeout(() => {
                    if (isGameRunning && !isPaused) {
                        lockPiece();
                        clearLines();
                        spawnNewPiece();
                        if (!isValidMove(currentPiece)) {
                            endGame();
                        } else {
                            drawBoard();
                        }
                    }
                }, 50);
            }
        });
    }
}

// 启动游戏
initGame();