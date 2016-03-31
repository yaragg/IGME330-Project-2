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

	init : function(){
		this.game = new Phaser.Game(this.width, this.height, Phaser.CANVAS, '', { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this) });
	},

	preload : function(){
		this.game.load.image('player', 'images/wizard.png');
		this.game.load.image('fire1', 'images/fire1.png');
		this.game.load.image('fire1s', 'images/fire1s.png');
		this.game.load.image('fire2', 'images/fire2.png');
		this.game.load.image('fire3', 'images/fire3.png');
		this.game.load.image('heart', 'images/heart.png');
	    this.game.load.spritesheet('enemy', 'images/slime.png', 22, 18);
	    // this.game.load.spritesheet('enemy', 'images/slimeb.png', 44, 36);
	    this.game.load.image('land', 'images/grass.png');
	    this.game.load.spritesheet('shot', 'images/fireball.png', 63, 18);
	},

	create : function(){

		this.game.onBlur.add(function(){this.pauseGame(true);}, this);
		// this.game.onFocus.add(function(){this.pauseGame(false);}, this);
		// this.game.stage.disableVisibilityChange = true;
		//Start world and physics
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
		// this.game.world.setBounds(-1000, -1000, 2000, 2000);
		this.game.world.setBounds(0, 0, 2000, 2000);

		//Create land/background
		this.land = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'land');
		// this.land.fixedToCamera = true;

    	//Setup keyboard daemon
		this.keyboard = this.game.input.keyboard.createCursorKeys();
		this.keyboard.w = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.keyboard.a = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.keyboard.s = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.keyboard.d = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.keyboard.p = this.game.input.keyboard.addKey(Phaser.Keyboard.P);

		this.keyboard.p.onDown.add(function(){this.pauseGame(!this.game.paused);}, this);

		//Creates player shots (fireballs)
		this.playerShots = this.game.add.group();
		// this.playerShots.enableBody = true;
		// this.playerShots.createMultiple(10, 'shot', 0, false);
		// this.playerShots.setAll('anchor.x', 0.5);
		// this.playerShots.setAll('anchor.y', 0.5);
		// this.playerShots.setAll('outOfBoundsKill', true);
		// this.playerShots.setAll('checkWorldBounds', true);
		for(var i=0; i<10; i++){
			// var shot = this.playerShots.create(0, 0, 'shot', [0], false);
			// // var shot = new Phaser.Sprite(this, 0, 0, 'shot', [0]);
			// shot.anchor.setTo(0.5, 0.5);
			// shot.outOfBoundsKill = true;
			// shot.checkWorldBounds = true;
	    	// this.game.physics.arcade.enable(shot);
			// // shot.animations.add('shot', [0, 1, 2, 3, 4, 5, 6, 7]);
			// shot.animations.add('shot', [32, 33, 34, 35, 36, 37, 38, 39]);
			this.playerShots.add(new Spell(this, this.game, 0, 0));
		}

		//Create player
		this.player = new Player(this, this.game, this.playerShots, this.game.world.centerX, this.game.world.centerY);
		this.game.world.add(this.player);

		//Create enemy
		this.enemies = this.game.add.group();
		// for(var i=0; i<1; i++){
		// 	this.enemies.add(new Enemy(this, this.game, this.player, this.game.world.centerX-50, this.game.world.centerY-50));
		// }

		//Setup camera
		this.game.camera.follow(this.player);
		// this.game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
		// this.game.camera.deadzone = new Phaser.Rectangle(175, 175, 450, 250);
		this.game.camera.deadzone = new Phaser.Rectangle(200, 200, 400, 200);
		this.game.camera.focusOn(this.player);

		this.scoreText = this.createText('Score: 0', this.game.width - 10, 10);
		this.scoreText.anchor.setTo(1, 0);
		this.game.time.events.loop(Phaser.Timer.SECOND, this.incrementScore, this);


		this.pauseText1 = this.createText('Game paused', this.game.width/2, this.game.height/2, 54);
		this.pauseText1.visible = false;
		this.pauseText1.anchor.setTo(0.5, 0.5);


		this.pauseText2 = this.createText('Press \'p\' to unpause', this.game.width/2, this.game.height/2 + 60);
		this.pauseText2.visible = false;
		this.pauseText2.anchor.setTo(0.5, 0.5);

		this.lives = this.game.add.group();
		for(var i=this.STARTING_LIVES-1; i>=0; i--){
			this.lives.create(10 + 33*i, 10, 'heart');
		}
		this.lives.setAll('fixedToCamera', true);

	},

	pauseGame : function(state){
		this.pauseText1.visible = state;
		this.pauseText2.visible = state;
		this.game.paused = state;
	},

	updateScore : function(){
		this.scoreText.setText('Score: ' + this.score);
	},

	incrementScore : function(){
		this.score++;
		this.updateScore();
	},

	update : function(){

		// this.land.tilePosition.x = -this.game.camera.x;
		// this.land.tilePosition.y = -this.game.camera.y;
		this.player.update();
		// for(var i=0; i<this.playerShots.length; i++) this.playerShots.getAt(i).position = this.playerShots.getAt(i).body.position;
		// for(var i=0; i<this.enemies.length; i++) this.enemies.getAt(i).position = this.enemies.getAt(i).body.position;

// for(var i=0; i<this.playerShots.length; i++) this.playerShots.getAt(i).body.position = this.playerShots.getAt(i).position;
// 		for(var i=0; i<this.enemies.length; i++) this.enemies.getAt(i).body.position = this.enemies.getAt(i).position;


		// for(var i=0; i<this.enemies.length; i++){
		// 	if(!this.enemies[i].exists) continue;
		// 	this.enemies[i].update();
			// this.game.physics.arcade.overlap(this.playerShots, this.enemies[i], this.shotHitEnemy);
		// 	this.game.physics.arcade.collide(this.player, this.enemies[i]);
		// }

		// this.game.physics.arcade.collide(this.playerShots, this.enemies, this.shotHitEnemy);
		this.game.physics.arcade.overlap(this.playerShots, this.enemies, this.shotHitEnemy, null, this);

		this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyHitPlayer, null, this);


		// for(var i=0; i<this.enemies.length; i++){
		// 	for(var j=0; j<this.playerShots.length; j++){
		// 		this.game.physics.arcade.collide(this.playerShots.getAt(i), this.enemies.getAt(j), this.shotHitEnemy);
		// 	}
		// }
		// this.game.physics.arcade.collide(this.playerShots, this.enemies, this.shotHitEnemy, null, this);
		//this.enemies.callAllExists('update', true);
		// this.game.physics.arcade.collide(this.player, this.enemies);

		if(Math.random() < this.enemyRate){
			var x, y;
			do{ //Spawn enemy off camera
				x = this.game.world.randomX;
				y = this.game.world.randomY;
			}while(this.game.world.camera.view.contains(x, y));
			this.enemies.add(new Enemy(this, this.game, this.player, x, y));
			// var enemy = new Enemy(this, this.game, this.player, x, y);
			// this.enemies.push(enemy);
			// this.game.world.add(enemy);
		}
		// this.scoreText.
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
			//GAME OVER
			this.createText('Game Over', this.game.width/2, this.game.height/2);
		}
	},

	shotHitEnemy : function(_shot, _enemy){
			// if(_shot.exists && _enemy.exists){
									console.log("Hit");
					console.log(_shot);
					console.log(_enemy);
					_shot.kill();
					this.score += 3;
					this.updateScore();
					_enemy.kill();	
			// } 
	},

	createText : function(string, x, y, size){
			var text = this.game.add.text(x, y, string);
			text.font = "Verdana";
			text.fill = "white";
			text.fontSize = size || 24;
			text.fixedToCamera = true;
			return text;
	}

}