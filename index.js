let values;
let max;
let index;
let read;
let debug = 0;
let in_run = 0;

const pin_description = {
    "Description ?":"Le brainfuck est un langage exotique inventé par Urban Müller en 1993.\n\
    Le but à été de créer un langage de programmation le plus simpliste possible tout en restant turing complet.\n\
    Le langage est réputé complexe car purement logique sans simplification pour le développeur.\n\
    Il est aujourd'hui surtout utilisé dans la recherche en informatique.",
    "Instructions ?":"Il y a 8 instructions en brainfuck, et une ajoutée par le débugger :\n\
    - La flèche droite '>' : Se déplace d'une case vers la droite.\n\
    - La flèche gauche '<' : Se déplace d'une case vers la gauche.\n\
    - Le plus '+' : Ajoute 1 à la case actuelle, si ajout à 255, passe à 0.\n\
    - Le moins '-' : Enlève 1 à la case actuelle, si soustraction à 0, passe à 255.\n\
    - Le point '.' : Affiche en sortie la lettre ascii correspondante à la valeur sur la case actuelle.\n\
    - La virgule ',' : Prend un caractère en entrée et met dans la case actuelle sa valeur ascii.\n\
    - Le crochet gauche '[' : Commence une boucle, seulement si la case n'est pas à 0, sinon va directement à la fin de la boucle\n\
    - Le crochet droit ']' : Fini la boucle, si la valeur sur la case actuelle n'est pas à 0, retourne au début de la boucle.\n\
    - Le dièse '#' : Met un arrêt de débug ou s'arrêtera l'interpréteur avec l'avance rapide",
    "Outil ?": "Les outils mis en place sur ce site sont diverses,\
    pour permettre au maximum une utilisation facile et rapide du brainfuck\n\
    Nous avons bien sur un interpréteur, qui permet de lancer le code écrit en-dessous simplement, ou le lancer en mode débug\
    et accéder à des outils pour faire tourner les instructions au pas à pas ou aller jusqu'à un breakpoint.\n\
    Il y a aussi d'autres petits outils permettant d'accélérer et d'optimiser l'écriture du code."
}

function download(filename, text) {
    let dl = document.createElement("a");
    dl.setAttribute("href", "data:text/X-brainfuck;charset=utf-8," + encodeURIComponent(text));
    dl.setAttribute("download", filename);

    dl.click();
}

function createCase(index){
    let memory = document.getElementById("memory");

    let new_case = document.createElement("div");
    let value = document.createElement("p");
    //let pos = document.createElement("span");

    value.className = "value";
    value.innerText = "0"

    //pos.className = "bottom";
    //pos.innerText = index;

    new_case.appendChild(value);
    //new_case.appendChild(pos);

    if (index === 0){
        memory.insertBefore(new_case, memory.firstChild);
    } else {
        memory.appendChild(new_case);
    }
}

function reset(){
    let memory = document.getElementById("memory");
    let code = document.getElementById("codearea").innerText;

    max = 0;
    index = 0;
    values = [0];
    read = 0;

    codearea.innerHTML = code.replaceAll("\n", "<br/>");

    memory.textContent = "";
    createCase(1);
}

