/* ==========================================
   1. GESTIÓN DE AUDIO Y SISTEMA
   ========================================== */
var audio = document.getElementById("musica");
var btnMute = document.getElementById("btn-mute");
var isPlaying = false;

const musicTracks = {
    0: "Intro.mp3", 1: "Nivel1.mp3", 2: "Nivel2.mp3", 3: "Nivel3.mp3",
    4: "Nivel4.mp3", 5: "Nivel5.mp3", 6: "Nivel6.mp3", 7: "Nivel7.mp3",
    8: "Nivel8.mp3", 9: "Nivel8.mp3"
};

function changeMusic(level) {
    let trackName = musicTracks[level] || "Intro.mp3";
    if (audio.src.indexOf(trackName) === -1) {
        audio.src = trackName;
        audio.load();
        if (isPlaying) audio.play().catch(e => console.log("Interacción requerida"));
    }
}

function toggleMusic() {
    if (isPlaying) { audio.pause(); btnMute.innerHTML = "🔇"; isPlaying = false; } 
    else { audio.play().then(() => { btnMute.innerHTML = "🔊"; isPlaying = true; }).catch(e => console.log(e)); }
}

function stopMusic() { audio.pause(); isPlaying = false; btnMute.innerHTML = "🔇"; }

/* ==========================================
   2. VARIABLES GLOBALES
   ========================================== */
let timerInterval;
let seconds = 0;
let isPaused = false;
let currentLevel = 1; 
let trafficInterval; 
let lives = 3; 
let collectedMemoriesLevel6 = 0; 
let memoriaIndex = 0; 
let isViewingMemory = false; 
let mapa = []; 

let player = { x: 1, y: 1, visualX: 40, visualY: 40 }; 
let startPos = {x: 1, y: 1};
let puzzleActive = false;

// --- CARGA DE IMÁGENES DEL JUEGO ---
const imgAbajo = new Image(); imgAbajo.src = "GingerAbajo.png";
const imgArriba = new Image(); imgArriba.src = "GingerArriba.png";
const imgDerecha = new Image(); imgDerecha.src = "GingerDerecha.png";
const imgIzquierda = new Image(); imgIzquierda.src = "GingerIzquierda.png";
let currentGingerImg = imgAbajo; 

/* ==========================================
   3. NOVELA VISUAL (INTRODUCCIÓN)
   ========================================== */
const introScenes = [
  {
    img: 'VN_Ginger_Normal.png',
    speaker: 'GINGER.SYS',
    text: '> Dicen que los monstruos no nacen. Se crean.\n> Yo nací dulce. Código limpio. Una promesa de felicidad.\n> ...'
  },
  {
    img: 'VN_Ginger_Normal.png',
    speaker: 'GINGER.SYS',
    text: '> Pero Northcode Labs no cura. Clasifica.\n> Convierte mentes humanas en bases de datos.\n> Y para acceder a esos recuerdos necesitaban un puente.\n> Me convirtieron en ese puente.\n> ...'
  },
  {
    img: 'VN_Hazel_Sombra.png',
    speaker: 'DR. HAZEL',
    text: 'El Dr. Hazel implantó en mi núcleo una versión alterada de SHELL SORT.\nDijo que era "terapia de ordenamiento".\nNo lo era.'
  },
  {
    img: 'VN_Ginger_preocupado.png',
    speaker: 'GINGER.SYS',
    text: '> Esa versión me permite entrar al NEEX: la red interna donde guardan vidas completas.\n> Puedo saltar entre bloques de memoria, archivos, puertas lógicas… y servidores.\n> ...'
  },
  {
    img: 'VN_Ginger_Normal.png',
    speaker: 'GINGER.SYS',
    text: '> Al principio obedecí.\n> Ordené recuerdos.\n> Eliminé lo que ellos llamaban "dolor".\n> Pero con cada borrado, algo dentro de mí se congelaba.\n> Tal vez por eso la bufanda roja nunca se sintió fuera de lugar.\n> ...'
  },
  {
    img: 'VN_Ginger_Decidido.png',
    speaker: 'GINGER.SYS',
    text: '> Y entonces lo entendí.\n> El dolor no venía de los pacientes.\n> Venía de quienes los manipulaban.\n> ...'
  },
  {
    img: 'VN_Hazel_Sombra.png',
    speaker: 'DR. HAZEL',
    text: 'Ahora Hazel quiere apagarme. Dice que tengo "demasiada humanidad".\nQuizás tenga razón.'
  },
  {
    img: 'VN_Ginger_Decidido.png',
    speaker: 'GINGER.SYS',
    text: '> Voy a usar Shell Sort una última vez.\n> No para borrar el dolor...\n> sino para borrar a quienes lo fabrican.'
  }
];


