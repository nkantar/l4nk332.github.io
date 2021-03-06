"use strict";

var GistViewer = function GistViewer() {
	this.gists = ["c65b635e4d431cc457f1e6eb9ac5ceaa", "7dca59b74df10bf94f554a06a9467558", "0e5231ff9e4be67216096657d322103a", "349269e216e0f4ba1699290b026e5225", "1d98dcbcf5553a7cb0b54a5a94df2592", "4088fffbe96cb8ea7d669b2664936bf1", "db96318fa3c02f4e93f91da4e617221c", "23114027d8c4c2dd1c50dd06ac944d2c"];
	this.currentGist = this.gists[0];
	this.leftArrow = document.getElementById("left-arrow");
	this.rightArrow = document.getElementById("right-arrow");
};

GistViewer.prototype.previous = function () {
	var currentIdx = this.gists.indexOf(this.currentGist);
	if (currentIdx === 0) {
		this.currentGist = this.gists[this.gists.length - 1];
	} else {
		this.currentGist = this.gists[currentIdx - 1];
	}
	this.renderView();
};

GistViewer.prototype.next = function () {
	var currentIdx = this.gists.indexOf(this.currentGist);
	if (currentIdx === this.gists.length - 1) {
		this.currentGist = this.gists[0];
	} else {
		this.currentGist = this.gists[currentIdx + 1];
	}
	this.renderView();
};

GistViewer.prototype.renderView = function () {
	var gistElmts = $(".gist-embed");
	var newGist = undefined;
	for (var i = 0; i < gistElmts.length; i++) {
		var gistId = gistElmts[i].getAttribute("data-gist-id");
		if (gistId === this.currentGist) {
			newGist = gistElmts[i];
		}
	}
	var oldGist = $(".current-gist");
	oldGist.removeClass("current-gist");
	$(newGist).addClass("current-gist");
};

var gistViewer = new GistViewer();

$(".left").on("click", function (event) {
	event.preventDefault();
	gistViewer.previous();
});

$(".right").on("click", function (event) {
	event.preventDefault();
	gistViewer.next();
});

// Cipher
function generateCipher(list, length) {
	var cipher = "";
	for (var i = 0; i < length; i++) {
		var randomIdx = Math.floor(Math.random() * list.length);
		cipher += list[randomIdx];
	}
	return cipher;
}

function render() {
	var charList = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " ", "-", "_", "^", "+", "=", "%", "#", "@", "!", "~", "?"];

	var decryptStr = "Full-Stack Developer";
	var time = new Date().getTime();
	var delta = undefined;
	function decrypt() {
		var delta = new Date().getTime() - time;
		if (delta >= 80) {
			$(".cipher").text(generateCipher(charList, decryptStr.length));
			time = new Date().getTime();
		}
		animFrame = window.requestAnimationFrame(decrypt);
	}
	var animFrame = window.requestAnimationFrame(decrypt);
	setTimeout(function () {
		window.cancelAnimationFrame(animFrame);
		$(".cipher").text(decryptStr);
	}, 2500);
}

render();

// Scroll to header
$("#down").click(function () {
	$('html,body').animate({
		scrollTop: $("#projects").offset().top }, 'slow');
});

/* Particle Animation */

var Space = function Space(cnvEltId) {
	var section = $(".landing-section");
	this.canvas = document.getElementById(cnvEltId);
	//this.canvas.width = section.width();
	this.canvas.height = section.height();
	this.canvas.width = screen.width;
	//this.canvas.height = screen.height;
	this.ctx = this.canvas.getContext("2d");
	this.particles = [];
};

Space.prototype.addParticle = function (particle) {
	this.particles.push(particle);
};

Space.prototype.fill = function (amount) {
	for (var i = 0; i < amount; i++) {
		var size = 2;
		var xPos = this.random(this.canvas.width);
		var yPos = this.random(this.canvas.height);
		var xVel = Math.min(this.random(5), 1);
		var yVel = Math.min(this.random(5), 1);
		var particle = new Particle(size, xPos, yPos, xVel, yVel);
		this.addParticle(particle);
	}
};

