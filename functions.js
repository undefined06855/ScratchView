let extensions, metadata, monitors, targets

let loadedFile = false
let selectedTargetBtn = "Info"

let currentTarget

// https://stackoverflow.com/a/26476282
window.toggleExpand = function(element) {
    if (!element.style.height || element.style.height == '0px') { 
        element.style.height = Array.prototype.reduce.call(element.childNodes, function(p, c) {return p + (c.offsetHeight || 0);}, 0) + 'px';
    } else {
        element.style.height = '0px';
    }
}

function getProjectJsonFromZip(zipFile) {
    return new Promise((resolve, reject) => {
        const zip = new JSZip()
        zip.loadAsync(zipFile).then((zip) => {
            zip.file("project.json").async("text").then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        }).catch((err) => {
            reject(err)
        })
    })
}

function addNewSpriteToList(name, index)
{
    const option = document.createElement("option")
    option.innerText = name
    option.value = index
    document.getElementById("spriteselect").appendChild(option)
}

function formatFieldObject(obj)
{
    if (Object.keys(obj).length == 0) return "None"
    else
    {
        let r = ``
        for (const option in obj)
        {
            r += `${option}: ${obj[option]}\n`
        }
        return r
    }
}

function formatBlock(block)
{
    console.log(block)
    return block === null ? block : block + " (" + formatBlockOpcode(currentTarget.blocks[block].opcode) + ")"
}

function formatBlockOpcode(opcode)
{
    return opcode.replaceAll("_", ".")
}

// chatGPT
function formatAsTable(value1, value2, element, allowOverflow = false) {
    if (value2 === undefined || value2 === null) value2 = "N/A"
    // Create a new table element
    const table = document.createElement('table')
    
    // Create a new row element
    const row = document.createElement('tr')
    
    // Create two new cell elements
    const cell1 = document.createElement('td')
    const cell2 = document.createElement('td')
    
    // Set the text content of the cells to the values passed in
    cell1.innerText = value1
    cell2.innerText = value2

    if (allowOverflow) {cell2.style.overflowX = "hidden"}
    
    // Append the cells to the row
    row.appendChild(cell1)
    row.appendChild(cell2)
    
    // Append the row to the table
    table.appendChild(row)
    
    // Append the table to the element passed in
    element.appendChild(table)
}

