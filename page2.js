document.getElementById('submit-btn').addEventListener('click', function () {
    const name = document.getElementById('text-input').value;
    const output = document.getElementById('output');
    if (name.trim()) {
        output.textContent = 'Hello, ' + name + '! Welcome to Page 2!';
    } else {
        output.textContent = 'Please enter your name.';
    }
});
