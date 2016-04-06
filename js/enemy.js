"use strict";

window.Enemy = (function(){

	function Enemy(main, game, player, x, y){
		Phaser.Sprite.call(this, game, x, y, 'enemy');
		this.main = main;
		this.player = player;
		this.speed = 200;
		this.health = 1;
    	this.game.physics.arcade.enable(this);
    	this.body.collideWorldBounds = true;
    	this.animations.add('enemy', [0,1]);
    	this.play('enemy', 1, true, false);
    	this.kill();
	}

	Enemy.prototype = Object.create(Phaser.Sprite.prototype);
	Enemy.prototype.constructor = Enemy;

	Enemy.prototype.update = function(){
		//Move towards player
        if(this.alive) this.game.physics.arcade.moveToObject(this, this.player, this.speed);
        else this.body.velocity = new Phaser.Point(0, 0);
	}

	Enemy.prototype.fadeout = function(){
		this.alive = false; //Stop it from moving
		//Kills the sprite after it finishes fading out
		this.game.add.tween(this).to({alpha: 0}, 500, "Linear", true).onComplete.add(this.kill, this);
	}

	return Enemy;

}());