function fillTargetInfo()
{
    const targetinfo = document.getElementById("targetinfo")
    targetinfo.innerText = ""

    switch(selectedTargetBtn)
    {
        case "Info":
            formatAsTable("currentCostume", currentTarget.currentCostume, targetinfo)
            formatAsTable("direction", currentTarget.direction, targetinfo)
            formatAsTable("draggable", currentTarget.draggable, targetinfo)
            formatAsTable("isStage", currentTarget.isStage, targetinfo)
            formatAsTable("layerOrder", currentTarget.layerOrder, targetinfo)
            formatAsTable("name", currentTarget.name, targetinfo)
            formatAsTable("rotationStyle", currentTarget.rotationStyle, targetinfo)
            formatAsTable("size", currentTarget.size, targetinfo)
            formatAsTable("visible", currentTarget.visible, targetinfo)
            formatAsTable("volume", currentTarget.volume, targetinfo)
            formatAsTable("x", currentTarget.x, targetinfo)
            formatAsTable("y", currentTarget.y, targetinfo)
            break
        case "Blocks":
            if (Object.keys(currentTarget.blocks).length == 0) targetinfo.innerText = "None"
            else
            {
                // this is probably going to be hard
                // nvm it wasnt that bad - just shitty code
                for (const chksum in currentTarget.blocks)
                {
                    const block = currentTarget.blocks[chksum]
                    const wrapper = document.createElement("div")
                    const wrapperwrapper = document.createElement("div")
                    formatAsTable(formatBlockOpcode(block.opcode), " ", wrapperwrapper)

                    wrapperwrapper.appendChild(wrapper)

                    formatAsTable("fields", formatFieldObject(block.fields), wrapper)
                    formatAsTable("inputs", formatFieldObject(block.inputs), wrapper)
                    formatAsTable("next", formatBlock(block.next), wrapper)
                    formatAsTable("opcode", block.opcode, wrapper)
                    formatAsTable("parent", formatBlock(block.parent), wrapper)
                    formatAsTable("shadow", block.shadow, wrapper)
                    formatAsTable("toplevel", block.toplevel, wrapper)
                    formatAsTable("x", block.x, wrapper)
                    formatAsTable("y", block.y, wrapper)

                    wrapperwrapper.classList.add("block")

                    wrapperwrapper.addEventListener("click", () => {
                        toggleExpand(wrapper)
                    })

                    wrapper.style.height = "0px"

                    targetinfo.appendChild(wrapperwrapper)
                }
            }
            break
        case "Broadcasts":
            if (Object.keys(currentTarget.broadcasts).length == 0) targetinfo.innerText = "None"
            else
            {
                for (const chksum in currentTarget.broadcasts)
                {
                    const name = currentTarget.broadcasts[chksum]
                    formatAsTable(name, chksum, targetinfo)
                }
            }
            break
        case "Comments":
            if (Object.keys(currentTarget.comments).length == 0) targetinfo.innerText = "None"
            else
            {
                for (const chksum in currentTarget.comments)
                {
                    const comment = currentTarget.comments[chksum]
                    const wrapper = document.createElement("div")
                    const wrapperwrapper = document.createElement("div")
                    formatAsTable(comment.text, " ", wrapperwrapper)

                    wrapperwrapper.appendChild(wrapper)

                    formatAsTable("blockId", formatBlock(comment.blockId), wrapper)
                    formatAsTable("height", comment.height, wrapper)
                    formatAsTable("minimized", comment.minimized, wrapper)
                    formatAsTable("text", comment.text, wrapper)
                    formatAsTable("width", comment.width, wrapper)
                    formatAsTable("x", comment.x, wrapper)
                    formatAsTable("y", comment.y, wrapper)

                    wrapperwrapper.classList.add("block")

                    wrapperwrapper.addEventListener("click", () => {
                        toggleExpand(wrapper)
                    })

                    wrapper.style.height = "0px"

                    targetinfo.appendChild(wrapperwrapper)
                }
            }
            break
        case "Costumes":
            if (Object.keys(currentTarget.costumes).length == 0) targetinfo.innerText = "None"
            else
            {
                for (const chksum in currentTarget.costumes)
                {
                    const costume = currentTarget.costumes[chksum]
                    const wrapper = document.createElement("div")
                    const wrapperwrapper = document.createElement("div")
                    formatAsTable(costume.name, " ", wrapperwrapper)

                    wrapperwrapper.appendChild(wrapper)

                    formatAsTable("assetId", costume.assetId, wrapper)
                    formatAsTable("bitmapResolution", costume.bitmapResolution, wrapper)
                    formatAsTable("dataFormat", costume.dataFormat, wrapper)
                    formatAsTable("md5ext", costume.md5ext, wrapper)
                    formatAsTable("name", costume.name, wrapper)
                    formatAsTable("rotationCenterX", costume.rotationCenterX, wrapper)
                    formatAsTable("rotationCenterY", costume.rotationCenterY, wrapper)

                    wrapperwrapper.classList.add("block")

                    wrapperwrapper.addEventListener("click", () => {
                        toggleExpand(wrapper)
                    })

                    wrapper.style.height = "0px"

                    targetinfo.appendChild(wrapperwrapper)
                }
            }
            break
        case "Lists":
            if (Object.keys(currentTarget.lists).length == 0) targetinfo.innerText = "None"
            else
            {
                for (const chksum in currentTarget.lists)
                {
                    const list = currentTarget.lists[chksum]
                    const wrapper = document.createElement("div")
                    const wrapperwrapper = document.createElement("div")
                    formatAsTable(list[0], " ", wrapperwrapper)

                    wrapperwrapper.appendChild(wrapper)

                    if (list[1].length == 0)
                    {
                        formatAsTable("<empty>", "<empty>", wrapper)
                    }
                    else for (const entry of list[1])
                    {
                        formatAsTable(entry, " ", wrapper)
                    }

                    wrapperwrapper.classList.add("block")

                    wrapperwrapper.addEventListener("click", () => {
                        toggleExpand(wrapper)
                    })

                    wrapper.style.height = "0px"

                    targetinfo.appendChild(wrapperwrapper)
                }
            }
            break
        case "Sounds":
            if (Object.keys(currentTarget.sounds).length == 0) targetinfo.innerText = "None"
            else
            {
                for (const chksum in currentTarget.sounds)
                {
                    const sound = currentTarget.sounds[chksum]
                    const wrapper = document.createElement("div")
                    const wrapperwrapper = document.createElement("div")
                    formatAsTable(sound.name, " ", wrapperwrapper)

                    wrapperwrapper.appendChild(wrapper)

                    formatAsTable("assetId", sound.assetId, wrapper)
                    formatAsTable("dataFormat", sound.dataFormat, wrapper)
                    formatAsTable("md5ext", sound.md5ext, wrapper)
                    formatAsTable("name", sound.name, wrapper)
                    formatAsTable("rate", sound.rate, wrapper)
                    formatAsTable("sampleCount", sound.sampleCount, wrapper)

                    wrapperwrapper.classList.add("block")

                    wrapperwrapper.addEventListener("click", () => {
                        toggleExpand(wrapper)
                    })

                    wrapper.style.height = "0px"

                    targetinfo.appendChild(wrapperwrapper)
                }
            }
            break
        case "Variables":
            if (Object.keys(currentTarget.costumes).length == 0) targetinfo.innerText = "None"
            else
            {
                for (const chksum in currentTarget.variables)
                {
                    const variable = currentTarget.variables[chksum]

                    formatAsTable(chksum, variable, targetinfo, true)
                }
            }
            break
    }
}
