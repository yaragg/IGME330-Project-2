"use strict";

var app = app || {};

app.main = {
	game : undefined,
	land : undefined,
	player : undefined,
	enemies : undefined,
	keyboard : undefined,

	init : function(){
		this.game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this) });
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
		this.game.world.setBounds(-1000, -1000, 2000, 2000);

		//Create land/background
		this.land = this.game.add.tileSprite(0, 0, 800, 600, 'land');
		this.land.fixedToCamera = true;

		//Create player
		this.player = new app.player.Player(this.game, 0, 0);

    	//Setup keyboard daemon
		this.keyboard = this.game.input.keyboard.createCursorKeys();
		this.keyboard.w = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.keyboard.a = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.keyboard.s = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.keyboard.d = this.game.input.keyboard.addKey(Phaser.Keyboard.D);


	},

	update : function(){
		this.player.update();


	}


}