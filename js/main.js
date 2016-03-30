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
	keyboard : undefined,
	enemyRate : 1/60,

	init : function(){
		this.game = new Phaser.Game(this.width, this.height, Phaser.CANVAS, '', { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this) });
	},

	preload : function(){
		this.game.load.image('player', 'images/wizard.png');
	    this.game.load.spritesheet('enemy', 'images/slime.png', 32, 32);
	    this.game.load.image('land', 'images/grass.png');
	    this.game.load.spritesheet('shot', 'images/fireball.png', 64, 64);
	},

	create : function(){

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

		//Creates player shots (fireballs)
		this.playerShots = this.game.add.group();
		// this.playerShots.enableBody = true;
		// this.playerShots.createMultiple(10, 'shot', 0, false);
		// this.playerShots.setAll('anchor.x', 0.5);
		// this.playerShots.setAll('anchor.y', 0.5);
		// this.playerShots.setAll('outOfBoundsKill', true);
		// this.playerShots.setAll('checkWorldBounds', true);
		for(var i=0; i<10; i++){
			var shot = this.playerShots.create(0, 0, 'shot', [0], false);
			// var shot = new Phaser.Sprite(this, 0, 0, 'shot', [0]);
			shot.anchor.setTo(0.5, 0.5);
			shot.outOfBoundsKill = true;
			shot.checkWorldBounds = true;
	    	this.game.physics.arcade.enable(shot);
			// shot.animations.add('shot', [0, 1, 2, 3, 4, 5, 6, 7]);
			shot.animations.add('shot', [32, 33, 34, 35, 36, 37, 38, 39]);
		}

		//Create player
		this.player = new Player(this, this.game, this.playerShots, this.game.world.centerX, this.game.world.centerY);
		this.game.world.add(this.player);

		//Create enemy
		this.enemies = this.game.add.group();
		for(var i=0; i<1; i++){
			this.enemies.add(new Enemy(this, this.game, this.player, this.game.world.centerX-50, this.game.world.centerY-50));
		}

		//Setup camera
		this.game.camera.follow(this.player);
		// this.game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
		// this.game.camera.deadzone = new Phaser.Rectangle(175, 175, 450, 250);
		this.game.camera.deadzone = new Phaser.Rectangle(200, 200, 400, 200);
		this.game.camera.focusOn(this.player);
	},

	update : function(){

		// this.land.tilePosition.x = -this.game.camera.x;
		// this.land.tilePosition.y = -this.game.camera.y;
		this.player.update();
		// for(var i=0; i<this.enemies.length; i++){
		// 	if(!this.enemies[i].exists) continue;
		// 	this.enemies[i].update();
			// this.game.physics.arcade.overlap(this.playerShots, this.enemies[i], this.shotHitEnemy);
		// 	this.game.physics.arcade.collide(this.player, this.enemies[i]);
		// }

		// this.game.physics.arcade.collide(this.playerShots, this.enemies, this.shotHitEnemy);
		this.game.physics.arcade.overlap(this.playerShots, this.enemies, this.shotHitEnemy);


		// for(var i=0; i<this.enemies.length; i++){
		// 	for(var j=0; j<this.playerShots.length; j++){
		// 		this.game.physics.arcade.collide(this.playerShots.getAt(i), this.enemies.getAt(j), this.shotHitEnemy);
		// 	}
		// }
		// this.game.physics.arcade.collide(this.playerShots, this.enemies, this.shotHitEnemy, null, this);
		//this.enemies.callAllExists('update', true);
		this.game.physics.arcade.collide(this.player, this.enemies);

		// if(Math.random() < this.enemyRate){
		// 			var x, y;
		// do{ //Spawn enemy off camera
		// 	x = this.game.world.randomX;
		// 	y = this.game.world.randomY;
		// }while(this.game.world.camera.view.contains(x, y));
		// 	this.enemies.add(new Enemy(this, this.game, this.player, x, y));
		// 	// var enemy = new Enemy(this, this.game, this.player, x, y);
		// 	// this.enemies.push(enemy);
		// 	// this.game.world.add(enemy);
		// }
	},

	shotHitEnemy : function(shot, enemy){
			if(shot.exists && enemy.exists){
									console.log("Hit");
					console.log(shot);
					console.log(enemy);
					shot.kill(); 
					enemy.kill();	

			} 
	}

}