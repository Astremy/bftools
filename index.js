function download(filename, text) {
    let dl = document.createElement("a");
    dl.setAttribute("href", "data:text/X-brainfuck;charset=utf-8," + encodeURIComponent(text));
    dl.setAttribute("download", filename);

    dl.style.display = "none";
    document.body.appendChild(dl);

    dl.click();

    document.body.removeChild(dl);
}

document.addEventListener("keydown", function(e) {
  if (e.ctrlKey  && e.keyCode == 83) {
    e.preventDefault();
    let code = document.getElementById("codearea")
    download("code.bf", code.value)
  }
}, false);