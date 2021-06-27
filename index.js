function download(filename, text) {
    let dl = document.createElement("a");
    dl.setAttribute("href", "data:text/X-brainfuck;charset=utf-8," + encodeURIComponent(text));
    dl.setAttribute("download", filename);

    dl.click();
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

    document.getElementById("dl").addEventListener("click",function(){
        download("code.bf", codearea.value);
    })
})