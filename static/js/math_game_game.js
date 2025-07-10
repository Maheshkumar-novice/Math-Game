class SpaceMathGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.currentAnswer = null;
        this.options = [];
        this.gameActive = false;
        this.operations = ['+', '-', '*'];
        this.maxNumber = 10;
        
        this.initElements();
        this.setupEventListeners();
    }
    
    initElements() {
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.livesElement = document.getElementById('lives');
        this.problemElement = document.getElementById('problem');
        this.messageElement = document.getElementById('message');
        this.answerSection = document.getElementById('answer-section');
        this.optionButtons = document.querySelectorAll('.option-btn');
        this.startBtn = document.getElementById('start-btn');
        this.newGameBtn = document.getElementById('new-game-btn');
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameActive) return;
            const key = e.key.toLowerCase();
            if (key === 'a' || key === '1') this.selectAnswer(0);
            else if (key === 'b' || key === '2') this.selectAnswer(1);
            else if (key === 'c' || key === '3') this.selectAnswer(2);
            else if (key === 'd' || key === '4') this.selectAnswer(3);
        });
    }
    
    generateProblem() {
        const operation = this.operations[Math.floor(Math.random() * this.operations.length)];
        let num1, num2, answer;
        
        switch (operation) {
            case '+':
                num1 = Math.floor(Math.random() * this.maxNumber) + 1;
                num2 = Math.floor(Math.random() * this.maxNumber) + 1;
                answer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * this.maxNumber) + this.maxNumber;
                num2 = Math.floor(Math.random() * this.maxNumber) + 1;
                answer = num1 - num2;
                break;
            case '*':
                num1 = Math.floor(Math.random() * Math.min(this.maxNumber, 12)) + 1;
                num2 = Math.floor(Math.random() * Math.min(this.maxNumber, 12)) + 1;
                answer = num1 * num2;
                break;
        }
        
        this.currentAnswer = answer;
        this.problemElement.textContent = `${num1} ${operation} ${num2} = ?`;
        this.generateOptions();
    }
    
    generateOptions() {
        this.options = [this.currentAnswer];
        
        while (this.options.length < 4) {
            const variation = Math.floor(Math.random() * 10) + 1;
            const wrongAnswer = Math.random() < 0.5 ? 
                this.currentAnswer + variation : 
                Math.max(0, this.currentAnswer - variation);
            
            if (!this.options.includes(wrongAnswer)) {
                this.options.push(wrongAnswer);
            }
        }
        
        // Shuffle options
        for (let i = this.options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.options[i], this.options[j]] = [this.options[j], this.options[i]];
        }
        
        this.optionButtons.forEach((btn, index) => {
            btn.textContent = this.options[index];
            btn.className = 'option-btn';
        });
    }
    
    selectAnswer(optionIndex) {
        if (!this.gameActive) return;
        
        this.optionButtons.forEach((btn, index) => {
            btn.style.pointerEvents = 'none';
            if (this.options[index] === this.currentAnswer) {
                btn.classList.add('correct');
            } else if (index === optionIndex) {
                btn.classList.add('incorrect');
            }
        });
        
        if (this.options[optionIndex] === this.currentAnswer) {
            this.handleCorrect();
        } else {
            this.handleIncorrect();
        }
    }
    
    handleCorrect() {
        this.answerSection.style.display = 'none';
        this.score += this.level * 10;
        this.updateDisplay();
        this.showMessage('🎉 Correct!', 'correct');
        
        if (this.score >= this.level * 100) {
            this.level++;
            this.maxNumber = Math.min(this.maxNumber + 5, 50);
            this.updateDisplay();
            if (this.level > 3) this.operations.push('/');
        }
        
        this.nextProblem(600);
    }
    
    handleIncorrect() {
        this.answerSection.style.display = 'none';
        this.lives--;
        this.updateDisplay();
        this.showMessage(`❌ Answer: ${this.currentAnswer}`, 'incorrect');
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.nextProblem(800);
        }
    }
    
    nextProblem(delay) {
        setTimeout(() => {
            this.generateProblem();
            this.clearMessage();
            this.answerSection.style.display = 'flex';
            this.resetOptions();
        }, delay);
    }
    
    gameOver() {
        this.gameActive = false;
        this.showMessage(`🛸 Mission Complete! Final Score: ${this.score}`, 'game-over');
        this.startBtn.style.display = 'none';
        this.newGameBtn.style.display = 'inline-block';
    }
    
    start() {
        this.gameActive = true;
        this.answerSection.style.display = 'flex';
        this.startBtn.style.display = 'none';
        this.generateProblem();
        this.clearMessage();
        this.resetOptions();
    }
    
    reset() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.maxNumber = 10;
        this.operations = ['+', '-', '*'];
        this.gameActive = false;
        this.updateDisplay();
        this.answerSection.style.display = 'none';
        this.problemElement.textContent = 'Ready to blast off?';
        this.clearMessage();
        this.startBtn.style.display = 'inline-block';
        this.newGameBtn.style.display = 'none';
    }
    
    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
        this.livesElement.textContent = this.lives;
    }
    
    showMessage(text, type) {
        this.messageElement.textContent = text;
        this.messageElement.className = `message ${type}`;
    }
    
    clearMessage() {
        this.messageElement.textContent = '';
        this.messageElement.className = 'message';
    }
    
    resetOptions() {
        this.optionButtons.forEach(btn => {
            btn.style.pointerEvents = 'auto';
            btn.className = 'option-btn';
        });
    }
}

let game;

// Global functions for HTML onclick events
function startGame() {
    game.start();
}

function selectAnswer(optionIndex) {
    game.selectAnswer(optionIndex);
}

function newGame() {
    game.reset();
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    game = new SpaceMathGame();
});