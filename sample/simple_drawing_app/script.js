const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

canvas.width = 1000
canvas.height = 600

let isDrawing = false
let oldX, oldY, curX, curY
let oldDrawings = []



addEventListener("pointerdown", e => {    
    isDrawing = true
    console.log(oldX, oldY, curX, curY);
    
})

addEventListener("pointermove", e => {
    if (e.pointerType == "mouse") {
        if (isDrawing) {
            curX = e.offsetX
            curY = e.offsetY
            drawLine(oldX, oldY, curX, curY)
            oldDrawings.push({oldX, oldY, curX, curY})
            oldX = curX
            oldY = curY
        }
    }
})

addEventListener("pointerup", e => {
    isDrawing = false
    oldX = oldY = undefined
    console.log(oldDrawings);
})


function drawLine(oldX, oldY, curX, curY) {
    ctx.beginPath()

    ctx.strokeStyle = "black"
    ctx.lineWidth = 2
    ctx.lineCap = "round"

    ctx.moveTo(oldX, oldY)
    ctx.lineTo(curX, curY)
    ctx.stroke()
    ctx.closePath()

}

loadOldDrawings()

function loadOldDrawings() {
}