let count = 0;

const counter = document.getElementById('counter') as HTMLDivElement;
const incrementBtn = document.getElementById('increment-btn') as HTMLButtonElement;
const decrementBtn = document.getElementById('decrement-btn') as HTMLButtonElement;
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;

function updateDisplay(): void {
    counter.textContent = String(count);
}

incrementBtn.addEventListener('click', () => {
    count++;
    updateDisplay();
});

decrementBtn.addEventListener('click', () => {
    count--;
    updateDisplay();
});

resetBtn.addEventListener('click', () => {
    count = 0;
    updateDisplay();
});