function exec(memory, code, type, delay, timestop){
    let letter = code[read];

    let tempo = 0;

    switch (letter){
        case "#":
            if (type === 1){
                memory.children[index].className = "active_case";

                text = code.substring(0,read) + "<span class='show_letter'>" + code[read] + "</span>" + code.substring(read+1);
                codearea.innerHTML = text.replaceAll("\n", "<br/>");

                read++;
                in_run = 0;
                console.timeEnd("awoo");
                clearTimeout(timestop);
                return;
            }
            break;
        case ">":
            index++;
            if (index >= values.length){
                values.push(0);
                createCase(1);
            }
            break;
        case "<":
            index--;
            if (index < 0){
                values.unshift(0);
                createCase(0);
                index = 0;
            }
            break;
        case "+":
            values[index] = (values[index] + 1)%256;
            break;

        case "-":
            values[index] = (values[index] + 255)%256;
            break;
        default:
            tempo = 1;
            break;
    }

    memory.children[index].firstChild.textContent = values[index];

    if ((type === 2 || !in_run) && !tempo){

        memory.children[index].className = "active_case";

        text = code.substring(0,read) + "<span class='show_letter'>" + code[read] + "</span>" + code.substring(read+1);
        codearea.innerHTML = text.replaceAll("\n", "<br/>");

        read++;
        in_run = 0;
        console.timeEnd("awoo");
        clearTimeout(timestop);
        return;
    }

    if (read >= code.length){

        read++;
        in_run = 0;
        console.timeEnd("awoo");
        clearTimeout(timestop);
        return;
    }

    if (!tempo && delay){

        memory.children[index].className = "active_case";

        text = code.substring(0,read) + "<span class='show_letter'>" + code[read] + "</span>" + code.substring(read+1);
        codearea.innerHTML = text.replaceAll("\n", "<br/>");

        read++;

        setTimeout(function(){
            exec(memory, code, type, delay);
        }, delay);
    } else {
        read++;
        exec(memory, code, type, delay);
    }
}

function run(type){
    let memory = document.getElementById("memory");
    let codearea = document.getElementById("codearea");
    let delay = document.getElementById("delay");
    let timeout = document.getElementById("timeout");

    let code = codearea.innerText;
    let tempo;

    if (read >= code.length || in_run){
        return;
    }

    memory.children[index].removeAttribute("class");

    in_run = 1;
    console.time("awoo")
    timestop = setTimeout(function(){
        in_run = 0;
    }, timeout.value*1000);
    exec(memory, code, type, delay.value*1000, timestop);
}

document.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        let codearea = document.getElementById("codearea");

        localStorage.setItem("code", codearea.innerText);

        let save = document.getElementById("save");
        save.style.animation = "none";
        save.offsetHeight;
        save.style.animation = "";
    }
}, false);

window.addEventListener("load", function(e){
    let codearea = document.getElementById("codearea");
    let save = document.getElementById("save");
    save.style.animation = "none";

    code = localStorage.getItem("code");
    if (code){
        codearea.innerText = code;
    }

    reset();

    document.getElementById("dl").addEventListener("click", function(){
        download("code.bf", codearea.innerText);
    });

    let startbutton = document.getElementById("start");
    let debugbutton = document.getElementById("debug");

    startbutton.addEventListener("click", function(){
        debug = 0;
        reset();
        
        startbutton.className = "started";
        debugbutton.removeAttribute("class");

        run(0);
    });

    debugbutton.addEventListener("click", function(){
        debug = 1;
        reset();

        debugbutton.className = "started";
        startbutton.removeAttribute("class");

        memory.firstChild.className = "active_case";
    });

    document.getElementById("slow").addEventListener("click", function(){
        if (!debug) return;
        run(2);
    });

    document.getElementById("fast").addEventListener("click", function(){
        if (!debug) return;
        run(1);
    });

    document.getElementById("set").addEventListener("click", function(){
        if (!debug) return;
        set_value = document.getElementById("set_value")
        values[index] = set_value.value % 256

        memory.children[index].firstChild.textContent = values[index];

        memory.children[index].className = "active_case";

    });

    char_entry = document.getElementById("char_entry");
    char_output = document.getElementById("char_output");

    char_entry.addEventListener("input", function(){
        char_entry.value = char_entry.value.slice(-1)
        char_output.textContent = char_entry.value.charCodeAt() || 0;
    })

    pins = document.getElementsByClassName("pin");

    for (pin of pins){
        pin.addEventListener("mouseenter", function(event){
            desc = document.getElementById("desc");
            desc.innerText = pin_description[event.target.parentNode.innerText];
            desc.className = "visible_popup";
        });

        pin.addEventListener("mouseleave", function(){
            document.getElementById("desc").removeAttribute("class");
        });
    }
});