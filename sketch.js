import { onSensorData } from 'https://cdn.jsdelivr.net/npm/imu-tools@0/index.js'
 
onSensorData(handleSensorData)

let sensor = null
let first = false
let img 
let x = 0
let y = 0

// Code in this function is run once, when the sketch is started.
export function setup() {
    createCanvas(windowWidth-200, windowHeight)
    img = loadImage('cup3.png')
}

// Code in this function is run once per frame. If it draws the same thing each
// time, the sketch is a static image. If it draws something different on
// different frames, the sketch is an animation.
export function draw() {
    angleMode(DEGREES)
    let angle = frameCount/5;
    clear();
    // rotateAbout(angle, 200, 100);
    // image(img, x, y)
    // fill('black')
    // rect(0, 0, 20, 40)
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    // image(img, x, y)
    if (sensor !== null){
        let a = sensor[0]
        rotateAbout(a,img.width+150,img.height+150)

        // rect(275,300,1,1)
        image(img,625,135)
        noFill()
        rect(625,135,img.width,img.height)
    }
}

function rotateAbout(angle, x, y){
    translate(x,y);
    rotate(angle);
    translate(-x,-y);
}

function handleSensorData(data){
    if (first === false){
        console.info('sensor data:', data.euler)
    }
    first = true
    sensor = data.euler
        
}