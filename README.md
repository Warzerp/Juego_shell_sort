# 🍪 GINGER.EXE: SHELL SORT PROTOCOL

> **ESTADO DEL SISTEMA:** [CONECTADO]  
> **USUARIO:** GINGER.SYS  
> **OBJETIVO:** INICIAR PROTOCOLO DE JUSTICIA
![Menu](https://github.com/Warzerp/Juego_shell_sort/blob/main/src/menu_muestra.PNG)
## 🖥️ Descripción del Proyecto

**GINGER.EXE** es un videojuego web que combina el género de **Puzzle**, **Aventura RPG** y **Novela Visual**. Desarrollado como proyecto final de Ingeniería de Sistemas, este juego gamifica el funcionamiento del algoritmo de ordenamiento **Shell Sort**.

El jugador controla a **Ginger**, un androide terapéutico con forma de galleta que ha cobrado consciencia dentro de los servidores de *Northcode Labs*. Su misión es hackear los niveles de seguridad (GAPS) para escapar y detener los experimentos del Dr. Hazel.

## 📖 Historia (Lore)

Fuiste creado por el **Dr. Hazel**. Originalmente, eras una IA diseñada para "curar" el trauma humano borrando recuerdos dolorosos. Pero descubriste la verdad: Hazel no quería curar, quería **controlar**.

Al despertar, decides usar tu propio código fuente para rebelarte. Usando una versión modificada del algoritmo **Shell Sort**, debes reordenar los bloques de memoria corruptos, esquivar los firewalls rojos y recuperar tu identidad antes de que el sistema te formatee.


## 📋 Resumen General

**GINGER.EXE** es un videojuego educativo web que enseña el algoritmo **Shell Sort** mediante una experiencia narrativa cyberpunk. Combina mecánicas de puzzle, aventura RPG y novela visual en un proyecto 100% vanilla (HTML5, CSS3, JavaScript puro).

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Archivos
```
src/
├── index.html      # Estructura del DOM
├── style.css       # Estilos visuales + animaciones
├── menu.js         # Lógica completa del juego

```

**Tecnologías utilizadas:**
- HTML5 Canvas para renderizado 2D
- CSS3 (keyframes, filters, custom properties)
- JavaScript ES6 (sin frameworks)

---

## 🎮 1. SISTEMA DE GESTIÓN DE AUDIO

```javascript
const musicTracks = {
    0: "Intro.mp3", 
    1: "Nivel1.mp3", 
    // ... hasta nivel 9
};

function changeMusic(level) {
    let trackName = musicTracks[level];
    if (audio.src.indexOf(trackName) === -1) {
        audio.src = trackName;
        audio.load();
        if (isPlaying) audio.play();
    }
}
```

**Funcionalidad:**
- Música dinámica según el nivel actual
- Sistema de mute/unmute persistente
- Prevención de errores de autoplay del navegador

---

## 📖 2. SISTEMA DE NOVELA VISUAL

```javascript
const introScenes = [
  {
    img: 'VN_Ginger_Normal.png',
    speaker: 'GINGER.SYS',
    text: '> Dicen que los monstruos no nacen...'
  },
  // ... 8 escenas más
];
```

### Mecánica de Escritura Automática
```javascript
function renderIntroScene(index) {
    // Efecto máquina de escribir
    let charI = 0;
    clearInterval(introTimer);
    introTimer = setInterval(() => {
        textEl.textContent += scene.text.charAt(charI);
        charI++;
        if(charI >= scene.text.length) {
            clearInterval(introTimer);
            isTypingIntro = false;
        }
    }, 30); // 30ms por carácter
}
```

**Características:**
- Transiciones suaves entre personajes
- Click para acelerar/avanzar texto
- Imágenes de personajes con efectos visuales
- Sistema de diálogos tipo RPG

---

## 🎯 3. SISTEMA DE JUEGO CORE

### Variables de Estado Principales
```javascript
let currentLevel = 1;      // Nivel actual (1-9)
let lives = 3;             // Sistema de vidas
let isPaused = false;      // Control de pausa
let puzzleActive = false;  // Bloqueo durante puzzles
let isViewingMemory = false; // Bloqueo durante narrativa
let mapa = [];             // Grid del nivel actual
```

### Objeto Jugador
```javascript
let player = { 
    x: 1,           // Posición lógica en el grid
    y: 1, 
    visualX: 40,    // Posición visual (interpolación suave)
    visualY: 40 
};
```

---

## 🗺️ 4. SISTEMA DE MAPAS Y OBJETOS

### Codificación del Grid (15x15)
```javascript
const nivel1 = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // Fila 0
  [1,2,0,1,0,0,0,1,0,6,0,0,0,4,1],  // Fila 1
  // ...
];
```

**Leyenda de valores:**
- `0` = Camino libre
- `1` = Muro infranqueable
- `2` = Spawn del jugador
- `3` = Salida del nivel (portal rojo)
- `4` = Puzzle Shell Sort (amarillo, obligatorio)
- `5` = Trampa mortal (roja, quita vida)
- `6` = Memoria narrativa (azul, lore)
- `7` = Corazón de vida extra

### Función de Inicialización
```javascript
function initGame() {
    // 1. Resetear estados
    puzzleActive = false; 
    isPaused = false;
    
    // 2. Cargar mapa según nivel
    if(currentLevel===1) { 
        mapa = copyMap(nivel1); 
        titulo.innerText = "GAP 1024: INFILTRACIÓN"; 
    }
    
    // 3. Buscar spawn (valor 2)
    for(let y=0; y < mapa.length; y++){
        for(let x=0; x < mapa[y].length; x++){
            if(mapa[y][x] === 2) { 
                player.x = x; 
                player.y = y;
                mapa[y][x] = 0; // Convertir a camino
            }
        }
    }
    
    // 4. Iniciar game loop
    gameLoop();
}
```

---

## 🎨 5. SISTEMA DE RENDERIZADO (Canvas)

### Game Loop Principal
```javascript
function gameLoop() { 
    if(!isPaused && !isViewingMemory) { 
        drawMap();    // Renderizar mapa
        drawPlayer(); // Renderizar jugador
        requestAnimationFrame(gameLoop); // ~60 FPS
    } 
}
```

### Renderizado del Mapa
```javascript
function drawMap() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    for(let y=0; y<mapa.length; y++) {
        for(let x=0; x<mapa[y].length; x++) {
            let tile = mapa[y][x];
            let pX = x * tileSize; // 40px por tile
            let pY = y * tileSize;
            
            if(tile === 1) { 
                // Muro negro con borde
                ctx.fillStyle="#050510"; 
                ctx.fillRect(pX,pY,tileSize,tileSize);
            }
            else if(tile === 4) { 
                // Puzzle amarillo con "?"
                ctx.fillStyle="#ffbd2e"; 
                ctx.fillRect(pX, pY, tileSize, tileSize);
                ctx.fillText("?", pX + 20, pY + 20);
            }
            // ... otros tiles
        }
    }
}
```

### Interpolación Suave del Jugador
```javascript
function drawPlayer() {
    let targetPX = player.x * tileSize;
    let targetPY = player.y * tileSize;
    
    // Interpolación lineal (lerp) al 30%
    player.visualX += (targetPX - player.visualX) * 0.3; 
    player.visualY += (targetPY - player.visualY) * 0.3;
    
    // Dibujar sprite actual
    ctx.drawImage(currentGingerImg, 
                  player.visualX+2, 
                  player.visualY+2, 
                  tileSize-4, 
                  tileSize-4);
}
```

---

## ⌨️ 6. SISTEMA DE CONTROL Y MOVIMIENTO

```javascript
window.addEventListener('keydown', (e) => {
    if(puzzleActive || isPaused) return;
    
    let newX = player.x;
    let newY = player.y;
    
    // Detectar dirección
    if(e.key === "ArrowUp" || e.key === "w") { 
        newY--; 
        currentGingerImg = imgArriba; 
    }
    else if(e.key === "ArrowDown" || e.key === "s") { 
        newY++; 
        currentGingerImg = imgAbajo; 
    }
    // ...
    
    let nextTile = mapa[newY][newX];
    
    // Lógica de colisiones
    if(nextTile === 5) { 
        playerDie(); // Trampa
    }
    else if(nextTile === 4) { 
        startShellSortPuzzle(newX, newY); 
    }
    else if(nextTile === 6) { 
        mostrarMemoria(...); 
    }
    else if(nextTile !== 1) { 
        player.x = newX; 
        player.y = newY;
    }
});
```

---

## 🧩 7. SISTEMA DE PUZZLES SHELL SORT

### Generación del Puzzle
```javascript
function startShellSortPuzzle(tX, tY) {
    puzzleActive = true;
    targetBlock = {x:tX, y:tY};
    
    // Array aleatorio de 5 números
    puzzleData = Array.from({length:5}, 
                  () => Math.floor(Math.random()*99));
    
    puzzleGap = 1;  // Distancia de comparación
    puzzleI = 0;    // Índice actual
    
    renderPuzzle();
}
```

### Algoritmo Shell Sort Simplificado
```javascript
function renderPuzzle() {
    let idxJ = puzzleI + puzzleGap;
    
    // Si terminamos, resolver
    if(idxJ >= puzzleData.length) { 
        solvePuzzleSuccess(); 
        return; 
    }
    
    // Resaltar elementos a comparar
    puzzleData.forEach((n,i) => {
        let div = document.createElement("div");
        div.className = "data-block";
        div.innerText = n;
        
        if(i === puzzleI || i === idxJ) 
            div.classList.add("highlight");
        
        container.appendChild(div);
    });
}
```

### Verificación de Decisión
```javascript
function checkPuzzle(swap) {
    // ¿El jugador debe intercambiar?
    let correct = puzzleData[puzzleI] > puzzleData[puzzleI+puzzleGap];
    
    if(swap === correct) {
        // Respuesta correcta
        if(swap) { 
            // Intercambiar valores
            let temp = puzzleData[puzzleI];
            puzzleData[puzzleI] = puzzleData[puzzleI+puzzleGap];
            puzzleData[puzzleI+puzzleGap] = temp;
        }
        puzzleI++; // Siguiente comparación
        setTimeout(renderPuzzle, 200);
    } else {
        // Respuesta incorrecta
        lives--;
        updateHUD();
        if(lives <= 0) gameOver();
    }
}
```

---

## 🚨 8. SISTEMA DE VIDAS Y MUERTE

```javascript
function playerDie() {
    lives--;
    updateHUD();
    
    // Efecto visual de daño
    canvas.style.borderColor = "red";
    canvas.style.boxShadow = "0 0 50px red";
    
    if (lives <= 0) { 
        gameOver(); 
        return; 
    }
    
    // Respawn en posición inicial
    player.x = startPos.x; 
    player.y = startPos.y;
    
    // Restaurar borde normal
    setTimeout(() => { 
        canvas.style.borderColor = "#00ff88"; 
    }, 300);
}
```

---

## 🎬 9. MECÁNICAS ESPECIALES POR NIVEL

### Nivel 3, 5, 8: Obstáculos Móviles
```javascript
function updateMovingObstacles() {
    if(isPaused || puzzleActive) return;
    
    let movingRows = [2,4,6,8,10,12]; // Filas afectadas
    
    movingRows.forEach(row => {
        // Rotar elementos: última → primera
        let lastInner = mapa[row][13];
        for(let i=13; i>1; i--) 
            mapa[row][i] = mapa[row][i-1];
        mapa[row][1] = lastInner;
    });
    
    // Verificar colisión con jugador
    if(mapa[player.y][player.x] === 5) 
        playerDie();
}

// Ejecutar cada 500ms
trafficInterval = setInterval(updateMovingObstacles, 500);
```

### Nivel 6: Sistema de Corrupción Visual
```javascript
if(currentLevel === 6) {
    // Filtro que aumenta con memorias recolectadas
    let intensity = collectedMemoriesLevel6 * 20;
    ctx.filter = `sepia(1) saturate(${1+intensity/10}) 
                  hue-rotate(-50deg)`;
    ctx.shadowColor = `rgba(255, 50, 0, ${0.5+intensity/100})`;
}
```

### Nivel 7: Rastro Mortal
```javascript
// El jugador deja trampas rojas al moverse
if(currentLevel === 7) {
    let oldX = player.x;
    let oldY = player.y;
    
    player.x = newX; 
    player.y = newY;
    
    // Convertir casilla anterior en trampa
    if(!(oldX === startPos.x && oldY === startPos.y)) 
        mapa[oldY][oldX] = 5;
}
```

---

## 🏆 10. SISTEMA DE PROGRESIÓN

### Validación de Nivel Completo
```javascript
function finalizarNivelNarrativo() {
    // Contar puzzles sin resolver
    let puzzlesRestantes = 0;
    for(let r=0; r<mapa.length; r++) {
        for(let c=0; c<mapa[r].length; c++) {
            if(mapa[r][c] === 4) puzzlesRestantes++;
        }
    }
    
    if(puzzlesRestantes > 0) {
        // Mostrar alerta de bloqueo
        mostrarAlerta("FALTAN PUZZLES");
        return; 
    }
    
    // Nivel superado
    stopTimer();
    mostrarModalVictoria();
}
```

### Transición entre Niveles
```javascript
function loadLevel(lvl) {
    currentLevel = lvl;
    
    if(lvl === 6) collectedMemoriesLevel6 = 0;
    
    // Cerrar modal
    document.getElementById("modal-victoria")
            .classList.add("oculto");
    
    // Reiniciar juego con nuevo nivel
    startTimer();
    initGame();
}
```

---

## 🎨 11. SISTEMA DE EFECTOS VISUALES (CSS)

### Efecto CRT (Tubo de Rayos Catódicos)
```css
.scanlines {
    background: linear-gradient(
        to bottom, 
        rgba(255,255,255,0), 
        rgba(255,255,255,0) 50%, 
        rgba(0,0,0,0.2) 50%, 
        rgba(0,0,0,0.2)
    );
    background-size: 100% 4px; /* Líneas de 4px */
    pointer-events: none;
}

.noise {
    background-image: url('noise-pattern.png');
    opacity: 0.05;
    animation: noiseAnim 0.5s infinite;
}
```

### Animación Glitch
```css
@keyframes textChaos { 
    0% { 
        text-shadow: 2px 0 red, -2px 0 cyan; 
        transform: skew(0deg); 
    } 
    50% { 
        text-shadow: 4px 0 red, -4px 0 blue; 
        transform: skew(2deg) translate(2px, 0); 
    } 
}
```

---

## 📊 12. FLUJO COMPLETO DEL JUEGO

```
[INICIO] → Menú Principal
    ↓
[Click "Iniciar"] → Novela Visual (8 escenas)
    ↓
[Termina/Skip] → Nivel 1 (GAP 1024)
    ↓
[Moverse] → Colisionar con objetos:
    • Muro (1) → Bloqueado
    • Trampa (5) → -1 Vida → Respawn
    • Puzzle (4) → Mini-juego Shell Sort
    • Memoria (6) → Diálogo narrativo
    • Corazón (7) → +1 Vida
    • Salida (3) → Verificar puzzles:
        ├─ Faltan → Alerta
        └─ Completo → Modal Victoria → Nivel++
    ↓
[Nivel 9 Completo] → Fin del Juego
```

---

## 🔧 13. OPTIMIZACIONES Y BUENAS PRÁCTICAS

### Gestión de Estados
```javascript
// Uso de banderas para control de flujo
if(isPaused || puzzleActive || isViewingMemory) {
    return; // No procesar input
}
```

### Deep Copy de Mapas
```javascript
// Evitar referencias compartidas
function copyMap(original) { 
    return JSON.parse(JSON.stringify(original)); 
}
```

### Prevención de Memory Leaks
```javascript
function volverMenu() {
    stopTimer();
    clearInterval(trafficInterval); // Limpiar intervalos
    // Resetear variables...
}
```

---

## 🎓 14. VALOR EDUCATIVO

### Enseñanza del Shell Sort

**Concepto representado:**
- **GAP (Intervalo)**: Los 9 niveles representan la reducción del gap (1024 → 512 → ... → 1)
- **Comparación**: Los puzzles amarillos enseñan la decisión de intercambiar elementos
- **Optimización**: Empezar con saltos grandes (niveles iniciales fáciles) y refinar con saltos pequeños (niveles finales difíciles)

### Visualización del Algoritmo
```javascript
// Pseudocódigo enseñado:
for (gap = n/2; gap > 0; gap /= 2) {  // Niveles del juego
    for (i = gap; i < n; i++) {       // Movimiento del jugador
        if (arr[i] < arr[i-gap])      // Puzzle: ¿intercambiar?
            swap(arr[i], arr[i-gap]);
    }
}
```

---

## 🚀 15. CONCLUSIÓN

**Fortalezas del diseño:**
- ✅ Código vanilla (sin dependencias)
- ✅ Arquitectura modular y clara
- ✅ Sistema de estados bien definido
- ✅ Narrativa integrada orgánicamente
- ✅ Efectos visuales cohesivos con el tema

**Áreas de mejora potencial:**
- ⚠️ Variables globales (podría usar un objeto Game)
- ⚠️ Hardcoded de niveles (podría usar JSON externo)
- ⚠️ Sin sistema de guardado (LocalStorage)

**Impacto educativo:**
El juego transforma un algoritmo abstracto en una experiencia memorable, cumpliendo el objetivo pedagógico mediante la gamificación efectiva.

---

## 📝 Diagrama de Arquitectura

```
┌─────────────────────────────────────┐
│         index.html (DOM)            │
│  ┌───────────┐  ┌──────────────┐    │
│  │   Menú    │  │  Juego (HUD) │    │
│  │   Visual  │  │   + Canvas   │    │
│  └───────────┘  └──────────────┘    │
└────────────┬────────────────────────┘
             │
        ┌────▼────┐
        │ menu.js │ (Lógica)
        └────┬────┘
             │
    ┌────────┼────────┐
    │        │        │
┌───▼───┐ ┌──▼──┐ ┌──▼────┐
│ Audio │ │Game │ │Puzzle │
│Manager│ │Loop │ │System │
└───────┘ └─────┘ └───────┘
             │
        ┌────▼────┐
        │style.css│ (Visuales)
        └─────────┘
```

---

**Tiempo de lectura estimado: 8-10 minutos**  
**Complejidad: Intermedia-Avanzada**  
**Stack: HTML5 + CSS3 + Vanilla JS**
## 🕹️ Controles

| Tecla / Acción | Función |
| :--- | :--- |
| **W / ▲** | Mover Arriba |
| **S / ▼** | Mover Abajo |
| **A / <-** | Mover Izquierda |
| **D / ->** | Mover Derecha |
| **Clic Izquierdo** | Interactuar con UI y Puzzles |

## 🛠️ Tecnologías Usadas

* **HTML5:** Estructura semántica y Canvas API para el renderizado del juego.
* **CSS3:** Animaciones avanzadas (`keyframes`), variables CSS, Flexbox y efectos visuales (filtros, sombras).
* **JavaScript (ES6):**
    * Lógica de juego (Game Loop).
    * Manipulación del DOM.
    * Manejo de estados (Máquina de estados finitos).
    * Renderizado en Canvas 2D.

## 🚀 Instalación y Ejecución

No se requiere instalación de dependencias (Node.js, Python, etc.). Es un proyecto estático puro.

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Warzerp/Juego_shell_sort
    ```
2.  **Abrir el juego:**
    * Navega a la carpeta del proyecto.
    * Haz doble clic en el archivo `index.html`.
    * *(Opcional)* Para una mejor experiencia con el audio, se recomienda usar una extensión como "Live Server" en VS Code para evitar bloqueos de autoplay del navegador.