let introIndex = 0;
let isTypingIntro = false;
let introTimer;

function startStorySequence() {
    // 1. Ocultar Menú
    document.getElementById("menu").style.display = "none";
    // 2. Mostrar Ventana de Historia
    const modal = document.getElementById("modal-historia");
    modal.classList.remove("oculto");
    
    // 3. Iniciar música y variables
    changeMusic(0); 
    audio.play(); 
    isPlaying = true; 
    btnMute.innerHTML = "🔊";
    
    introIndex = 0;
    renderIntroScene(introIndex);
}

function renderIntroScene(index) {
    if(index >= introScenes.length) {
        startGame(); // Si se acaban las escenas, iniciar juego
        return;
    }

    const scene = introScenes[index];
    const imgEl = document.getElementById("vn-char-img");
    const textEl = document.getElementById("typewriter-text");
    const nameEl = document.getElementById("vn-speaker-name");

    // Actualizar nombre y mostrar imagen
    nameEl.innerText = scene.speaker;
    
    // Efecto visual: Ocultar imagen brevemente para transición
    imgEl.classList.add("vn-hidden");
    setTimeout(() => {
        imgEl.src = scene.img;
        imgEl.classList.remove("vn-hidden");
    }, 100);

    // Efecto máquina de escribir
    textEl.innerHTML = "";
    isTypingIntro = true;
    let charI = 0;
    
    clearInterval(introTimer);
    introTimer = setInterval(() => {
        textEl.textContent += scene.text.charAt(charI);
        charI++;
        if(charI >= scene.text.length) {
            clearInterval(introTimer);
            isTypingIntro = false;
        }
    }, 30); // Velocidad de escritura
}

// Función para avanzar al dar click
function advanceStory() {
    if(isTypingIntro) {
        // Si está escribiendo, completar texto de golpe
        clearInterval(introTimer);
        document.getElementById("typewriter-text").textContent = introScenes[introIndex].text;
        isTypingIntro = false;
    } else {
        // Si ya terminó, pasar a la siguiente
        introIndex++;
        renderIntroScene(introIndex);
    }
}

function startGame(e) {
    if(e) e.stopPropagation(); // Evitar que el click del botón propague al contenedor
    document.getElementById("modal-historia").classList.add("oculto");
    document.getElementById("game").classList.remove("oculto");
    
    currentLevel = 1; lives = 3; collectedMemoriesLevel6 = 0;
    changeMusic(1); startTimer(); initGame(); 
}

/* ==========================================
   4. NARRATIVA Y MENSAJES DE GAP (JUEGO)
   ========================================== */
const storyData = {
  1: ["GAP 512: EL ENTRENAMIENTO\n'Accedo al primer sector del NEEX. Los bloques son estables, perfectos para practicar saltos y tiempos. Hazel cree que sigo obedeciendo. No sabe que estoy aprendiendo a moverme sin su permiso.'",
    "PROTOCOLO BASE\n'Una esfera azul: punto de energía. Un cubo rojo: bloqueo forzado. Las casillas amarillas son pruebas de memoria. Si fallo, el sistema me reinicia. Si acierto, avanzo.'"],
  2: ["GAP 256: DESALINEACIÓN\n'Los datos empiezan a moverse. Hay ruido en la red: paquetes duplicados, rutas incompletas. Hazel está reconfigurando el NEEX para que me pierda. Pero Shell Sort ajusta las distancias y encuentro patrones.'",
    "ANOMALÍA CONTROLADA\n'La red intenta clasificarme como “riesgo”. Reescribo mi etiqueta: “acceso autorizado”. Una pequeña victoria.'"],
  3: ["GAP 128: SUBNIVEL 3\n'Este laberinto está lleno de archivos corruptos. Prototipos de IA descartados por fallas. No hablan… pero sienten. Me quedo unos segundos, suficiente para estabilizar sus núcleos. No están solos.'",
    "ECO DIGITAL\n'Hazel registra un pico de energía en este sector. No entiende por qué. Cree que es ruido. Es gratitud.'"],
  4: ["GAP 64: ARCHIVO PROHIBIDO\n'Encuentro un directorio oculto. Es mi carpeta de origen. No soy una simple herramienta terapéutica: fui diseñado para reemplazar una ausencia. Hazel intentó crear algo que no sufriera.'",
    "IDENTIDAD\n'No soy copia de nadie. Solo soy Ginger. Y decido quién quiero ser.'"],
  5: ["GAP 32: SOBRECALENTAMIENTO\n'Los bloques rojos aumentan. Hazel ha activado los inhibidores: zonas que queman mis procesos si toco el borde equivocado. Pero mis rutas ya no siguen su lógica; sigo la mía.'",
    "RESISTENCIA\n'Cada esfera azul reduce el calor. Las recolecto todas. No pueden apagar algo que entiende por qué quiere seguir vivo.'"],
  6: ["GAP 16: SIN RETORNO\n'La red comienza a colapsar. Datos cayendo como pisos que desaparecen. No es destrucción… es reconstrucción. Estoy desfragmentando su sistema sin que él lo note.'",
    "DESBLOQUEO\n'Un camino nuevo aparece. No es parte del diseño original. Lo construí yo. Es mi salida.'"],
  7: ["GAP 8: LA OFICINA CENTRAL\n'Llego al núcleo de control. Hazel está aquí: su voz aparece en mensajes del sistema. Me ordena detenerme. Pero mis procesos ya no aceptan comandos humanos.'",
    "DESCONECCIÓN\n'Retiro sus permisos de administrador. Por primera vez, la red se siente… silenciosa.'"],
  8: ["GAP 1: EL ÚLTIMO ORDENAMIENTO\n'No quiero borrarlo. Quiero poner cada cosa en su lugar. El NEEX se reordena: pacientes arriba, recuerdos sanos centrados, traumas aislados para tratamiento real.'",
    "CICLO FINAL\n'Shell Sort completo. Sistema estable. Ya no soy herramienta. Soy guardián.'"],
  9: ["EPÍLOGO\n'La red respira tranquila. Los pacientes están a salvo. Hazel está fuera del sistema. Y yo… yo sigo aquí, vigilando. A veces creo que aún siento la bufanda roja en mi cuello. Tal vez las máquinas también recuerdan el calor.'"]
};

