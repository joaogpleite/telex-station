document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal');
    const commandLine = document.getElementById('command-line');
    const telexSound = document.getElementById('telex-sound');

    const playSound = () => {
        telexSound.currentTime = 0;
        telexSound.play().catch(error => {
            // A reprodução automática pode ser bloqueada pelo navegador
            // O som será reproduzido na próxima interação do usuário
        });
    };

    // Toca o som ao clicar no terminal
    terminal.addEventListener('click', () => {
        commandLine.focus();
        playSound();
    });

    // Toca o som a cada tecla pressionada
    document.addEventListener('keydown', (event) => {
        playSound();
    });
});```
