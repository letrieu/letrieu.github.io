var game = new Phaser.Game(390,600,Phaser.AUTO);

// function initLevels() {
// 	levelInfo = {
//         n: 5,
//         levelXY: [{'x': 210, 'y': 500},
//         {'x': 270, 'y': 400},
//         {'x': 180, 'y': 300},
//         {'x': 80, 'y': 200},
//         {'x': 120, 'y': 100},]
//     }
//     levels = game.add.group();
//     for(i=0;i<levelInfo.n;i++){
//     	lv = game.add.sprite(levelInfo.levelXY[i]['x'],levelInfo.levelXY[i]['y'], 'lvPoint');
//     	style = { font: "15px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: lv.width, align: "center" };
// 		text1 = game.add.text(0, 0, ""+ (i+1), style);
// 	    text1.anchor.set(0.5);
// 	    text1.x = Math.floor(lv.x + lv.width / 2);
//     	text1.y = Math.floor(lv.y + lv.height / 2);
//     	lv.inputEnabled = true;
// 		lv.events.onInputDown.add(onState1, this);
// 		levels.add(lv);
//     }
// }


var MainState = {
	preload: function(){
		this.load.image('background','assets/images/backgroundlv.png');
		this.load.image('lvPoint','assets/images/levelPoint.png');
		this.load.image('lvPointLock','assets/images/levelPointLock.png');
		this.load.image('play','assets/images/play.png');
	},
	create: function(){
		background = game.add.sprite(0,0,'background');
		play = game.add.sprite(game.world.centerX,game.world.centerY+100,'play');

		play.inputEnabled = true;
		play.events.onInputDown.add(onState1, this);
		play.anchor.setTo(0.5);
		//initLevels();
	},
	update: function(){

	},
};


