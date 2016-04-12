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
	manaSpawnRate : 1/80,
	pickupLifespan : 10000, //10 seconds
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
		this.game.load.image('manaBar', 'images/manaBar.png');
		this.game.load.image('manaBar_empty', 'images/manaBar_empty.png');
		this.game.load.image('manaBar_consume', 'images/manaBar_consume.png');
		this.game.load.image('manaPickup', 'images/manaPickup.png');
		this.game.load.image('title', 'images/title_menu.png');
	    this.game.load.spritesheet('enemy', 'images/slime.png', 22, 18);
	    this.game.load.image('land', 'images/grass.png');
	    // this.game.load.audio('title', ['media/Spanish Theme_edited.mp3', 'media/Spanish Theme_edited.ogg']);
	    this.game.load.audio('gameplay', 'media/The Realm of Battle (Conquer).mp3');
	    this.game.load.audio('magicDart', 'media/magicDart.mp3');
	    this.game.load.audio('mindBlast', 'media/mindBlast.mp3');
	    this.game.load.audio('magicFail', 'media/magicFail.mp3');
	    this.game.load.audio('blobDefeat', 'media/blobDefeat.mp3');
	    this.game.load.audio('manaPickup', 'media/manaPickup.mp3');
	    this.game.load.audio('damage', 'media/damage.mp3');
	    this.game.load.audio('death', 'media/death.mp3');


	    // this.game.load.audio('gameover', ['media/The Realm of Battle (Regret)_edited.mp3', 'media/The Realm of Battle (Regret)_edited.ogg']);


	    //Force the game to load the webfonts earlier
		var temp = this.createText('Temp', this.game.width + 100, 10);
		temp = this.createText('Temp', this.game.width + 100, 10, 24, "Gondola SD");
	},

	create : function(){
		//Pause game if window loses focus
		this.game.onBlur.add(function(){this.pauseGame(true);}, this);

		this.game.input.mouse.capture = true;

		//Add BGM and SFX
		// this.titleSong = this.game.add.audio('title');
		this.blobSound = this.game.add.audio('blobDefeat');
		this.playerDamage = this.game.add.audio('damage');
		this.playerDeath = this.game.add.audio('death');
		this.manaSound = this.game.add.audio('manaPickup');
		this.gameplaySong = this.game.add.audio('gameplay');

		// this.gameoverSong = this.game.add.audio('gameover');

		this.gameplaySong.loopFull(0.3);


		//Start world and physics
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.world.setBounds(0, 0, 2000, 2000);

		//Create land/background
		this.land = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'land');

    	//Setup keyboard daemon
		this.keyboard = this.game.input.keyboard.createCursorKeys();
		this.keyboard.w = this.game.input.keyboard.addKey(Phaser.KeyCode.W);
		this.keyboard.a = this.game.input.keyboard.addKey(Phaser.KeyCode.A);
		this.keyboard.s = this.game.input.keyboard.addKey(Phaser.KeyCode.S);
		this.keyboard.d = this.game.input.keyboard.addKey(Phaser.KeyCode.D);
		this.keyboard.p = this.game.input.keyboard.addKey(Phaser.KeyCode.P);
		this.keyboard.p.onDown.add(function(){this.pauseGame(!this.game.paused);}, this);
		this.keyboard.shift = this.game.input.keyboard.addKey(Phaser.KeyCode.SHIFT);

		//Create player
		this.player = new Player(this, this.game, this.playerShots, this.game.world.centerX, this.game.world.centerY);
		this.game.world.add(this.player);

		//Setups player mana regeneration
		this.game.time.events.loop(Phaser.Timer.SECOND, function(){ this.player.updateMana(this.player.manaRegenRate);}, this);

		//Create enemy pool
		this.enemies = this.game.add.group();
		for(var i=0; i<50; i++){
			this.enemies.add(new Enemy(this, this.game, this.player, 0, 0));
		}

		this.manaPickups = this.game.add.group();
		this.manaPickups.enableBody = true;
		this.manaPickups.createMultiple(20, 'manaPickup');
		this.manaPickups.callAll('kill');

		//Setup camera
		this.game.camera.follow(this.player);
		this.game.camera.deadzone = new Phaser.Rectangle(200, 200, 400, 200);
		this.game.camera.focusOn(this.player);

		//Setup score display
		this.scoreText = this.createText('Score: 0', this.game.width - 10, 10, 48);
		this.scoreText.anchor.setTo(1, 0);
		//Increment score every second
		this.game.time.events.loop(Phaser.Timer.SECOND, this.incrementScore, this);

		//Setup game paused text
		this.pauseText1 = this.createText('Game paused', this.game.width/2, this.game.height/2, 60, "Gondola SD");
		this.pauseText1.visible = false;
		this.pauseText1.anchor.setTo(0.5, 0.5);

		this.pauseText2 = this.createText('Press \'p\' to unpause', this.game.width/2, this.game.height/2 + 80);
		this.pauseText2.visible = false;
		this.pauseText2.anchor.setTo(0.5, 0.5);

		//Setup game over text
		this.gameOverText1 = this.createText('Game Over', this.game.width/2, this.game.height/2, 68, "Gondola SD", "red");
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
		this.gameplaySong.loopFull();
		this.player.reset(this.game.world.centerX, this.game.world.centerY);
		this.player.resetGame();
		this.game.camera.focusOn(this.player);
		// this.playerShots.callAll('kill');
		this.enemies.callAll('kill');
		this.manaPickups.callAll('kill');
		this.lives.callAll('revive');
		this.score = 0;
		this.player.mana = this.player.maxMana;
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

		//Check player and enemy collision
		this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyHitPlayer, this.isEnemyDead, this);

		//Check if player picked up a mana essence
		this.game.physics.arcade.overlap(this.player, this.manaPickups, this.playerPickedMana, null, this);

		//Decide whether to spawn an enemy
		if(Math.random() < this.enemyRate){
			this.spawnEnemy();
		}

		if(Math.random() < this.manaSpawnRate){
			this.spawnPickup();
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
		enemy.alpha = 1;
		enemy.reset(x, y);
	},

	//Spawns pickup at (x,y) or at a random position
	spawnPickup : function(x, y){
		if(this.manaPickups.countDead() <= 0) return;
		if(!(x && y)){
				x = this.game.world.randomX;
				y = this.game.world.randomY;
		}
		var pickup = this.manaPickups.getFirstDead();
		pickup.reset(x, y);
		pickup.lifespan = this.pickupLifespan;
	},

	isEnemyDead : function(_player, _enemy){
		return _enemy.alive;
	},

	enemyHitPlayer : function(_player, _enemy){
		_enemy.kill();
		this.score += 3;
		this.updateScore();
		var life = this.lives.getFirstAlive();
		if(life){
			this.playerDamage.play();
			life.kill();
		}
		if(this.lives.countLiving() <= 0){
			this.playerDeath.play();
			this.gameOver();
		}
	},

	shotHitEnemy : function(_shot, _enemy){
		_enemy.fadeout();
		_shot.kill();
		this.score += 3;
		this.updateScore();
		// _enemy.kill();	
	},

	playerPickedMana : function(_player, _manaPickup){
		this.manaSound.play();
		_manaPickup.kill();
		this.player.updateMana(10);
	},

	gameOver : function(){
		this.gameOverText1.visible = true;
		this.gameOverText2.visible = true;
		this.game.input.onDown.addOnce(this.resetGame, this);
		this.game.paused = true;
	},

	createText : function(string, x, y, size, font, fill){
			var text = this.game.add.text(x, y, string);
			text.font = font || "Gothic Ultra";
			text.fill = fill || "white";
			text.fontSize = size || 44;
			text.fixedToCamera = true;
			return text;
	}

}