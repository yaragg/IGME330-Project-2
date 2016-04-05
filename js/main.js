"use strict";

var app = app || {};

app.main = {
	game : undefined,
	width: 800,
	height : 600,
	land : undefined,
	player : undefined,
	playerShots : undefined,
	enemies : [],
	lives : undefined,
	STARTING_LIVES : 3,
	keyboard : undefined,
	enemyRate : 1/60,
	score : 0,
	scoreText : undefined,
	pauseText : undefined,
	gameOverText1 : undefined,
	gameOverText2 : undefined,
	titleMenu : undefined,

	init : function(){
		this.game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this) });
	},

	preload : function(){
		this.game.load.image('player', 'images/wizard.png');
		this.game.load.image('fire1', 'images/fire1.png');
		this.game.load.image('fire1s', 'images/fire1s.png');
		this.game.load.image('fire2', 'images/fire2.png');
		this.game.load.image('fire3', 'images/fire3.png');
		this.game.load.image('heart', 'images/heart.png');
		this.game.load.image('title', 'images/title_menu.png');
	    this.game.load.spritesheet('enemy', 'images/slime.png', 22, 18);
	    // this.game.load.spritesheet('enemy', 'images/slimeb.png', 44, 36);
	    this.game.load.image('land', 'images/grass.png');
	},

	create : function(){
		//Pause game if window loses focus
		this.game.onBlur.add(function(){this.pauseGame(true);}, this);

		//Start world and physics
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.world.setBounds(0, 0, 2000, 2000);

		//Create land/background
		this.land = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'land');

    	//Setup keyboard daemon
		this.keyboard = this.game.input.keyboard.createCursorKeys();
		this.keyboard.w = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.keyboard.a = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.keyboard.s = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.keyboard.d = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.keyboard.p = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
		this.keyboard.p.onDown.add(function(){this.pauseGame(!this.game.paused);}, this);

		//Creates player shots (fireballs) pool
		this.playerShots = this.game.add.group();
		for(var i=0; i<30; i++){
			this.playerShots.add(new Spell(this, this.game, 0, 0));
		}

		//Create player
		this.player = new Player(this, this.game, this.playerShots, this.game.world.centerX, this.game.world.centerY);
		this.game.world.add(this.player);

		//Create enemy pool
		this.enemies = this.game.add.group();
		for(var i=0; i<50; i++){
			this.enemies.add(new Enemy(this, this.game, this.player, 0, 0));
		}

		//Setup camera
		this.game.camera.follow(this.player);
		this.game.camera.deadzone = new Phaser.Rectangle(200, 200, 400, 200);
		this.game.camera.focusOn(this.player);

		//Setup score display
		this.scoreText = this.createText('Score: 0', this.game.width - 10, 10);
		this.scoreText.anchor.setTo(1, 0);
		//Increment score every second
		this.game.time.events.loop(Phaser.Timer.SECOND, this.incrementScore, this);

		//Setup game paused text
		this.pauseText1 = this.createText('Game paused', this.game.width/2, this.game.height/2, 54);
		this.pauseText1.visible = false;
		this.pauseText1.anchor.setTo(0.5, 0.5);

		this.pauseText2 = this.createText('Press \'p\' to unpause', this.game.width/2, this.game.height/2 + 60);
		this.pauseText2.visible = false;
		this.pauseText2.anchor.setTo(0.5, 0.5);

		//Setup game over text
		this.gameOverText1 = this.createText('Game Over', this.game.width/2, this.game.height/2, 54, null, "red");
		this.gameOverText1.visible = false;
		this.gameOverText1.anchor.setTo(0.5, 0.5);
		this.gameOverText2 = this.createText('Click to restart', this.game.width/2, this.game.height/2 + 60);
		this.gameOverText2.visible = false;
		this.gameOverText2.anchor.setTo(0.5, 0.5);

		//Setup health bar
		this.lives = this.game.add.group();
		for(var i=this.STARTING_LIVES-1; i>=0; i--){
			this.lives.create(10 + 33*i, 10, 'heart');
		}
		this.lives.setAll('fixedToCamera', true);

		//Setup title menu
		this.titleMenu = this.game.add.sprite(0, 0, 'title');
		this.titleMenu.fixedToCamera = true;
		this.game.input.onDown.addOnce(function(){ this.titleMenu.visible = false; this.game.paused = false;}, this);
		this.game.paused = true;
	},

	resetGame : function(){
		this.player.reset(this.game.world.centerX, this.game.world.centerY);
		this.game.camera.focusOn(this.player);
		this.playerShots.callAll('kill');
		this.enemies.callAll('kill');
		this.lives.callAll('revive');
		this.score = 0;
		this.gameOverText1.visible = false;
		this.gameOverText2.visible = false;
		this.game.paused = false;
		this.updateScore();
	},

	//Sets game pause state equal to argument and displays text if paused
	pauseGame : function(state){
		if(state != this.game.paused){
			this.pauseText1.visible = state;
			this.pauseText2.visible = state;
			this.game.paused = state;	
		}
	},

	//Display updated score
	updateScore : function(){
		this.scoreText.setText('Score: ' + this.score);
	},

	//Callback for the one second timer
	incrementScore : function(){
		this.score++;
		this.updateScore();
	},

	//Main loop
	update : function(){
		this.player.update();

		this.game.physics.arcade.overlap(this.playerShots, this.enemies, this.shotHitEnemy, null, this);

		this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyHitPlayer, null, this);

		//Decide whether to spawn an enemy
		if(Math.random() < this.enemyRate){
			this.spawnEnemy();
		}
	},

	//Spawns enemy at (x,y) or at a random off-screen position
	spawnEnemy : function(x, y){
		if(this.enemies.countDead() <= 0) return;
		if(!(x && y)){
			do{ //Spawn enemy off camera
				x = this.game.world.randomX;
				y = this.game.world.randomY;
			}while(this.game.world.camera.view.contains(x, y));
		}
		var enemy = this.enemies.getFirstDead();
		enemy.reset(x, y);
	},

	enemyHitPlayer : function(_player, _enemy){
		_enemy.kill();
		this.score += 3;
		this.updateScore();
		var life = this.lives.getFirstAlive();
		if(life){
			life.kill();
		}
		if(this.lives.countLiving() <= 0){
			this.gameOver();
		}
	},

	shotHitEnemy : function(_shot, _enemy){
		_shot.kill();
		this.score += 3;
		this.updateScore();
		_enemy.kill();	
	},

	gameOver : function(){
		this.gameOverText1.visible = true;
		this.gameOverText2.visible = true;
		this.game.input.onDown.addOnce(this.resetGame, this);
		this.game.paused = true;
	},

	createText : function(string, x, y, size, font, fill){
			var text = this.game.add.text(x, y, string);
			text.font = font || "Verdana";
			text.fill = fill || "white";
			text.fontSize = size || 24;
			text.fixedToCamera = true;
			return text;
	}

}