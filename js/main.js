"use strict";

var app = app || {};

app.main = {
	game : undefined,
	width: 800,
	height : 600,
	land : undefined,
	player : undefined,
	enemies : undefined,
	keyboard : undefined,

	init : function(){
		this.game = new Phaser.Game(this.width, this.height, Phaser.CANVAS, '', { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this) });
	},

	preload : function(){
		this.game.load.image('player', 'images/wizard.png');
	    this.game.load.image('enemy', 'images/slime.png');
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

		//Create player
		this.player = new Player(this.game, this.game.world.centerX, this.game.world.centerY);

		//Setup camera
		this.game.camera.follow(this.player.sprite);
		// this.game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
		// this.game.camera.deadzone = new Phaser.Rectangle(175, 175, 450, 250);
		this.game.camera.deadzone = new Phaser.Rectangle(200, 200, 400, 200);
		this.game.camera.focusOn(this.player.sprite);


    	//Setup keyboard daemon
		this.keyboard = this.game.input.keyboard.createCursorKeys();
		this.keyboard.w = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.keyboard.a = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.keyboard.s = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.keyboard.d = this.game.input.keyboard.addKey(Phaser.Keyboard.D);


	},

	update : function(){

		// this.land.tilePosition.x = -this.game.camera.x;
		// this.land.tilePosition.y = -this.game.camera.y;
		this.player.update();


	}


}