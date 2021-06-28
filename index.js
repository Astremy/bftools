let values = [0];
let max = 0;
let index = 0;
let read = 0;

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

    max = 0;
    index = 0;
    values = [0];
    read = 0;

    memory.textContent = "";
    createCase(1)
}

function run(type){
    let memory = document.getElementById("memory");
    let code = document.getElementById("codearea").value;

    let tempo = 0;

    if (read >= code.length){
        return;
    }

    do {

        tempo = 0;

        letter = code[read];

        memory.children[index].style.border = "1px solid black";

        switch (letter){
            case "#":
                if (type === 1){
                    memory.children[index].style.border = "1px solid red";
                    read++;
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
                    values.unshift(0)
                    createCase(0);
                    index = 0;
                }
                break;
            case "+":
                values[index] = (values[index] + 1)%256
                break;

            case "-":
                values[index] = (values[index] + 255)%256
                break
            default:
                tempo = 1;
        }

        memory.children[index].firstChild.textContent = values[index]

        memory.children[index].style.border = "1px solid red";

        read++;
    } while((type!== 2 || tempo) && read < code.length )
}

document.addEventListener("keydown", function(e) {
  if (e.ctrlKey  && e.keyCode == 83) {
    e.preventDefault();
    let codearea = document.getElementById("codearea");

    localStorage.setItem("code", codearea.value);

    let save = document.getElementById("save");
    save.style.webkitAnimation = "none";
    setTimeout(function() {
        save.style.webkitAnimation = "";
    },10)
  }
}, false);

window.addEventListener("load", function(e){
    let codearea = document.getElementById("codearea");
    let save = document.getElementById("save");
    save.style.webkitAnimation = "none";

    code = localStorage.getItem("code");
    if (code){
        codearea.value = code;
    }

    document.getElementById("dl").addEventListener("click", function(){
        download("code.bf", codearea.value);
    });

    document.getElementById("start").addEventListener("click", function(){
        reset();
        run(0);
    });

    document.getElementById("debug").addEventListener("click", function(){
        reset();
        run(2);
    });

    document.getElementById("slow").addEventListener("click", function(){
        run(2);
    });

    document.getElementById("fast").addEventListener("click", function(){
        run(1);
    });
})