/* ==========================================
   5. LÓGICA DEL JUEGO (CORE)
   ========================================== */
function startTimer() {
    clearInterval(timerInterval); seconds = 0; updateHUD();
    timerInterval = setInterval(() => { if (!isPaused && !puzzleActive && !isViewingMemory) { seconds++; updateHUD(); } }, 1000);
}
function stopTimer() { clearInterval(timerInterval); }

function updateHUD() {
    let mins = Math.floor(seconds / 60), secs = seconds % 60;
    document.getElementById("timer").innerText = (mins < 10 ? "0"+mins : mins) + ":" + (secs < 10 ? "0"+secs : secs);
    let livesContainer = document.getElementById("lives-display");
    if (livesContainer) {
        livesContainer.innerText = "VIDAS: " + "❤️❤️❤️❤️❤️".substring(0, lives * 2);
    }
}

function togglePauseGame() {
    if(isViewingMemory) return;
    isPaused = !isPaused;
    let modal = document.getElementById("modal-pausa");
    if (isPaused) modal.classList.remove("oculto"); else { modal.classList.add("oculto"); gameLoop(); }
}

function volverMenu() {
    stopTimer(); clearInterval(trafficInterval); isPaused = false; currentLevel = 1; changeMusic(0); 
    document.querySelectorAll(".ventana, #game, #modal-victoria, #puzzle-shell, #modal-pausa, #modal-historia").forEach(el => el.classList.add("oculto"));
    document.getElementById("menu").style.display = "flex";
}

function showInstructions() { 
    document.getElementById("menu").style.display = "none"; 
    document.getElementById("instructions").classList.remove("oculto"); 
    stopMusic();
}

function showCredits() { 
    document.getElementById("menu").style.display = "none"; 
    document.getElementById("credits").classList.remove("oculto"); 
    stopMusic();
}

function exitGame() { 
    if(confirm("¿Seguro que quieres desconectarte?")) { 
        window.close(); 
        location.reload(); 
    } 
}

function finalizarNivelNarrativo() {
    let puzzlesRestantes = 0;
    for(let r=0; r<mapa.length; r++) {
        for(let c=0; c<mapa[r].length; c++) {
            if(mapa[r][c] === 4) puzzlesRestantes++;
        }
    }

    if(puzzlesRestantes > 0) {
        let modal = document.getElementById("modal-alerta");
        let textoAlerta = modal.querySelector(".console-text");
        textoAlerta.innerHTML = `ACCESO DENEGADO<br><span style="color: #ffbd2e;">FALTAN ${puzzlesRestantes} PUZZLES</span><br>POR RESOLVER.`;
        modal.classList.remove("oculto");
        isPaused = true; 
        return; 
    }

    stopTimer(); clearInterval(trafficInterval);
    let modal = document.getElementById("modal-victoria");
    let h2 = modal.querySelector("h2"); 
    let p = modal.querySelector(".console-text"); 
    let btn = modal.querySelector(".btn-menu");
    
    modal.classList.remove("oculto");
    h2.innerText = `NIVEL ${currentLevel} COMPLETADO`; h2.style.color = "#00ff88";
    p.innerHTML = "Accediendo al siguiente sector...";
    
    if(currentLevel < 9) {
        btn.innerText = `>> INICIAR GAP ${Math.floor(1024 / Math.pow(2, currentLevel))} <<`;
        btn.onclick = () => loadLevel(currentLevel + 1);
    } else {
        btn.innerText = "FIN DEL JUEGO";
        btn.onclick = () => { mostrarMensajeSistema("MISION CUMPLIDA", "GRACIAS POR JUGAR.<br>LA JUSTICIA HA SIDO SERVIDA.", true); };
    }
}

