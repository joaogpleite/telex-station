# Telex Station — Telex-style web terminal

Este pequeno projecto cria uma interface web que simula um terminal/telex (estética de impressão em papel). Cada tecla pressionada é "impressa" no papel e dispara o som sound_telex.m4a, reproduzindo o efeito do telex.

## Estrutura
- index.html — página principal
- style.css — estilos da "folha", tipografia e animações
- script.js — captura de teclado, impressão de caracteres e reprodução de som
- sound_telex.m4a — som tocado a cada caractere (coloque-o na mesma pasta)

## Recursos
- Impressão de caracteres (teclas normais) em maiúsculas por padrão (imitando telex)
- Enter cria nova linha; Backspace apaga; Esc limpa a folha
- Botão "Load sample" carrega uma mensagem de exemplo (mensagem do telex da imagem)
- Botão mute liga/desliga o som
- Animação rápida por caractere para simular "batida" da impressora

## Como usar
1. Coloque todos os arquivos na mesma pasta (incluindo sound_telex.m4a).
2. Abra index.html em um navegador (Chrome/Firefox modernos).
3. Clique na área do papel ou apenas pressione qualquer tecla — os caracteres serão “impressos” e o som será tocado (se não estiver muted).
4. Use Load sample para carregar a mensagem de exemplo.

## Notas técnicas
- O áudio é reproduzido via API Audio do HTML5. Alguns navegadores exigem interação do usuário antes de permitir som; clique no documento para habilitar.
- Se quiser que os caracteres fiquem exatamente em maiúsculas e com espaçamento estilo telex, ajuste as regras CSS em style.css.
- Sinta-se livre para alterar a mensagem de exemplo em script.js.

## Licença
MIT — sinta-se livre para adaptar e usar.
