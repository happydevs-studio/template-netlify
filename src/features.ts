const input = document.getElementById('text-input') as HTMLInputElement;
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
const output = document.getElementById('output') as HTMLDivElement;

submitBtn.addEventListener('click', () => {
    const name = input.value;
    if (name.trim()) {
        output.textContent = `Feature '${name}' is enabled!`;
    } else {
        output.textContent = 'Please enter a feature name.';
    }
});
