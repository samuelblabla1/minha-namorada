# Surpresa romântica 💜

Site feito com HTML, CSS e JavaScript puro — sem frameworks, sem bibliotecas externas. Funciona localmente e no GitHub Pages.

## Antes de publicar: adicione seus arquivos pessoais

O código está pronto, mas os arquivos de mídia abaixo são seus e precisam ser colocados na mesma pasta do `index.html`, com **exatamente estes nomes**:

| Arquivo | O que é |
|---|---|
| `musica.mp3` | A música que toca na Tela 2 e na Tela 13 (começa automaticamente no segundo 48) |
| `foto1.jpg` | "Meu sorriso favorito 💜" |
| `foto2.jpg` | "A menina que mudou minha vida 💜" |
| `foto3.jpg` | "Meu lugar favorito ❤️" |
| `foto4.jpg` | "Nós 💜" |
| `foto_especial.jpg` | Foto da Tela 13, o final secreto |
| `video_nosso.mp4` | Vídeo de vocês dois (Tela 8) |
| `video_bê.mp4` | Seu vídeo pessoal pra ela (Tela 9) |

Se algum nome de arquivo tiver acento ou caractere especial (como `video_bê.mp4`) e você tiver problema ao subir pro GitHub Pages, é mais seguro renomear para `video_be.mp4` — só lembre de atualizar a mesma referência dentro do `index.html` (procure por `src="video_bê.mp4"`).

## Onde editar a carta

Abra `index.html`, procure por `ESPAÇO DA CARTA` (Tela 10) e substitua pelo texto da carta. Quebras de linha digitadas ali são respeitadas automaticamente no visual.

## Conferir antes de enviar

1. Abra o `index.html` direto no navegador (duplo clique) e teste o fluxo completo.
2. Confirme que a senha `15092025` funciona na Tela 1.
3. Confirme que a música existe e começa no segundo 48 — se a música for mais curta que isso, ajuste `MUSICA_INICIO_SEGUNDOS` no início do `script.js`.
4. Confirme a data de início do relacionamento em `script.js`, na constante `DATA_INICIO` (já está configurada para 15/09/2025).
5. Teste no celular também: a maioria dos navegadores bloqueia áudio automático até o primeiro toque na tela — o script já trata isso, mas vale confirmar.

## Publicar no GitHub Pages

1. Crie um repositório novo no GitHub.
2. Envie todos os arquivos desta pasta (incluindo as mídias) para o repositório.
3. Em **Settings → Pages**, selecione a branch principal e salve.
4. O link gerado é o que você manda pra ela. 💜
