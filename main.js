document.querySelector("#wrapper").addEventListener("dragover", ev => {
    // janky stuff
    ev.preventDefault()
    ev.dataTransfer.effectAllowed = "all";
    ev.dataTransfer.dropEffect = "copy";
})

document.querySelector("#wrapper").addEventListener("drop", parse)

document.getElementById("extensionsbtn").addEventListener("click", () => {
    document.getElementById("extensions").style.display = ""
    document.getElementById("metadata").style.display = "none"
    document.getElementById("monitors").style.display = "none"
    document.getElementById("targets").style.display = "none"
})

document.getElementById("metadatabtn").addEventListener("click", () => {
    document.getElementById("extensions").style.display = "none"
    document.getElementById("metadata").style.display = ""
    document.getElementById("monitors").style.display = "none"
    document.getElementById("targets").style.display = "none"
})

document.getElementById("monitorsbtn").addEventListener("click", () => {
    document.getElementById("extensions").style.display = "none"
    document.getElementById("metadata").style.display = "none"
    document.getElementById("monitors").style.display = ""
    document.getElementById("targets").style.display = "none"
})

document.getElementById("targetsbtn").addEventListener("click", () => {
    document.getElementById("extensions").style.display = "none"
    document.getElementById("metadata").style.display = "none"
    document.getElementById("monitors").style.display = "none"
    document.getElementById("targets").style.display = ""
})

document.getElementById("spriteselect").addEventListener("change", () => {
    currentTarget = targets[document.getElementById("spriteselect").value]
    fillTargetInfo()
})

for (let btn of document.getElementsByClassName("hpickerbtn"))
{
    btn.addEventListener("click", () => {
        for (let btn of document.getElementsByClassName("hpickerbtn"))
        {
            btn.classList.remove("selected")
        }

        btn.classList.add("selected")

        selectedTargetBtn = btn.innerText

        fillTargetInfo()
    })
}
