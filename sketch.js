import { onSensorData } from 'https://cdn.jsdelivr.net/npm/imu-tools@0.0.7/index.js'

onSensorData(handleSensorData)

let sensor = null
let first = false
let img
let x = 0
let y = 350;
let button
let system;
let waterOn = false;
let w = 30
let h = 90
let prevx, prevy;
let m12, b12, m13, b13, m24, b24, m34, b34;
let initialangle;
let drag = 0.92;
let grav = 0.2;
let a = 5;
let dx;
let dy;
let mySound;


export function preload(){
  mySound = loadSound('water2.wav');
}

// Code in this function is run once, when the sketch is started.
export function setup() {
    createCanvas(windowWidth, windowHeight)
    img = loadImage('cup5.png')
    angleMode(DEGREES);
    initialangle = asin((h)/sqrt(w*w+h*h));
    system = new ParticleSystem(createVector(800, 285));
     
    
    

    button = createButton('H2O')
    button.position(710,295)
    button.mousePressed(pourwater)

}
function pourwater(){
    waterOn = !waterOn;
    if(waterOn){
      mySound.play();
    }
      else{
        mySound.stop();
      }
}


export function draw() {
    angleMode(DEGREES)
    let angle = frameCount / 5;
    clear();
    
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    
    if (sensor !== null) {
        let a = sensor[0]
       
        console.info(sensor[2]);
       
         x = map(sensor[2],-90, 0, 625, 210);

         //x = sensor[0];
    //y = 200;
    
    dx = x - prevx;
    dy = y - prevy
    
    let cy = y+h/2-sin(a+initialangle)*sqrt(w*w/4+h*h/4);
    let cx = x+w/2-cos(a+initialangle)*sqrt(w*w/4+h*h/4);
    
    let cy2 = y+h/2-sin(a+180-initialangle)*sqrt(w*w/4+h*h/4);
    let cx2 = x+w/2-cos(a+180-initialangle)*sqrt(w*w/4+h*h/4);
    
    let cy3 = y+h/2-sin(a-initialangle)*sqrt(w*w/4+h*h/4);
    let cx3 = x+w/2-cos(a-initialangle)*sqrt(w*w/4+h*h/4);
    
    let cy4 = y+h/2-sin(a+180+initialangle)*sqrt(w*w/4+h*h/4);
    let cx4 = x+w/2-cos(a+180+initialangle)*sqrt(w*w/4+h*h/4);
    
    
    //SLope!!
    m12 = (cy2 - cy) / (cx2 - cx);
    b12 = cy - m12*cx;
    m34 = m12;
    b34 = cy3 - m34*cx3;
    
    m13 = (cy3 - cy) / (cx3 - cx);
    b13 = cy - m13*cx;
    m24 = m13;
    b24 = cy2 - m24*cx2;
    
  
    
  //   fill(255);
  //   fill(0,255,255);
  // ellipse(cx,cy, 20,20);
  // fill(0,255,0);
  // ellipse(cx2,cy2, 20,20);
  // fill(255,255,0);
  // ellipse(cx3,cy3, 20,20);
  // fill(255,0,0);
  // ellipse(cx4,cy4, 20,20);

  if(frameCount%7 == 0 && waterOn) {
    system.addParticle();
    }
    system.run();

        translate(x-24, y-15)
        rotateAbout(a, img.width / 2, img.height / 2)
        image(img, 0, 0)
    }
    
    
  
    
    
    
    //Rect
    noFill();
   
    
    
    prevx = x;
    prevy = y;
}

function rotateAbout(angle, x, y) {
    translate(x, y);
    rotate(angle);
    translate(-x, -y);
}

function handleSensorData(data) {
    if (first === false) {
        console.info('sensor data:', data.euler)
    }
    first = true
    sensor = data.euler

}

let Particle = function(position) {
    this.acceleration = createVector(0, grav);
    this.velocity = createVector(random(-0.1, 0.1), 2);
    this.position = position.copy();
    this.prevPos = position.copy();
    this.lifespan = 255;
    this.inCup = false;
  };
  
  Particle.prototype.run = function() {
    this.update();
    this.display();
  };
  
  // Method to update position
  Particle.prototype.update = function(){
    if(this.inCup) {
      this.position.add(createVector(dx,dy));
    }
    
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.velocity.mult(drag);
    
    if(this.position.y > this.position.x*m12+min(b12,b34) && this.position.y < this.position.x*m12+max(b12,b34) && this.position.y > this.position.x*m13+min(b13,b24) && this.position.y < this.position.x*m13+max(b13,b24)) {
      if(!this.inCup) {
      let d = p5.Vector.sub(this.position,createVector(x+w/2,y+h/2));
      d.normalize().mult(0.5);
        this.velocity.add(d);
      }
      if(b12<b34 && this.prevPos.y < this.prevPos.x*m12+b12 && this.prevPos.y > this.prevPos.x*m13+min(b13,b24) && this.prevPos.y < this.prevPos.x*m13+max(b13,b24)) {
        
        this.inCup = true;
        }
      
    }
    
    if(this.inCup) {
      let d = p5.Vector.sub(this.position,createVector(x+w/2,y+h/2));
      d.normalize().mult(-0.5);
      if((this.position.y < this.position.x*m12+min(b12,b34) || this.position.y > this.position.x*m12+max(b12,b34))) {
        if(b12<b34) {
        this.velocity.add(d);
      
        }
        else {
          this.inCup = false;
        }
      }
      
      if(this.position.y < this.position.x*m13+min(b13,b24)) {
        this.velocity.add(d);
      }
      if(this.position.y > this.position.x*m13+max(b13,b24)) {
        this.velocity.add(d);
      }
    } 
      
    this.prevPos = this.position.copy();
   
  };
  
  // Method to display
  Particle.prototype.display = function() {
    
    fill(0,0,200, this.lifespan);
    ellipse(this.position.x, this.position.y, 12, 12);
    
  };
  
  // Is the particle still useful?
  Particle.prototype.isDead = function(){
  
  };
  
  let ParticleSystem = function(position) {
    this.origin = position.copy();
    this.particles = [];
  };
  
  ParticleSystem.prototype.addParticle = function() {
    this.particles.push(new Particle(this.origin));
  };
  
  ParticleSystem.prototype.run = function() {
    for (let i = this.particles.length-1; i >= 0; i--) {
      let p = this.particles[i];
      for (let j = i-1; j>=0; j--){
        let p2= this.particles[j];
        p.check(p2);
      }
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  };
  
  Particle.prototype.check = function(other){
    let distance = p5.Vector.sub(this.position,other.position);
    
    //console.log(distance.mag());
    
    if(distance.mag() <= 12) {
      distance.normalize();
      this.velocity.add(p5.Vector.mult(distance, 0.5));
      other.velocity.sub(p5.Vector.mult(distance, 0.5));
    }
  }