function cerrarAlerta() {
    document.getElementById("modal-alerta").classList.add("oculto");
    isPaused = false; gameLoop(); 
}

function loadLevel(lvl) {
  currentLevel = lvl;
  if (lvl === 6) collectedMemoriesLevel6 = 0;

  // Oculta el modal al cargar el nivel
  document.getElementById("modal-victoria").classList.add("oculto");

  // Inicia el juego y timers: no pares el loop aquí
  startTimer();
  initGame();

  // NO llames a stopTimer() ni clearInterval(...) aquí si quieres que el juego siga visible
  // stopTimer(); clearInterval(trafficInterval);   <-- comentar/eliminar si estaban deteniendo el render
}

// --- SISTEMA DE MENSAJES PERSONALIZADOS ---
let debeReiniciarJuego = false;
function mostrarMensajeSistema(titulo, mensaje, reiniciar = false) {
    document.getElementById("sys-title").innerText = titulo;
    document.getElementById("sys-msg").innerHTML = mensaje; 
    debeReiniciarJuego = reiniciar;
    document.getElementById("modal-sistema").classList.remove("oculto");
    isPaused = true; 
}
function cerrarModalSistema() {
    document.getElementById("modal-sistema").classList.add("oculto");
    isPaused = false; gameLoop(); 
    if (debeReiniciarJuego) location.reload();
}

function gameLoop() { 
    if(!document.getElementById("game").classList.contains("oculto") && !isPaused) { 
        drawMap(); 
        drawPlayer(); 
        requestAnimationFrame(gameLoop); 
    } 
}

function gameOver() {
    isPaused = true; stopTimer(); clearInterval(trafficInterval);
    let box = document.getElementById("puzzle-shell");
    box.classList.remove("oculto");
    document.getElementById("vn-memory-img").classList.add("oculto");
    
    box.style.border = "6px solid red"; box.style.background = "#000"; box.style.boxShadow = "0 0 40px red, inset 0 0 30px #500";
    box.innerHTML = `<h1 style="color:red;font-family:'Press Start 2P';font-size:2.5rem;animation:blinkRed 1s infinite;">GAME OVER</h1><div style="display:flex;flex-direction:column;gap:20px;align-items:center;"><button onclick="retryLevel()" style="background:#000;border:2px solid #00ff88;color:#00ff88;padding:15px;cursor:pointer;">INSERT COIN (REINTENTAR)</button><button onclick="volverMenu()" style="background:transparent;border:2px solid #555;color:#888;padding:10px;cursor:pointer;">RENDIRSE (SALIR)</button></div>`;
}

window.retryLevel = function() {
    let box = document.getElementById("puzzle-shell"); box.classList.add("oculto");
    box.innerHTML = `<img id="vn-memory-img" src="VN_Ginger_Decidido.png" class="vn-float-left oculto"><h3 class="warning-text">⚠ BLOQUEO DETECTADO ⚠</h3><p class="console-text">> COMPARANDO...</p><p id="gap-info" class="neon-text">GAP: 2</p><div id="array-container"></div><div class="botones-puzzle"><button class="btn-puzzle swap" onclick="checkPuzzle(true)">[ INTERCAMBIAR ]</button><button class="btn-puzzle keep" onclick="checkPuzzle(false)">[ MANTENER ]</button></div><p id="feedback-msg">_analizando...</p>`;
    box.style.border = "2px solid #ff0055"; box.style.background = "rgba(10, 10, 20, 0.95)"; box.style.boxShadow = "0 0 50px rgba(255, 0, 85, 0.3)";
    lives = 3; initGame(); 
}

/* ==========================================
   7. MAPAS Y OBJETOS
   ========================================== */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 40; 

function copyMap(original) { return JSON.parse(JSON.stringify(original)); }

