function parse(event)
{
    if (
        event.dataTransfer.files.length == 0 ||
        !event.dataTransfer.files[0].name.endsWith(".sb3") ||
        loadedFile
    ) { event.preventDefault() }
    else
    {
        var reader = new FileReader();

        const file = event.dataTransfer.files[0]
    
        reader.onload = function() {
            document.getElementById("beginPrompt").style.display = "none"
            document.getElementById("viewtypes").style.display = ""
            document.getElementById("metadata").style.display = ""
            getProjectJsonFromZip(new Uint8Array(this.result)).then(str => {
                const file = JSON.parse(str)
                console.log(file)

                targets = file.targets
                extensions = file.extensions
                monitors = file.monitors
                metadata = file.meta

                loadedFile = true

                // target section
                let i = 0
                for (const sprite of file.targets)
                {
                    addNewSpriteToList(sprite.name, i, sprite.isStage)
                    i++
                }

                currentTarget = targets[0] // will always be stage

                fillTargetInfo()

                // extensions section
                if (extensions.length == 0)
                {
                    const el = document.createElement("div")
                    el.innerText = "None"
                    document.getElementById("extensions").appendChild(el)
                }
                else for (const extension of extensions)
                {
                    formatAsTable(extension, " ", document.getElementById("extensions"))
                }

                // monitors section
                if (monitors.length == 0)
                {
                    const el = document.createElement("div")
                    el.innerText = "None"
                    document.getElementById("monitors").appendChild(el)
                }
                else for (const monitor of monitors)
                {
                    const wrapper = document.createElement("div")
                    const wrapperwrapper = document.createElement("div")

                    try
                    {
                        formatAsTable(Object.entries(monitor.params)[0][1], " ", wrapperwrapper)
                    }
                    catch(_)
                    {
                        formatAsTable("<NOT_AVAILABLE>", " ", wrapperwrapper)
                    }

                    wrapperwrapper.appendChild(wrapper)

                    formatAsTable("height", monitor.height, wrapper)
                    formatAsTable("id", monitor.id, wrapper)
                    formatAsTable("isDescrete", monitor.isDescrete, wrapper)
                    formatAsTable("mode", monitor.mode, wrapper)
                    formatAsTable("params", formatFieldObject(monitor.params), wrapper)
                    formatAsTable("sliderMax", monitor.sliderMax, wrapper)
                    formatAsTable("sliderMin", monitor.sliderMin, wrapper)
                    formatAsTable("spriteName", monitor.spriteName, wrapper)
                    formatAsTable("value", monitor.value, wrapper)
                    formatAsTable("visible", monitor.visible, wrapper)
                    formatAsTable("width", monitor.width, wrapper)
                    formatAsTable("x", monitor.x, wrapper)
                    formatAsTable("y", monitor.y, wrapper)

                    wrapperwrapper.classList.add("block")

                    wrapperwrapper.addEventListener("click", () => {
                        toggleExpand(wrapper)
                    })

                    wrapper.style.height = "0px"

                    document.getElementById("monitors").appendChild(wrapperwrapper)
                }

                // metadata section
                formatAsTable("agent", metadata.agent, document.getElementById("metadata"))
                formatAsTable("semver", metadata.semver, document.getElementById("metadata"))
                formatAsTable("vm", metadata.vm, document.getElementById("metadata"))
            })
        }

        reader.readAsArrayBuffer(file);
        event.preventDefault()
    }
}