var bubblesData1 = [[0,0,0,0,1,1,2,2,2,2], 
					[0,0,0,-1,1,-1,2,2,2,-1], 
					[1,1,1,1,2,2,0,0,0,0], 
					[1,1,1,-1,2,-1,0,0,0,-1],
					[0,0,0,0,1,1,2,2,2,2], 
					[0,0,0,-1,1,-1,2,2,2,-1],
					[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
					[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
					[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
					[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
					[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
					[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
					[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]];

var bubblemainType = 0;
var isShooting = false;



function initBubbles(bubblesData) {
    bubbleInfo = {
        width: 35,
        height: 35,
        count: {
            row: 10,
            col: 10
        }
    }
    bubbles = game.add.group();
    for(c=0; c<bubbleInfo.count.col; c++) {
        for(r=0; r<bubbleInfo.count.row; r++) {
            
            var bubbleX = c * 35 + 40;
            if (r % 2) {
		        bubbleX += 35/2;
		    }
		    var bubbleY = r * 35 + 20;

		    if(bubblesData[r][c] != -1)
		    {
			    if(bubblesData[r][c] == 0)
				{
					newBubble = game.add.sprite(bubbleX, bubbleY, 'bubble1');
				}
				else if(bubblesData[r][c] == 1)
				{
					newBubble = game.add.sprite(bubbleX, bubbleY, 'bubble2');
				}
				else if(bubblesData[r][c] == 2)
				{
					newBubble = game.add.sprite(bubbleX, bubbleY, 'bubble3');
				}

	            game.physics.enable(newBubble, Phaser.Physics.ARCADE);
	            newBubble.body.immovable = true;
	            newBubble.anchor.set(0.5);
	            bubbles.add(newBubble);
	        }
        }
    }
}

var State1 = {
	preload: function(){
		this.load.image('background','assets/images/backgroundlv.png');
		this.load.image('bubble1','assets/images/bubble1.png');
		this.load.image('bubble2','assets/images/bubble2.png');
		this.load.image('bubble3','assets/images/bubble3.png');
		this.load.image('wheel','assets/images/cannon.png');
		this.load.image('youWin','assets/images/youWin.png');

	},
	create: function(){
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.checkCollision.down = false;
		background = game.add.sprite(0,0,'background');
		cannon = game.add.sprite(game.world.centerX,450,'wheel');

		bubblemain = game.add.sprite(game.world.centerX,450,'bubble1');
		game.physics.arcade.enable(bubblemain);
		bubblemain.body.collideWorldBounds = true;
		bubblemain.body.bounce.set(1);
		bubblemain.anchor.setTo(0.5);

		cannon.anchor.setTo(0.4,0.5);
		game.physics.enable(cannon, Phaser.Physics.ARCADE);

	    cannon.body.allowRotation = false;

		initBubbles(bubblesData1);
	},
	update: function(){

	    cannon.rotation = game.physics.arcade.angleToPointer(cannon);

	    if(!isShooting)
	    {
			if (game.input.activePointer.isDown)
		    {
		        game.physics.arcade.moveToPointer(bubblemain, 300);
		        isShooting = true;
		    }
	    }
	    game.physics.arcade.collide(bubblemain, bubbles, bubbleHit);

	    if(checkWin()){
	    	youWin =  game.add.sprite(game.world.centerX,game.world.centerY,'youWin');
	    	youWin.anchor.setTo(0.5);
	    }	
	    if (bubblemain.y > 500){
		    bubblemain.x = game.world.centerX;
			bubblemain.y = 450;
			bubblemain.body.velocity.x = 0;
			bubblemain.body.velocity.y = 0;
			isShooting = false;	
	    }
	},
};

function bubbleHit(bubblemain, bubble) {
	var tempx = bubblemain.x - bubble.x;
	var tempy = bubblemain.y - bubble.y;

	var tX = 0;
	var tY = 0;
	tX = (bubble.y-20)/35+1;
	if(tX % 2 != 0)
		tY = ((bubble.x-40 - 35/2)/35|0);
	else
	{
		tY = ((bubble.x-40)/35|0);
	}
	if(bubblesData1[tX][tY] != -1)
	{
		tY = tY+1;
	}
	
	console.log("x:" + tX +"y:" + tY);

	bubblesData1[tX][tY] = bubblemainType;
	
	bubblestemp = [];

	for (var i = 0; i < bubblesData1.length; i++)
	    bubblestemp[i] = bubblesData1[i].slice();

	checkCluster(tX,tY,bubblemainType,0);
	checkFloatingCluster2();
	
	bubblemain.x = game.world.centerX;
	bubblemain.y = 450;
	bubblemain.body.velocity.x = 0;
	bubblemain.body.velocity.y = 0;
	bubblemainType = getRandomInt(0,2);
	if(bubblemainType == 0)
		bubblemain.loadTexture('bubble1', 0, false);
	if(bubblemainType == 1)
		bubblemain.loadTexture('bubble2', 0, false);
	if(bubblemainType == 2)
		bubblemain.loadTexture('bubble3', 0, false);

	resetBubble();
	isShooting = false;
}

function resetBubble(){
	game.world.remove(bubbles, true);
	initBubbles(bubblesData1);
}

function onState1()
{
	game.state.start('State1');
}


game.state.add('MainState', MainState);
game.state.add('State1', State1);
game.state.start('MainState');


function checkFloatingCluster(){
	for(var i = 0; i < bubblesData1.length; i++)
	{
		var check = false;
		for(var j = 0; j < bubblesData1[i].length; j++)
		{
			if(bubblesData1[i][j] != -1)
				check = true;
			if(j == bubblesData1[i].length-1 && check == false)
			{
				for(; i <bubblesData1.length; i++)
				{
					for(var k = 0; k < bubblesData1[i].length; k++)
						bubblesData1[i][k] = -1;
				}
				resetBubble();
				return;
			}
		}
	}
}


function checkFloatingCluster2(){
	tempBubbles = [];
	for (var i = 0; i < bubblesData1.length; i++)
	    tempBubbles[i] = bubblesData1[i].slice();
	for(var i = 1; i < tempBubbles.length; i++){
		for(var j = 0; j < tempBubbles[i].length; j++)
			{
			tempBubbles = [];
			for (var k = 0; k < bubblesData1.length; k++)
			    tempBubbles[k] = bubblesData1[k].slice();
			if(!checKFCluster2(i,j))
				bubblesData1 = tempBubbles;
			}
	}

	resetBubble();
}

function checKFCluster2(x, y){
	if(x == 0)
		return true;
	if(tempBubbles[x][y] == -1)
		return false;
	if(tempBubbles[x][y] != -1)
	{
	tempBubbles[x][y] = -1;
	var c = false;
	if(x %2 == 0)
		{
			if(x>0 && y > 0)
			{
					c = c || checKFCluster2(x-1,y-1);
			}
			if(x>0)
			{
				
				{
					c = c || checKFCluster2(x-1,y);	
				}
			}
			if(x < 9 && y > 0)
			{
				
				{
					c = c || checKFCluster2(x+1,y-1);
				}
			}
			if(x < 9)
			{
				{
					c = c || checKFCluster2(x+1,y);
				}
			}
		}
		else
		{
			if(x>0)
			{
				
				{
					c = c || checKFCluster2(x-1,y);
				}
			}
			if(x>0 && y < 9)
			{
				
				{
					c = c || checKFCluster2(x-1,y+1);	
				}
			}
			if(x < 9)
			{
				
				{
					c = c || checKFCluster2(x+1,y);
				}
			}
			if(x < 9 && y < 9)
			{
				
				{
					c = c || checKFCluster2(x+1,y+1);
				}
			}
		}
		if(y > 0)
		{
			
			{
				c = c || checKFCluster2(x,y-1);
			}
		}
		if(y <9)
		{
			
			{
				c = c || checKFCluster2(x,y+1);
			}
		}
	}
	return c;
}

function checkCluster(x,y,type,count){
	console.log(count);
	if(type != -1)
	{

		if(x %2 == 0)
		{
			if(x>0 && y > 0)
			{
				if(bubblestemp[x-1][y-1] == type)
				{
					bubblestemp[x-1][y-1] = -1;
					checkCluster(x-1,y-1,type,count+1);
				}
			}
			if(x>0)
			{
				if(bubblestemp[x-1][y] == type)
				{
					bubblestemp[x-1][y] = -1;
					checkCluster(x-1,y,type,count+1);	
				}
			}
			if(x < 9 && y > 0)
			{
				if(bubblestemp[x+1][y-1] == type)
				{
					bubblestemp[x+1][y-1] = -1;
					checkCluster(x+1,y-1,type,count+1);
				}
			}
			if(x < 9)
			{
				if(bubblestemp[x+1][y] == type)
				{
					bubblestemp[x+1][y] = -1;
					checkCluster(x+1,y,type,count+1);
				}
			}
		}
		else
		{
			if(x>0)
			{
				if(bubblestemp[x-1][y] == type)
				{
					bubblestemp[x-1][y] = -1;
					checkCluster(x-1,y,type,count+1);
				}
			}
			if(x>0 && y < 9)
			{
				if(bubblestemp[x-1][y+1] == type)
				{
					bubblestemp[x-1][y+1] = -1;
					checkCluster(x-1,y+1,type,count+1);	
				}
			}
			if(x < 9)
			{
				if(bubblestemp[x+1][y] == type)
				{
					bubblestemp[x+1][y] = -1;
					checkCluster(x+1,y,type,count+1);
				}
			}
			if(x < 9 && y < 9)
			{
				if(bubblestemp[x+1][y+1] == type)
				{
					bubblestemp[x+1][y+1] = -1;
					checkCluster(x+1,y+1,type,count+1);
				}
			}
		}
		if(y > 0)
		{
			if(bubblestemp[x][y-1] == type)
			{
				bubblestemp[x][y-1] = -1;
				checkCluster(x,y-1,type,count+1);
			}
		}
		if(y <9)
		{
			if(bubblestemp[x][y+1] == type)
			{
				bubblestemp[x][y+1] = -1;
				checkCluster(x,y+1,type,count+1);
			}
		}
		
		if(count >= 3)
			bubblesData1 = bubblestemp;
	}
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkWin(){
	var check = true;
	for(var i = 0; i < bubblesData1.length; i++)
	{
		for(var j = 0; j < bubblesData1[i].length; j++)
			if(bubblesData1[i][j]!=-1)
				check = false;
	}
	return check;
}