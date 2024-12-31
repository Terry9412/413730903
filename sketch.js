let characterStand; // 站立精靈圖
let characterRun;   // 跑步精靈圖
let characterJump;  // 跳躍精靈圖

let currentSprite;  // 目前顯示的精靈
let currentFrame = 0;  // 目前的影格
let frameDelay = 5;    // 動畫速度控制
let frameCounter = 0;  

// 精靈圖設定
const spriteData = {
    stand: { frames: 8, scale: 1.5 },  // 站立動作有8格，縮放1.5倍
    run: { frames: 8, scale: 1.5 },    // 跑步動作有8格，縮放1.5倍
    jump: { frames: 6, scale: 1.5 }    // 跳躍動作有6格，縮放1.5倍
};

// 角色狀態
let state = 'stand';
let x, y;  // 角色位置
let moveSpeed = 5;  // 移動速度

// 生命值相關設定
let maxHealth = 100;
let currentHealth = 100;
let healthBarWidth = 60;
let healthBarHeight = 10;

function preload() {
    // 載入精靈圖片並加入錯誤處理
    characterStand = loadImage('stand.png', 
        // 成功載入時
        () => console.log('Stand sprite loaded successfully'),
        // 載入失敗時
        () => console.log('Error loading stand sprite')
    );
    characterRun = loadImage('run.png',
        () => console.log('Run sprite loaded successfully'),
        () => console.log('Error loading run sprite')
    );
    characterJump = loadImage('jump.png',
        () => console.log('Jump sprite loaded successfully'),
        () => console.log('Error loading jump sprite')
    );
}

function setup() {
    // 建立全螢幕畫布
    createCanvas(windowWidth, windowHeight);
    
    // 設定初始狀態
    currentSprite = characterStand;
    
    // 設定角色初始位置在畫面中央
    x = windowWidth / 2;
    y = windowHeight / 2;
}

function windowResized() {
    // 視窗大小改變時重新設定畫布
    resizeCanvas(windowWidth, windowHeight);
    // 更新角色位置到新的中心點
    x = windowWidth / 2;
    y = windowHeight / 2;
}

function draw() {
    background(220);
    
    // 更新動畫影格
    frameCounter++;
    if (frameCounter >= frameDelay) {
        currentFrame = (currentFrame + 1) % spriteData[state].frames;
        frameCounter = 0;
    }
    
    // 處理鍵盤輸入
    handleKeyInput();
    
    // 繪製精靈
    drawSprite();
}

function handleKeyInput() {
    // 預設狀態為站立
    if (!keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW) && state !== 'jump') {
        state = 'stand';
        currentSprite = characterStand;
    }
    
    // 右方向鍵 - 向右跑步
    if (keyIsDown(RIGHT_ARROW)) {
        state = 'run';
        currentSprite = characterRun;
        x = constrain(x + moveSpeed, 0, windowWidth);
    }
    
    // 左方向鍵 - 向左跑步
    if (keyIsDown(LEFT_ARROW)) {
        state = 'run';
        currentSprite = characterRun;
        x = constrain(x - moveSpeed, 0, windowWidth);
    }
    
    // 空白鍵 - 跳躍
    if (keyIsDown(32) && state !== 'jump') { // 32 是空白鍵的 keyCode
        state = 'jump';
        currentSprite = characterJump;
        // 這裡可以加入跳躍動畫完成後回到站立狀態的邏輯
        setTimeout(() => {
            state = 'stand';
            currentSprite = characterStand;
        }, 500); // 500毫秒後回到站立狀態
    }
}

function drawSprite() {
    // 計算單一幀的寬度
    let frameWidth = currentSprite.width / spriteData[state].frames;
    let frameHeight = currentSprite.height;
    
    // 計算當前幀在精靈圖中的位置
    let sx = currentFrame * frameWidth;
    
    // 繪製精靈圖片的特定幀
    image(
        currentSprite,     // 來源圖片
        x - (frameWidth * spriteData[state].scale) / 2,  // 目標位置 X (置中)
        y - (frameHeight * spriteData[state].scale) / 2, // 目標位置 Y (置中)
        frameWidth * spriteData[state].scale,        // 顯示寬度
        frameHeight * spriteData[state].scale,       // 顯示高度
        sx,               // 來源圖片裁切起始 X
        0,                // 來源圖片裁切起始 Y
        frameWidth,       // 來源圖片裁切寬度
        frameHeight       // 來源圖片裁切高度
    );
    
    // 繪製生命值條
    drawHealthBar(
        x, 
        y - (frameHeight * spriteData[state].scale) / 2 - 20, // 位置在角色頭頂上方20像素
        currentHealth
    );
}

function drawHealthBar(x, y, health) {
    push(); // 保存當前繪圖狀態
    
    // 繪製背景條（灰色）
    noStroke();
    fill(100);
    rectMode(CENTER);
    rect(x, y, healthBarWidth, healthBarHeight);
    
    // 計算當前生命值的寬度
    let currentWidth = map(health, 0, maxHealth, 0, healthBarWidth);
    
    // 根據生命值決定顏色
    let healthColor;
    if (health > 70) {
        healthColor = color(0, 255, 0); // 綠色
    } else if (health > 30) {
        healthColor = color(255, 255, 0); // 黃色
    } else {
        healthColor = color(255, 0, 0); // 紅色
    }
    
    // 繪製當前生命值（有顏色）
    fill(healthColor);
    rectMode(CORNER);
    rect(x - healthBarWidth/2, y - healthBarHeight/2, currentWidth, healthBarHeight);
    
    // 繪製生命值數字
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(health + '%', x, y);
    
    pop(); // 恢復繪圖狀態
}

function keyPressed() {
    if (key === 'h') { // 按 h 減少生命值
        currentHealth = max(0, currentHealth - 10);
    }
    if (key === 'j') { // 按 j 增加生命值
        currentHealth = min(maxHealth, currentHealth + 10);
    }
} 