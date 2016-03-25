"use strict";

window.Enemy = (function(){

	function Enemy(main, game, player, x, y){
		Phaser.Sprite.call(this, game, x, y, 'enemy');
		this.main = main;
		// this.shots = shots;
		// this.game = game;
		this.player = player;
		this.speed = 300;
		// this.fireRate = 100;
		// this.nextFire = 0;
		// this.sprite = this.game.add.sprite(x, y, 'enemy');
		// this.sprite.scale.setTo(1.5, 1.5);
    	this.game.physics.arcade.enable(this);
    	this.anchor.setTo(0.5, 0.5);
    	this.body.collideWorldBounds = true;
    	this.animations.add('enemy', [0,1]);
    	this.play('enemy', 1, true, false);
	}

	Enemy.prototype = Object.create(Phaser.Sprite.prototype);
	Enemy.prototype.constructor = Enemy;

	Enemy.prototype.update = function(){

        this.game.physics.arcade.moveToObject(this, this.player, this.speed);
	}
	return Enemy;

}());