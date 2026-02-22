let count = 0;

function updateDisplay() {
    document.getElementById('counter').textContent = count;
}

document.getElementById('increment-btn').addEventListener('click', function () {
    count++;
    updateDisplay();
});

document.getElementById('decrement-btn').addEventListener('click', function () {
    count--;
    updateDisplay();
});

document.getElementById('reset-btn').addEventListener('click', function () {
    count = 0;
    updateDisplay();
});