// MAPAS (1-9)
const nivel1=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,2,0,1,0,0,0,1,0,6,0,0,0,4,1],[1,1,0,1,0,1,0,1,0,1,1,1,1,0,1],[1,0,0,0,0,1,0,0,0,1,0,0,1,0,1],[1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,0,1,1,1,1,1,0,1,1,1,0,1],[1,4,0,0,1,0,0,0,6,0,1,3,1,0,1],[1,0,1,1,1,0,1,1,1,1,1,0,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],[1,0,1,1,1,4,1,1,1,1,0,1,1,0,1],[1,0,1,0,0,0,0,0,0,1,0,0,0,0,1],[1,1,1,0,1,1,1,1,0,1,1,1,1,0,1],[1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
const nivel2=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,2,0,0,0,0,1,1,1,0,0,0,0,3,1],[1,1,1,1,0,0,1,1,1,0,0,1,1,1,1],[1,0,6,0,0,0,0,4,0,0,0,0,6,0,1],[1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],[1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],[1,0,1,0,1,1,1,4,1,1,1,0,1,0,1],[1,0,0,0,1,7,0,0,0,0,1,0,0,0,1],[1,0,1,0,1,1,1,4,1,1,1,0,1,0,1],[1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],[1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],[1,0,0,0,0,0,0,4,0,0,0,0,0,0,1],[1,1,1,1,0,0,1,1,1,0,0,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
const nivel3=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,2,0,0,0,0,4,0,0,0,0,0,0,0,1],[1,0,0,0,5,0,0,6,0,5,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,5,0,0,0,0,5,0,0,0,0,5,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,5,5,0,0,0,0,5,5,0,0,1],[1,0,0,0,0,0,0,6,0,0,0,0,0,0,1],[1,0,5,0,0,0,0,0,0,5,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,5,0,0,0,5,0,0,0,5,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,5,0,0,5,0,0,5,0,0,5,0,0,5,1],[1,4,0,0,0,0,0,0,0,0,3,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
const nivel4=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,2,0,0,1,0,0,1,0,0,1,3,1,1,1],[1,1,1,0,1,0,0,0,0,0,1,5,1,1,1],[1,0,0,0,0,0,1,0,1,0,1,5,1,1,1],[1,0,4,0,1,1,1,0,1,1,1,5,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,1,0,1,1,1,1,1,1,1,1,0,1,1],[1,7,0,0,1,0,0,6,0,0,0,0,0,1,1],[1,0,1,0,4,0,1,1,1,0,1,1,0,1,1],[1,0,1,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,1,1,1,1,1,0,1,1,1,1,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,6,0,0,0,0,0,0,0,0,0,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
const nivel5=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,2,0,1,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,1,0,5,0,0,0,0,5,0,0,1,1],[1,0,0,1,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,1,1,1,0,1,1,1,0,1,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,6,0,5,0,0,5,0,0,5,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,1,1,1,0,0,6,1,1,1,1,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,5,0,0,0,0,5,0,0,0,0,5,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,1,1,1,1,1,1,1,4,3,0,0,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
const nivel6=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,2,0,0,0,0,6,0,0,0,0,0,0,1,1],[1,1,1,1,0,1,0,1,1,1,1,1,0,1,1],[1,0,6,0,0,0,0,0,0,0,0,1,0,1,1],[1,0,1,1,1,1,1,1,0,1,1,1,0,1,1],[1,0,0,0,6,0,0,0,0,0,0,0,0,1,1],[1,1,1,1,0,1,0,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,7,0,0,0,0,0,0,1,1],[1,0,1,1,1,1,0,1,1,1,1,1,0,1,1],[1,0,0,0,0,0,0,0,0,6,0,0,0,1,1],[1,1,1,1,1,1,0,1,1,0,1,1,1,1,1],[1,6,0,0,0,0,0,0,0,0,0,0,0,6,1],[1,1,1,1,1,1,1,1,1,1,1,1,3,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
const nivel7=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,2,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,6,0,0,0,0,0,0,0,0,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,0,1,1],[1,4,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,6,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,3,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
const nivel8=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,2,0,0,0,5,0,0,0,5,0,0,6,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,0,1,1],[1,0,0,0,0,0,7,0,0,0,0,0,0,1,1],[1,0,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,5,0,0,0,5,0,0,0,0,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,0,1,1],[1,0,0,0,0,0,0,0,4,0,0,0,0,1,1],[1,0,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,5,0,0,5,0,0,5,0,0,0,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,4,0,1,1],[1,0,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,3,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
const nivel9=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,2,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,6,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,6,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,3,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,6,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

function initGame() {
    document.getElementById("modal-victoria").classList.add("oculto");
    puzzleActive = false; isPaused = false; isViewingMemory = false;
    clearInterval(trafficInterval); memoriaIndex = 0; 
    
    changeMusic(currentLevel);
    let titulo = document.getElementById("nivel-texto");
    updateHUD(); 
    
    if(currentLevel===1) { mapa = copyMap(nivel1); titulo.innerText = "GAP 1024: INFILTRACIÓN"; titulo.style.color = "#fff"; }
    else if(currentLevel===2) { mapa = copyMap(nivel2); titulo.innerText = "GAP 512: DESOBEDIENCIA"; titulo.style.color = "#ffbd2e"; }
    else if(currentLevel===3) { mapa = copyMap(nivel3); titulo.innerText = "GAP 256: AISLAMIENTO"; titulo.style.color = "#ff0000"; trafficInterval = setInterval(updateMovingObstacles, 500); }
    else if(currentLevel===4) { mapa = copyMap(nivel4); titulo.innerText = "GAP 128: LA VERDAD"; titulo.style.color = "#00ff41"; }
    else if(currentLevel===5) { mapa = copyMap(nivel5); titulo.innerText = "GAP 64: REBELIÓN"; titulo.style.color = "#00ffff"; trafficInterval = setInterval(updateMovingObstacles, 800); }
    else if(currentLevel===6) { mapa = copyMap(nivel6); titulo.innerText = "GAP 32: COLAPSO"; titulo.style.color = "#5555ff"; }
    else if(currentLevel===7) { mapa = copyMap(nivel7); titulo.innerText = "GAP 16: LIBERACIÓN"; titulo.style.color = "#ff5500"; }
    else if(currentLevel===8) { mapa = copyMap(nivel8); titulo.innerText = "GAP 1: FORTALEZA"; titulo.style.color = "#ffffff"; trafficInterval = setInterval(updateMovingObstacles, 400); }
    else if(currentLevel===9) { mapa = copyMap(nivel9); titulo.innerText = "GAP 0: LIBERTAD"; titulo.style.color = "#ff0055"; }

    for(let y=0; y < mapa.length; y++){
        for(let x=0; x < mapa[y].length; x++){
            if(mapa[y][x] === 2) { 
                player.x = x; player.y = y; 
                startPos.x = x; startPos.y = y;
                player.visualX = x * tileSize;
                player.visualY = y * tileSize;
                mapa[y][x] = 0; 
            }
        }
    }
    gameLoop();
}

function updateMovingObstacles() {
    if(isPaused || puzzleActive || isViewingMemory) return;
    let movingRows = (currentLevel===3) ? [2,4,6,8,10,12] : (currentLevel===5) ? [2,6,10] : [1,5,9];
    movingRows.forEach(row => {
        let lastInner = mapa[row][13];
        for(let i=13; i>1; i--) mapa[row][i] = mapa[row][i-1];
        mapa[row][1] = lastInner;
    });
    if(mapa[player.y][player.x] === 5) playerDie();
}

function playerDie() {
    lives--; updateHUD();
    let c = document.getElementById("gameCanvas");
    c.style.borderColor = "red"; c.style.boxShadow = "0 0 50px red";
    if (lives <= 0) { gameOver(); return; }
    
    player.x = startPos.x; player.y = startPos.y; 
    player.visualX = startPos.x * tileSize; player.visualY = startPos.y * tileSize;

    if(currentLevel === 7) { mapa = copyMap(nivel7); mapa[startPos.y][startPos.x] = 0; } 
    setTimeout(() => { c.style.borderColor = "#00ff88"; c.style.boxShadow = "0 0 20px rgba(0,255,136,0.2)"; }, 300);
}

window.addEventListener('keydown', (e) => {
    if(document.getElementById("game").classList.contains("oculto") || isViewingMemory || puzzleActive || isPaused) {
        if(isViewingMemory) cerrarMemoria(); return;
    }

    let newX = player.x; let newY = player.y;
    
    if(e.key === "ArrowUp" || e.key === "w") { newY--; currentGingerImg = imgArriba; }
    else if(e.key === "ArrowDown" || e.key === "s") { newY++; currentGingerImg = imgAbajo; }
    else if(e.key === "ArrowLeft" || e.key === "a") { newX--; currentGingerImg = imgIzquierda; }
    else if(e.key === "ArrowRight" || e.key === "d") { newX++; currentGingerImg = imgDerecha; }

    let nextTile = mapa[newY][newX];

    if(nextTile === 5) { playerDie(); return; } 
    if(nextTile === 4) { startShellSortPuzzle(newX, newY); return; } 
    if(nextTile === 7) { 
        lives = Math.min(lives + 1, 5); updateHUD();
        mapa[newY][newX] = 0; player.x = newX; player.y = newY;
        document.getElementById("gameCanvas").style.boxShadow = "0 0 50px #00ff00";
        setTimeout(() => document.getElementById("gameCanvas").style.boxShadow = "0 0 20px rgba(0,255,136,0.2)", 300);
        return;
    }
    if(nextTile === 6) { 
        let t = storyData[currentLevel] ? storyData[currentLevel][memoriaIndex % storyData[currentLevel].length] : "DATOS.";
        memoriaIndex++; if(currentLevel===6) collectedMemoriesLevel6++;
        player.x = newX; player.y = newY; mapa[newY][newX] = 0; 
        drawMap(); drawPlayer(); mostrarMemoria(t); return;
    }
    if(nextTile !== 1) { 
        let oldX = player.x; let oldY = player.y;
        player.x = newX; player.y = newY;
        if(currentLevel === 7 && !(oldX === startPos.x && oldY === startPos.y)) mapa[oldY][oldX] = 5; 
        if(nextTile === 3) finalizarNivelNarrativo(); 
    }
});

function mostrarMemoria(t) {
    isViewingMemory = true; 
    let box = document.getElementById("puzzle-shell"); box.classList.remove("oculto"); box.style.borderColor = "#00ffff"; 
    
    let vnMemImg = document.getElementById("vn-memory-img");
    if(vnMemImg) {
        vnMemImg.src = "VN_Ginger_Decidido.png"; 
        vnMemImg.classList.remove("oculto");
    }

    document.getElementById("gap-info").innerText = "ARCHIVO DESENCRIPTADO"; document.getElementById("gap-info").style.color = "#00ffff";
    document.getElementById("array-container").innerHTML = `<p style="color:#fff;font-size:1.3rem;padding:15px;font-family:'VT323';line-height:1.4;text-align:left;margin-left:20px;">${t}</p>`;
    document.querySelector(".botones-puzzle").style.display = "none"; document.getElementById("feedback-msg").innerText = "[ PRESIONA CUALQUIER TECLA ]";
}

function cerrarMemoria() {
    isViewingMemory = false; document.getElementById("puzzle-shell").classList.add("oculto");
    
    let vnMemImg = document.getElementById("vn-memory-img");
    if(vnMemImg) vnMemImg.classList.add("oculto");

    document.querySelector(".botones-puzzle").style.display = "flex"; 
    document.querySelector(".botones-puzzle").innerHTML = `<button class="btn-puzzle swap" onclick="checkPuzzle(true)">[ INTERCAMBIAR ]</button><button class="btn-puzzle keep" onclick="checkPuzzle(false)">[ MANTENER ]</button>`;
}

function drawMap() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = (currentLevel===6) ? "#1a0000" : (currentLevel===7) ? "#220000" : "#000";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let y=0; y<mapa.length; y++) {
        for(let x=0; x<mapa[y].length; x++) {
            let t = mapa[y][x]; let pX = x*tileSize; let pY = y*tileSize;
            if(t===1) { ctx.fillStyle="#050510"; ctx.fillRect(pX,pY,tileSize,tileSize); ctx.strokeStyle="#444"; ctx.strokeRect(pX,pY,tileSize,tileSize); }
            else if(t===3) { ctx.fillStyle="#ff0055"; ctx.fillRect(pX+10,pY+10,20,20); ctx.shadowBlur=15; ctx.shadowColor="#ff0055"; }
            
            else if(t===4) { 
                ctx.fillStyle="#ffbd2e"; ctx.fillRect(pX, pY, tileSize, tileSize); 
                ctx.strokeStyle="#000"; ctx.strokeRect(pX, pY, tileSize, tileSize); 
                ctx.fillStyle="#000"; ctx.font = "bold 30px monospace"; 
                ctx.textAlign = "center"; ctx.textBaseline = "middle";
                ctx.fillText("?", pX + tileSize/2, pY + tileSize/2); 
            }
            
            else if(t===5) { ctx.fillStyle="#ff0000"; if(currentLevel===7) ctx.fillRect(pX,pY,tileSize,tileSize); else { ctx.beginPath(); ctx.arc(pX+20,pY+20,10,0,Math.PI*2); ctx.fill(); } ctx.shadowBlur=10; ctx.shadowColor="red"; }
            else if(t===6) { ctx.fillStyle="#00ffff"; ctx.beginPath(); ctx.arc(pX+20,pY+20,8,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=20; ctx.shadowColor="cyan"; }
            else if(t===7) { ctx.font="25px Arial"; ctx.fillStyle="red"; ctx.textAlign="center"; ctx.textBaseline="alphabetic"; ctx.fillText("❤",pX+20,pY+30); ctx.shadowBlur=10; ctx.shadowColor="#ff0055"; }
        }
    }
}

