let sprites = {
    Stand: {
      img: null,
      width: 103,
      height: 188,
      frames: 16
    },
    run: {
      img: null,
      width: 1832/11,
      height: 178,
      frames: 11
    },
    
    jump: {
      img: null,
      width: 233,
      height: 180,
      frames: 10
    }
  };

let character = {
  x: 100,
  y: 200,
  speedX: 15,      // 水平移動速度
  speedY: 5,      // 垂直速度
  gravity: 0.8,   // 重力
  jumpForce: -10, // 跳躍力道
  isJumping: false,
  groundY: 300,   // 地面位置
  currentFrame: 0,
  currentAction: 'idle',
  direction: 1    // 1 表示向右，-1 表示向左
};

// 新增背景相關變數
let bgLayers = {
  far: {
    img: null,
    x: 0,
    speed: 1
  },
  mid: {
    img: null,
    x: 0,
    speed: 2
  },
  near: {
    img: null,
    x: 0,
    speed: 4
  }
};

function preload() {
  // 載入角色精靈圖
  sprites.idle.img = loadImage('character-stand.png');
  sprites.walk.img = loadImage('character-walk.png');
  sprites.jump.img = loadImage('character-jump.png');
  
  // 載入背景圖層
  bgLayers.far.img = loadImage('bg-far.jpg');
  bgLayers.mid.img = loadImage('bg-mid.png');
  bgLayers.near.img = loadImage('bg-near.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(12); // 設定動畫速度
  character.y = width-sprites.idle.height
  
}

function draw() {
  background(220);
  
  // 繪製背景圖層
  drawBackgrounds();
  
  // 處理物理運動
  updatePhysics();
  
  // 取得當前動作的精靈資訊
  let currentSprite = sprites[character.currentAction];
  
  // 更新當前幀
  character.currentFrame = (character.currentFrame + 1) % currentSprite.frames;
  
  // 計算精靈圖的位置
  let sx = character.currentFrame * currentSprite.width;
  
  // 根據方向繪製精靈圖
  push();
  translate(character.x + (character.direction === -1 ? currentSprite.width : 0), character.y);
  scale(character.direction, 1);
  image(currentSprite.img, 
    0, 0,                                     // 畫布上的位置
    currentSprite.width, currentSprite.height, // 顯示的大小
    sx, 0,                                    // 精靈圖的起始位置
    currentSprite.width, currentSprite.height  // 精靈圖的裁切大小
  );
  pop();
  
  // 繪製地面參考線
//   stroke(0);
//   line(0, character.groundY+currentSprite.height, width, character.groundY+currentSprite.height);
  
  // 檢查鍵盤輸入
  checkKeys();
}

function updatePhysics() {
  // 應用重力
  if (character.y < character.groundY) {
    character.speedY += character.gravity;
    character.isJumping = true;
  }
  
  // 更新垂直位置
  character.y += character.speedY;
  
  // 檢查是否著地
  if (character.y >= character.groundY) {
    character.y = character.groundY;
    character.speedY = 0;
    character.isJumping = false;
  }
}

function checkKeys() {
  if (keyIsDown(RIGHT_ARROW)) {
    // 限制角色在畫面中央
    if (character.x < width-2*sprites.walk.width) {
      character.x += character.speedX;
    }
    character.currentAction = 'walk';
    character.direction = 1;
  } else if (keyIsDown(LEFT_ARROW)) {
    // 限制角色在畫面中央
    if (character.x > width/8) {
      character.x -= character.speedX;
    }
    character.currentAction = 'walk';
    character.direction = -1;
  } else if (!character.isJumping) {
    character.currentAction = 'idle';
  }
  
  // 跳躍控制
  if ((keyIsDown(UP_ARROW) || keyIsDown(32)) && !character.isJumping) {
    character.speedY = character.jumpForce;
    character.currentAction = 'jump';
    character.isJumping = true;
  }
  
  if (character.isJumping) {
    character.currentAction = 'jump';
  }
}

// 新增背景繪製函數
function drawBackgrounds() {
  // 繪製遠景
//   drawLayer(bgLayers.far);
  // 繪製中景
//   drawLayer(bgLayers.mid);
  // 繪製近景
  drawLayer(bgLayers.near);
}

function drawLayer(layer) {
  // 繪製兩張圖片以實現無縫循環
  image(layer.img, layer.x + width, 0, width, height);
  image(layer.img, layer.x, 0, width, height);
  
  
  // 更新背景位置
  if (keyIsDown(RIGHT_ARROW)) {
    layer.x -= layer.speed;
  } else if (keyIsDown(LEFT_ARROW)) {
    layer.x += layer.speed;
  }
  
  // 當背景移出畫面時重置位置
  if (layer.x <= -width) {
    layer.x = 0;
  }
  if (layer.x >= 0) {
    layer.x = -width;
  }
} 