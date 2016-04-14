"use strict";

window.Bar = (function(){

	function Bar(game, x, y){
		this.x = x;
		this.y = y;
		this.game = game;
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

	Bar.prototype.updateValue = function(value){
		if(this.tweenFill && this.tweenFill.isRunning) this.tweenFill.stop();
		this.tweenFill = this.game.add.tween(this.barFill).to({width: value}, 100, "Linear", true);
		if(this.tweenConsume && this.tweenConsume.isRunning) this.tweenConsume.stop();
		this.tweenConsume = this.game.add.tween(this.barConsume).to({width: value}, 500, "Linear", true, 500);
	}
	return Bar;

}());