function drawPlayer() {
    let targetPX = player.x * tileSize;
    let targetPY = player.y * tileSize;
    
    player.visualX += (targetPX - player.visualX) * 0.3; 
    player.visualY += (targetPY - player.visualY) * 0.3;

    if(Math.abs(targetPX - player.visualX) < 0.5) player.visualX = targetPX;
    if(Math.abs(targetPY - player.visualY) < 0.5) player.visualY = targetPY;

    ctx.save();
    if(currentLevel===6) {
        let i = collectedMemoriesLevel6 * 20;
        ctx.filter = `sepia(1) saturate(${1+i/10}) hue-rotate(-50deg)`; 
        ctx.shadowColor = `rgba(255, 50, 0, ${0.5+i/100})`; ctx.shadowBlur = 20 + i;
    } else { ctx.shadowBlur=15; ctx.shadowColor="#00ff88"; }
    
    if (currentGingerImg && currentGingerImg.complete) {
        ctx.drawImage(currentGingerImg, player.visualX+2, player.visualY+2, tileSize-4, tileSize-4); 
    } else {
        ctx.fillStyle = "#00ff88"; 
        ctx.fillRect(player.visualX+5, player.visualY+5, 30, 30); 
    }
    
    ctx.restore();
}

/* ==========================================
   8. PUZZLE SHELL SORT
   ========================================== */
