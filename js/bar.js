"use strict";

window.Bar = (function(){

	function Bar(game, x, y){
		// Phaser.Sprite.call(this, game, x, y);
		this.x = x;
		this.y = y;
		this.game = game;
		this.current = 100;
		// this.main = main;
		this.barBg = this.game.add.sprite(x, y, 'manaBar_empty');
		this.barConsume = this.game.add.sprite(x, y, 'manaBar_consume');
		this.barFill = this.game.add.sprite(x, y, 'manaBar');
		this.cropFill = new Phaser.Rectangle(x, y, this.barFill.width, this.barFill.height);

		this.barBg.fixedToCamera = true;
		this.barConsume.fixedToCamera = true;
		this.barFill.fixedToCamera = true;

		this.barBg.bringToTop();
		this.barConsume.bringToTop();
		this.barFill.bringToTop();

	}

	// Bar.prototype = Object.create(Phaser.Sprite.prototype);
	// Bar.prototype.constructor = Bar;

	Bar.prototype.updateValue = function(value){
		this.current += value;
		if(this.tweenFill && this.tweenFill.isRunning) this.tweenFill.stop();
		this.tweenFill = this.game.add.tween(this.barFill).to({width: this.current}, 100, "Linear", true);
		if(this.tweenConsume && this.tweenConsume.isRunning) this.tweenConsume.stop();
		this.tweenConsume = this.game.add.tween(this.barConsume).to({width: this.current}, 500, "Linear", true, 500);
	}
	return Bar;

}());