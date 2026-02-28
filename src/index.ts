const btn = document.getElementById('interactive-btn') as HTMLButtonElement;
const message = document.getElementById('message') as HTMLDivElement;

btn.addEventListener('click', () => {
    message.textContent = '✅ Repo is healthy!';
});