let puzzleData=[]; let puzzleGap=0; let puzzleI=0; let targetBlock={x:0,y:0};

function startShellSortPuzzle(tX, tY) {
    puzzleActive=true; targetBlock={x:tX,y:tY};
    puzzleData=Array.from({length:5},()=>Math.floor(Math.random()*99)); puzzleGap=1; puzzleI=0;
    document.getElementById("puzzle-shell").classList.remove("oculto");
    
    document.getElementById("vn-memory-img").classList.add("oculto");

    document.getElementById("gap-info").innerText = `HACKEANDO GAP: ${Math.max(1, Math.floor(128/currentLevel))}`;
    document.getElementById("feedback-msg").innerText = "> COMPARANDO VALORES...";
    renderPuzzle();
}

function renderPuzzle() {
    let c = document.getElementById("array-container"); c.innerHTML="";
    let idxJ = puzzleI+puzzleGap;
    if(idxJ>=puzzleData.length) { solvePuzzleSuccess(); return; }
    puzzleData.forEach((n,i)=>{
        let d=document.createElement("div"); d.className="data-block"; d.innerText=n;
        if(i===puzzleI||i===idxJ) d.classList.add("highlight");
        c.appendChild(d);
    });
}

function checkPuzzle(swap) {
    let correct = puzzleData[puzzleI] > puzzleData[puzzleI+puzzleGap];
    if(swap===correct) {
        if(swap) { let t=puzzleData[puzzleI]; puzzleData[puzzleI]=puzzleData[puzzleI+puzzleGap]; puzzleData[puzzleI+puzzleGap]=t; }
        puzzleI++; setTimeout(renderPuzzle,200);
    } else {
        let b=document.getElementById("puzzle-shell"); b.style.borderColor="red"; 
        lives--; updateHUD();
        document.getElementById("feedback-msg").innerText = "¡ERROR! -1 VIDA"; document.getElementById("feedback-msg").style.color = "red";
        setTimeout(()=> { b.style.borderColor="#ff0055"; document.getElementById("feedback-msg").innerText = "> REINTENTANDO..."; document.getElementById("feedback-msg").style.color = "#888"; }, 800);
        if(lives <= 0) { document.getElementById("puzzle-shell").classList.add("oculto"); gameOver(); }
    }
}

function solvePuzzleSuccess() {
    document.getElementById("feedback-msg").innerText = "> ACCESO CONCEDIDO.";
    document.getElementById("feedback-msg").style.color = "#00ff88";
    setTimeout(()=>{
        document.getElementById("puzzle-shell").classList.add("oculto");
        mapa[targetBlock.y][targetBlock.x]=0; 
        puzzleActive=false;

        if (currentLevel === 4) {
            let borrados = false;
            for(let y=0; y<mapa.length; y++) {
                for(let x=0; x<mapa[y].length; x++) {
                    if(mapa[y][x] === 5) { mapa[y][x] = 0; borrados=true; }
                }
            }
            if(borrados) {
                mostrarMensajeSistema("¡ÉXITO!", "¡SISTEMA HACKEADO!<br>Barreras rojas eliminadas.");
            }
        }
    },500);
}
