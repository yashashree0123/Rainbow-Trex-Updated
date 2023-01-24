var PLAY = 1;
var END = 0;
var gameState = PLAY 

var trex, trex_running, trex_collided
var ground, invisibleGroun, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4
var backgroundImg;
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  jumpSound=loadSound("jump.wav")
  collidedSound=loadSound(collided.wav)

  backgroundImg = loadImage("backgroundImg.png")
  sunAnimation= loadImage("sun.png")

  trex_running=loadAnimation("trex_2.png","trex_1.png","trex_3.png");
  trex_collided= loadAnimation("trex_collided.png");

  groundImage=loadImage("ground.png")

  cloudImage=loadImage("cloud.png");

  obstacle1= loadImage("obstacle1.png");
  obstacle2= loadImage("obstacle2.png");
  obstacle3= loadImage("obstacle3.png");
  obstacle4= loadImage("obstacle4.png");

  gameOverImg= loadImage("gameOver.png");
  restartImg= loadImage("restart.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  sun=createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale=0.1

  trex= createSprite(50,height-70,20,50);

  trex.addAnimation("running", trex_running);
  trex.addAnimation("collieded", trex_collided);
  trex.setCollider('circle',0,0,350)
  trex.scale=0.008;

  invisibleGround= createSprite(width/2,height-10,width,125);
  invisibleGround.shapeColor= "#f4cbaa";


  ground= createSPrite(width/2,height,width,2);
  ground.addImage(gameOverImg);

  restart= createSprite(widdth/2,height/2);
  restart.addImage(restartImg);

  gameOver.scale=0.5;
  restart.scale=0.1;

  gameOver.visible=false;
  restart.visible=false;





  cloudsGroup=new cloudsGroup();
  obstaclesGroup=new cloudsGroup();

  score=0;
}

function draw(){

  backgroundImg(backgroundImg);
  texxtSize(20);
  fill("black");
  text("Score: "+ score,30,50);
}

if (gameState===PLAY){
  score = score + Math.round(getFrameRate()/60)
  ground.velocity= -(6 +3*score/100);

  if((touches.length > 0 || keyDown("SPACE")) && trex.y >= height-120){
    jumpSound.play()
    trex.velocityY= -10
    touches=[]
  }
  //gravity
  trex.velocityY- trex.velocityY + 0.8

  if (ground.x< 0){
    ground.x=ground.width/2
  }

  trex.collide(invisibleGround)
  spawnClouds()
  spawnObstacles()

if(obstaclesGroup.isTouching(trex)){
  collidedSound.play()
  gameState= END
}
}
else if (gameState === END) {
  gameOver.visible= true 
  restart.visible=true

  //set velocity of each game object to 0 
ground.velocityX=0
trex.velocityY=0
obstaclesGroup.setVelocityXEach(0);
cloudsGroup.setVelocityXEach(0);
//change trex animation
trex.changeAnimatioj("collided", trex_collided);

//set lifetime of the game objects so that they are never destoryed 
obstaclesGroup.setLifetimeEach(-1)
cloudsGroup.setLifetimeEach(-1)

if(touches.length>0 || keyDown("SPACE")|| mousePressedOver(restart)){
resizeTo();
touches=[]
}
}


drawSprites();



function spawnCLouds({
  //write code here to spawn clouds
  if (framecount % 60===0) {
    var cloud= createSprite(width+20,height-300,40,10);
    cloud.y=Math.round(random(100,220));
    cloud.addImage(cloudImage)
    cloud.scale=0.5
    cloud.velocityX=-3;

    //assign lifetime to the varible 
    cloud.lifetime=300;

    //adjust cloud depth 
    cloud.depth=trex.depth
trex.depth=trex.depth+1;

//add each cloud to the group
cloudsGroup.add(cloud);
  }
})

function spawnObstacles({
if(frameCount % 60 ===0 ){
  var obstacle= createSprite(600,height-95,20,30);
  obstacle.setCollider('circle',0,0,45)
//obstacle.debug=true

obstacle.velocityX=-(6+3*score/100);

//gernerate random obstavles
var rand = Math.round(random(1,2));
switch(rand){
  case 1: obstacle.addImage(obstacle1)
  break;
  case 2: obstacle.addImage(obstacle2)
  break;
}

//assign scale and lifetime to the obstacle 
obstacle.scale=0.3
obstacle.lifetime=300
obstacle.depth=trex.depth
trex.depth +=1;
//add each obstacle to the group
obstaclesGroup.add(obstacle)
}
})


function reset(){
  gameState= PLAY
  gameOver.visible=false
  restart.visible=false
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

  score=0; 
}