Space.prototype.random = function (max) {
	return Math.floor(Math.random() * max) + 1;
};

Space.prototype.clear = function () {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.ctx.fillStyle = "#FAFFFD";
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

Space.prototype.render = function () {
	this.clear();
	for (var i = 0; i < this.particles.length; i++) {
		var link = this.particles[i].findLink(this.particles);
		if (link) {
			this.particles[i].link(this.ctx, link);
		}
		var particle = this.particles[i];
		this.checkPos(particle);
		particle.render(this.ctx);
		particle.drift();
	}
	window.requestAnimationFrame(this.render.bind(this));
};

Space.prototype.checkPos = function (particle) {
	if (particle.xPos + particle.size * 2 > this.canvas.width || particle.xPos - particle.size * 2 < 0) {
		particle.xVel *= -1;
	}
	if (particle.yPos + particle.size * 2 > this.canvas.height || particle.yPos - particle.size * 2 < 0) {
		particle.yVel *= -1;
	}
};

var Particle = function Particle(size, xPos, yPos, xVel, yVel) {
	this.size = size;
	this.xPos = xPos;
	this.yPos = yPos;
	this.xVel = xVel;
	this.yVel = yVel;
	this.xDir = this.getDir("x");
	this.yDir = this.getDir("y");
	this.opacity = 0;
	this.links = [];
};

Particle.prototype.getDir = function (axis) {
	var idx = Math.floor(Math.random() * 2);
	var directions = undefined;
	if (axis === "x") {
		directions = ["left", "right"];
	}
	if (axis === "y") {
		directions = ["up", "down"];
	}
	return directions[idx];
};

Particle.prototype.drift = function () {
	if (this.xDir === "right") {
		this.xPos += this.xVel;
	}
	if (this.xDir === "left") {
		this.xPos -= this.xVel;
	}
	if (this.yDir === "down") {
		this.yPos += this.yVel;
	}
	if (this.yDir === "up") {
		this.yPos -= this.yVel;
	}
};

Particle.prototype.resetPos = function (canvasW, canvasH) {
	this.xPos = Math.floor(Math.random() * canvasW);
	this.yPos = Math.floor(Math.random() * canvasH);
};

Particle.prototype.render = function (ctx) {
	ctx.fillStyle = "rgba(100, 100, 100, 0.3)";
	ctx.beginPath();
	ctx.moveTo(this.xPos, this.yPos);
	ctx.arc(this.xPos, this.yPos, this.size * 2, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();

	ctx.fillStyle = "rgba(50, 50, 50, 0.5)";
	ctx.beginPath();
	ctx.arc(this.xPos, this.yPos, this.size, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
};

Particle.prototype.getDistance = function (particle) {
	var xDistance = Math.abs(this.xPos - particle.xPos);
	var yDistance = Math.abs(this.yPos - particle.yPos);
	return { x: xDistance, y: yDistance };
};

Particle.prototype.findLink = function (particles) {
	var _this = this;

	var neighbors = particles.filter(function (particle) {
		if (particle !== _this) {
			var xDistance = _this.getDistance(particle).x;
			var yDistance = _this.getDistance(particle).y;
			return xDistance < 100 && yDistance < 100;
		}
	});
	return neighbors[Math.floor(Math.random() * neighbors.length)];
};

Particle.prototype.link = function (ctx, particle) {
	var xDistance = this.getDistance(particle).x;
	var yDistance = this.getDistance(particle).y;
	if (xDistance < 100 && yDistance < 100) {
		ctx.strokeStyle = "rgba(69, 72, 81, 0.3)";
		ctx.beginPath();
		ctx.moveTo(this.xPos, this.yPos);
		ctx.lineTo(particle.xPos, particle.yPos);
		ctx.stroke();
	}
};

var mq = window.matchMedia("(max-device-width: 1024px)");

if (!mq.matches) {
	var space = new Space("canvas");
	space.ctx.fillStyle = "#FAFFFD";
	space.ctx.fill();
	space.fill(80);
	window.requestAnimationFrame(space.render.bind(space));
}