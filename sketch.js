var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obs1, obs2, obs3, obs4, obs5, obs6, obstaclesGroup;
var count;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver, gameOverImage, restart, restartImage;
let checkPoint;
let die;
let jump;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");

  obs1 = loadImage("obstacle1.png");
  obs2 = loadImage("obstacle2.png");
  obs3 = loadImage("obstacle3.png");
  obs4 = loadImage("obstacle4.png");
  obs5 = loadImage("obstacle5.png");
  obs6 = loadImage("obstacle6.png");
  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  
  checkpoint = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  count = 0;
  
  gameOver = createSprite(270, 80, 70, 20);
  gameOver.addImage("gameOver", gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(270, 120, 70, 20);
  restart.addImage("restart", restartImage);
  restart.scale = 0.5;
  restart.visible = false;
  
}

function draw() {
  background(180);
  
  if (gameState === PLAY) {
    
    ground.velocityX = -(6+3*count/100);
    
    if (count <0 && count%100 === 0) {
      checkpoint.play();  
    }
    
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (World.frameCount % 10 === 0) {
      count = count + 1;
    }

    if (keyDown("space") && trex.y >161) {
      trex.velocityY = -10;
      jump.play();
    }

    trex.velocityY = trex.velocityY + 0.8

    spawnClouds();

    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      die.play();
      gameState = END;
    }
  } 
  
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    trex.changeAnimation("collided", trex_collided);
    trex.velocityY = 0;
  
    ground.velocityX = 0;
    
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    
    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    
    if (mousePressedOver(restart)) {
      reset();
    }
  
  }
  
  trex.collide(invisibleGround);

  text("Score: " + count, 450, 50);

  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    //assign lifetime to the variable
    cloud.lifetime = 200;
    //adjust the depth 
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -(6+3*count/100);
    obstacle.lifetime = 100;

    var rand = round(random(1, 6));

    switch (rand) {

      case 1:
        obstacle.addImage(obs1);
        break;
      case 2:
        obstacle.addImage(obs2);
        break;
      case 3:
        obstacle.addImage(obs3);
        break;
      case 4:
        obstacle.addImage(obs4);
        break;
      case 5:
        obstacle.addImage(obs5);
        break;
      case 6:
        obstacle.addImage(obs6);
        break;

      default:
        break;
    }
    obstacle.scale = 0.5;
    obstaclesGroup.add(obstacle);
  }

}

function reset() {
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  count = 0;
}