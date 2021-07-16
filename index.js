(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"index_atlas_1", frames: [[703,620,177,38],[882,659,179,31],[1604,510,170,55],[0,602,173,46],[1497,567,173,47],[1775,392,169,58],[1775,452,170,56],[1776,566,172,49],[351,602,174,44],[1322,566,173,49],[1851,617,176,40],[1148,566,172,51],[1497,616,175,42],[1604,339,169,59],[175,602,174,45],[351,648,178,35],[1674,617,175,41],[1829,255,168,61],[0,650,178,35],[802,566,171,52],[1148,619,176,39],[1776,510,171,54],[975,566,171,52],[882,620,177,37],[527,602,174,44],[1604,400,169,57],[802,0,800,564],[1947,392,97,75],[1604,255,223,82],[1604,459,116,40],[1829,318,140,72],[0,0,800,600],[1604,0,420,253],[1999,255,39,35],[1971,318,50,50]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.BMP_0b13ddaf_c604_410a_bacb_3cb28a5a40f2 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.BMP_0c46fc9f_b309_4ccd_9f10_b830c693c896 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.BMP_182be8d3_94f4_4160_be10_f5444402de54 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.BMP_3a9cfc9e_b735_4faa_a48b_3684a1807e94 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.BMP_3cc7834e_27ec_4c17_9743_8800b1eb72d6 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.BMP_3ed65831_9417_414c_bf26_5c10883d643c = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.BMP_42acd71a_f5fc_43c5_9975_ab2393707568 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.BMP_48c4cc07_5c8a_4f8c_a83c_51a359b6dd84 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.BMP_48f8bf6e_25b1_4f27_82c0_ccdf4a9a1313 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.BMP_4f0c6522_bb55_4084_a19c_03209beaa69d = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.BMP_5102747d_5fb9_44c4_ac94_0037cd1b1544 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.BMP_6a90a388_65ec_4b4c_9d91_29488b9798dc = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.BMP_7a5c4138_4f0a_44c4_a3a4_9857433577eb = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.BMP_92ee2af0_54dd_4c90_a6d5_3b9abb70e582 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.BMP_976b9480_4948_4e4d_8dd5_1a99af3687fb = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.BMP_9a82127c_b51e_43c4_afc5_8ceb486fbfe9 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.BMP_ac39cced_fd7b_4d8c_99a7_07f3352b4b05 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.BMP_bb74bcbf_ea2d_4be3_85e1_b1f5d9ec9c60 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.BMP_c987da27_aff5_4c85_9602_cd287a713f28 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.BMP_cbdf7207_63f6_40e4_a943_2b86852c336b = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.BMP_cc410b96_7ddc_4bb8_8188_fa3dffdf06b1 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.BMP_d9087c9c_8350_43c6_ba6b_ff1d02eaf6b2 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.BMP_ecb5abbc_cec1_4fe2_a88e_718e2cdd7b56 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.BMP_f518a85d_18db_4df6_b97f_5193f90efc7f = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.BMP_f9577213_c399_42eb_a383_528bbbda0e56 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.BMP_ff37a1c5_51fa_4a61_8ee0_6a69a0b89bf9 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.Capa2 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.Capa3 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.Elipse1 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.Elipse3 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.Elipse3copia2 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.Rectángulo2 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.Rectángulo3copia3 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.Triángulo1copia = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.Triángulo1 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.WarpedAsset_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.BMP_0c46fc9f_b309_4ccd_9f10_b830c693c896();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,179,31);


(lib.Símbolo8 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#D5B479").s().p("AgzBMQgagGgNgSQgBAAAAAAQAAAAAAAAQAAAAAAAAQAAgBAAAAIgBgCIgDgEIgBgBIACgBIABgBQgBAAAAAAQAAgBAAAAQAAgBAAAAQABgBAAgBIAEgEIASgIIABgBIAHgDIAQgJIALgEIANgIIAKgEIASgKQAIgEAKgCIAcgHIAMgHIgFABIgNABQgmANgXAMIgKAEIgZAJIABgGQAAgMAMgKIAAAAIAAgBQgBgCADgEQAIgMAIgFIADgDQgFAAgGADQgKAEgHALQgJAOgDATQgCAGAEABIgQAGQgLADgFADIgFAEIgIAEQgBgGADgFQAUg+AzgZQAjgPAsAKQADgCAFAAQAQAAAdAMQAFACABADQAEADAAAGQAAAIgFACIAAAEQAAAFgCAHQgJAZgIALIgDAGQgBADgCAEQgGAKgSAMIgMAIIgBABQgDAFgEgCQgJAFgHABQgaAMgbAAQgMAAgLgCgAgmALQgEAFAJADQAUAJAIACQAJABALgBQAhgDAVgSQgPAHgJABQgGABgEAAIgDgBIgHACQgcAGgZgOIgHgCQgBAAAAAAQgBAAAAABQgBAAAAAAQAAAAAAABgABJgnIAAABIADgCIgDABgAhyA4QAFgHAHgFQAAABAAAAQABAAAAAAQABAAAAAAQAAAAABAAIAAAAIgKAHIgFAFIAAgBg");
	this.shape.setTransform(14,7.7597);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#BF7B58").s().p("AhnAxIgDgDIgBgDIAAgBQgCgFAIgDIAPgGIACgBIAFgDIAHgCIABgBIADgCIAHgEIAGgDQAFgDALgDIAPgGQgDgBABgFQAEgUAJgOQAHgLAIgEQAHgDAFAAIgEACQgHAFgIANQgCADAAADIABAAIgBAAQgLALAAANIgBAGIAYgLIAKgEQAYgMAmgMIANgBIAFgBIgMAHIgcAGQgLADgHADIgTALIgKAEIgMAIIgMADIgQAKIgGACIgBABIgSAJIgEAEQgBAAAAABQAAAAAAABQAAAAAAABQAAAAAAABIAAAAIgCABIgDABQgBAAAAAAQgBAAAAAAQAAAAgBAAQAAAAgBAAQgGAFgFAHIAAABQACAEgBACQAAAEgHACQgHgDgIgHgAAaATQgJgCgSgIQgJgEADgFQACgCAHACQAZAOAdgFIAHgCIADAAQAFABAGgCQAJgBAOgFQgUAQghAEIgJAAIgMgBgABpgyIADgBIgDACIAAgBg");
	this.shape_1.setTransform(10.8125,8.825);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo8, new cjs.Rectangle(0,0,25.5,15.6), null);


(lib.Símbolo7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.Triángulo1();
	this.instance.setTransform(0,0,1.0004,1,0,0,1.4684);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo7, new cjs.Rectangle(0,0,50,51.3), null);


(lib.Símbolo4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.Elipse1();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo4, new cjs.Rectangle(0,0,223,82), null);


(lib.Símbolo2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.text = new cjs.Text("Un mundo de pausas", "bold 69px 'Life Savers'");
	this.text.textAlign = "center";
	this.text.lineHeight = 86;
	this.text.lineWidth = 507;
	this.text.parent = this;
	this.text.setTransform(255.45,2);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo2, new cjs.Rectangle(0,0,511,177.1), null);


(lib.play = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AiVjHIEqDHIkqDHg");
	this.shape.setTransform(14.95,19.95);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.play, new cjs.Rectangle(0,0,29.9,39.9), null);


(lib.pausa = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AAyC+IAAl7IBaAAIAAF7gAiLC+IAAl7IBaAAIAAF7g");
	this.shape.setTransform(15.5,19.025);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.pausa, new cjs.Rectangle(1.5,0,28,38.1), null);


(lib.Símbolo1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.Rectángulo3copia3();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo1, new cjs.Rectangle(0,0,420,253), null);


(lib.simbolo_titulo = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {labelTitulo:0,labelTituloFin:77};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		var root = this;
		var i = 0;
		var speed = 70;
		var txt = String(this.tituloIn.text.text);
		this.tituloIn.text.text= "";
		
		function typeWriter() {
		  if (i < txt.length) {
		    root.tituloIn.text.text += txt.charAt(i);
		    i++;
		    setTimeout(typeWriter, speed);
		  }
		}
		
		typeWriter();
	}
	this.frame_77 = function() {
		this.stop();
		this.playTitulo
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(77).call(this.frame_77).wait(3));

	// play_capa
	this.instance = new lib.play();
	this.instance.setTransform(273.05,309.95,1,1,0,0,0,15,19.9);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(39).to({_off:false},0).to({alpha:1},38).wait(3));

	// pausa_capa
	this.instance_1 = new lib.pausa();
	this.instance_1.setTransform(273,310,1,1,0,0,0,15.5,19);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({alpha:0},41).wait(39));

	// texto
	this.tituloIn = new lib.Símbolo2();
	this.tituloIn.name = "tituloIn";
	this.tituloIn.setTransform(255.5,88.5,1,1,0,0,0,255.5,88.5);

	this.timeline.addTween(cjs.Tween.get(this.tituloIn).wait(80));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,511,330);


(lib.Shape_1copia3copia = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.BMP_bb74bcbf_ea2d_4be3_85e1_b1f5d9ec9c60();
	this.instance_1.setTransform(10.75,-28.15);

	this.instance_2 = new lib.BMP_3ed65831_9417_414c_bf26_5c10883d643c();
	this.instance_2.setTransform(9.5,-25.45);

	this.instance_3 = new lib.BMP_182be8d3_94f4_4160_be10_f5444402de54();
	this.instance_3.setTransform(8.4,-23);

	this.instance_4 = new lib.BMP_ecb5abbc_cec1_4fe2_a88e_718e2cdd7b56();
	this.instance_4.setTransform(7.25,-20.25);

	this.instance_5 = new lib.BMP_48c4cc07_5c8a_4f8c_a83c_51a359b6dd84();
	this.instance_5.setTransform(6.15,-17.55);

	this.instance_6 = new lib.BMP_3a9cfc9e_b735_4faa_a48b_3684a1807e94();
	this.instance_6.setTransform(5.1,-14.8);

	this.instance_7 = new lib.BMP_48f8bf6e_25b1_4f27_82c0_ccdf4a9a1313();
	this.instance_7.setTransform(4.05,-12.15);

	this.instance_8 = new lib.BMP_ac39cced_fd7b_4d8c_99a7_07f3352b4b05();
	this.instance_8.setTransform(3,-9.55);

	this.instance_9 = new lib.BMP_0b13ddaf_c604_410a_bacb_3cb28a5a40f2();
	this.instance_9.setTransform(1.85,-7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-28.1,179,61);


(lib.Shape_1copia2copia = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.BMP_c987da27_aff5_4c85_9602_cd287a713f28();
	this.instance_1.setTransform(0.75,-4.35);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-4.3,179,35.3);


(lib.PuppetShape_1copiacopia = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.BMP_9a82127c_b51e_43c4_afc5_8ceb486fbfe9();
	this.instance_1.setTransform(0.75,-4.35);

	this.instance_2 = new lib.BMP_f518a85d_18db_4df6_b97f_5193f90efc7f();
	this.instance_2.setTransform(1.35,-5.95);

	this.instance_3 = new lib.BMP_cc410b96_7ddc_4bb8_8188_fa3dffdf06b1();
	this.instance_3.setTransform(2.05,-7.5);

	this.instance_4 = new lib.BMP_5102747d_5fb9_44c4_ac94_0037cd1b1544();
	this.instance_4.setTransform(2.75,-9.05);

	this.instance_5 = new lib.BMP_7a5c4138_4f0a_44c4_a3a4_9857433577eb();
	this.instance_5.setTransform(3.45,-10.6);

	this.instance_6 = new lib.BMP_f9577213_c399_42eb_a383_528bbbda0e56();
	this.instance_6.setTransform(4.05,-12.15);

	this.instance_7 = new lib.BMP_976b9480_4948_4e4d_8dd5_1a99af3687fb();
	this.instance_7.setTransform(4.65,-13.65);

	this.instance_8 = new lib.BMP_3cc7834e_27ec_4c17_9743_8800b1eb72d6();
	this.instance_8.setTransform(5.3,-15.35);

	this.instance_9 = new lib.BMP_4f0c6522_bb55_4084_a19c_03209beaa69d();
	this.instance_9.setTransform(5.95,-17);

	this.instance_10 = new lib.BMP_6a90a388_65ec_4b4c_9d91_29488b9798dc();
	this.instance_10.setTransform(6.6,-18.7);

	this.instance_11 = new lib.BMP_cbdf7207_63f6_40e4_a943_2b86852c336b();
	this.instance_11.setTransform(7.25,-20.25);

	this.instance_12 = new lib.BMP_d9087c9c_8350_43c6_ba6b_ff1d02eaf6b2();
	this.instance_12.setTransform(7.95,-21.9);

	this.instance_13 = new lib.BMP_42acd71a_f5fc_43c5_9975_ab2393707568();
	this.instance_13.setTransform(8.65,-23.55);

	this.instance_14 = new lib.BMP_ff37a1c5_51fa_4a61_8ee0_6a69a0b89bf9();
	this.instance_14.setTransform(9.3,-24.95);

	this.instance_15 = new lib.BMP_92ee2af0_54dd_4c90_a6d5_3b9abb70e582();
	this.instance_15.setTransform(10.05,-26.55);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_14}]},1).to({state:[{t:this.instance_15}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-26.5,179.1,59);


(lib.hoja = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.Símbolo1();
	this.instance.setTransform(210,126.55,0.5672,0.5672,0,0,0,210,126.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.hoja, new cjs.Rectangle(90.9,54.8,238.20000000000002,143.5), null);


(lib.gatoback = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Cola
	this.instance = new lib.PuppetShape_1copiacopia("synched",1,false);
	this.instance.setTransform(450.5,420.15,1,1,0,0,0,89.5,15.5);

	this.instance_1 = new lib.Shape_1copia3copia("synched",1,false);
	this.instance_1.setTransform(450.5,420.15,1,1,0,0,0,89.5,15.5);
	this.instance_1._off = true;

	this.instance_2 = new lib.Shape_1copia2copia("synched",1,false);
	this.instance_2.setTransform(450.5,420.15,1,1,0,0,0,89.5,15.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},15).to({state:[{t:this.instance_2}]},9).wait(122));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},15).wait(131));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({_off:false},15).to({_off:true},9).wait(122));

	// Cabeza
	this.instance_3 = new lib.Elipse3();
	this.instance_3.setTransform(276,404.65);

	this.instance_4 = new lib.Capa3();
	this.instance_4.setTransform(280,356.65);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3}]}).wait(146));

	// Oreja_1
	this.instance_5 = new lib.Símbolo7();
	this.instance_5.setTransform(302.65,378.8,1,1,0,0,0,30.9,29.7);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(1).to({regX:25,regY:25.6,scaleX:1.0009,scaleY:1.0005,skewX:-1.0022,skewY:-0.3865,x:296.65,y:374.7},0).wait(1).to({scaleX:1.0017,scaleY:1.001,skewX:-2.0045,skewY:-0.773,x:296.6,y:374.75},0).wait(1).to({scaleX:1.0026,scaleY:1.0015,skewX:-3.0067,skewY:-1.1595,x:296.5,y:374.8},0).wait(1).to({scaleX:1.0034,scaleY:1.002,skewX:-4.0089,skewY:-1.546,x:296.45,y:374.85},0).wait(1).to({scaleX:1.0043,scaleY:1.0025,skewX:-5.0112,skewY:-1.9325,x:296.35},0).wait(1).to({scaleX:1.0051,scaleY:1.003,skewX:-6.0134,skewY:-2.319,x:296.25,y:374.95},0).wait(1).to({scaleX:1.006,scaleY:1.0034,skewX:-7.0156,skewY:-2.7055,x:296.2},0).wait(1).to({scaleX:1.0068,scaleY:1.0039,skewX:-8.0179,skewY:-3.092,x:296.15,y:375.05},0).wait(1).to({scaleX:1.0077,scaleY:1.0044,skewX:-9.0201,skewY:-3.4784,x:296.05},0).wait(1).to({scaleX:1.0086,scaleY:1.0049,skewX:-10.0223,skewY:-3.8649,x:296,y:375.15},0).wait(1).to({scaleX:1.0094,scaleY:1.0054,skewX:-11.0246,skewY:-4.2514,x:295.85,y:375.2},0).wait(1).to({scaleX:1.0103,scaleY:1.0059,skewX:-12.0268,skewY:-4.6379,x:295.8,y:375.25},0).wait(1).to({scaleX:1.0111,scaleY:1.0064,skewX:-13.029,skewY:-5.0244,x:295.75,y:375.3},0).wait(1).to({scaleX:1.0119,scaleY:1.0068,skewX:-14.0312,skewY:-5.4109,x:295.7},0).wait(1).to({scaleX:1.0128,scaleY:1.0073,skewX:-15.0335,skewY:-5.7974,x:295.65,y:375.4},0).wait(1).to({scaleX:1.0136,scaleY:1.0078,skewX:-16.0357,skewY:-6.1839,x:295.55,y:375.45},0).wait(1).to({scaleX:1.0145,scaleY:1.0083,skewX:-17.0379,skewY:-6.5704,x:295.45,y:375.55},0).wait(1).to({scaleX:1.0154,scaleY:1.0088,skewX:-18.0402,skewY:-6.9569,x:295.4,y:375.6},0).wait(1).to({scaleX:1.0162,scaleY:1.0093,skewX:-19.0424,skewY:-7.3434,x:295.35},0).wait(1).to({scaleX:1.0171,scaleY:1.0098,skewX:-20.0446,skewY:-7.7299,x:295.25,y:375.75},0).wait(1).to({scaleX:1.0179,scaleY:1.0103,skewX:-21.0469,skewY:-8.1164,x:295.2},0).wait(1).to({scaleX:1.0188,scaleY:1.0107,skewX:-22.0491,skewY:-8.5029,x:295.1,y:375.85},0).wait(1).to({scaleX:1.0196,scaleY:1.0112,skewX:-23.0513,skewY:-8.8894},0).wait(1).to({scaleX:1.0205,scaleY:1.0117,skewX:-24.0536,skewY:-9.2758,x:295,y:375.95},0).wait(1).to({scaleX:1.0171,scaleY:1.012,skewX:-19.0797,skewY:-5.2298,x:295.25,y:375.45},0).wait(1).to({scaleX:1.0137,scaleY:1.0122,skewX:-14.1058,skewY:-1.1838,x:295.65,y:374.9},0).wait(1).to({scaleX:1.0103,scaleY:1.0124,skewX:-9.1319,skewY:2.8622,x:296,y:374.4},0).wait(1).to({scaleX:1.0068,scaleY:1.0126,skewX:-4.1581,skewY:6.9083,x:296.45,y:373.95},0).wait(1).to({scaleX:1.0034,scaleY:1.0129,skewX:0.8158,skewY:10.9543,x:296.9,y:373.5},0).wait(1).to({scaleX:1,scaleY:1.0131,skewX:5.7897,skewY:15.0003,x:297.35,y:373.1},0).wait(116));

	// Oreja_2
	this.instance_6 = new lib.Triángulo1copia();
	this.instance_6.setTransform(335,346.65);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(146));

	// Pierna
	this.instance_7 = new lib.Elipse3copia2();
	this.instance_7.setTransform(396,363.65);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(146));

	// Torso
	this.instance_8 = new lib.Símbolo4();
	this.instance_8.setTransform(417.5,369.65,1,1,0,0,0,110.5,31);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(1).to({regX:111.5,regY:41,scaleX:0.9969,scaleY:1.0027,x:418.45,y:379.5},0).wait(1).to({scaleX:0.9939,scaleY:1.0055,y:379.4},0).wait(1).to({scaleX:0.9908,scaleY:1.0082,x:418.5,y:379.3},0).wait(1).to({scaleX:0.9878,scaleY:1.0109,y:379.2},0).wait(1).to({scaleX:0.9847,scaleY:1.0137,x:418.45,y:379.05},0).wait(1).to({scaleX:0.9817,scaleY:1.0164,y:378.95},0).wait(1).to({scaleX:0.9786,scaleY:1.0192,y:378.9},0).wait(1).to({scaleX:0.9756,scaleY:1.0219,y:378.75},0).wait(1).to({scaleX:0.9725,scaleY:1.0246,y:378.65},0).wait(1).to({scaleX:0.9695,scaleY:1.0274,y:378.5},0).wait(1).to({scaleX:0.9664,scaleY:1.0301,y:378.45},0).wait(1).to({scaleX:0.9633,scaleY:1.0328,y:378.3},0).wait(1).to({scaleX:0.9603,scaleY:1.0356,x:418.4,y:378.2},0).wait(1).to({scaleX:0.9572,scaleY:1.0383,x:418.45,y:378.1},0).wait(1).to({scaleX:0.9542,scaleY:1.0411,y:378},0).wait(1).to({scaleX:0.9511,scaleY:1.0438,y:377.9},0).wait(1).to({scaleX:0.9481,scaleY:1.0465,x:418.4,y:377.75},0).wait(1).to({scaleX:0.945,scaleY:1.0493,y:377.65},0).wait(1).to({scaleX:0.942,scaleY:1.052,x:418.45,y:377.55},0).wait(1).to({scaleX:0.9389,scaleY:1.0547,y:377.45},0).wait(1).to({scaleX:0.9359,scaleY:1.0575,x:418.4,y:377.35},0).wait(1).to({scaleX:0.9328,scaleY:1.0602,y:377.2},0).wait(1).to({scaleX:0.9297,scaleY:1.063,y:377.15},0).wait(1).to({scaleX:0.9267,scaleY:1.0657,y:377},0).wait(1).to({scaleX:0.9236,scaleY:1.0684,y:376.9},0).wait(1).to({scaleX:0.9206,scaleY:1.0712,y:376.8},0).wait(1).to({scaleX:0.9175,scaleY:1.0739,y:376.7},0).wait(1).to({scaleX:0.9145,scaleY:1.0766,y:376.6},0).wait(1).to({scaleX:0.9114,scaleY:1.0794,x:418.35,y:376.45},0).wait(1).to({scaleX:0.9084,scaleY:1.0821,x:418.4,y:376.35},0).wait(1).to({scaleX:0.9053,scaleY:1.0848,y:376.25},0).wait(1).to({scaleX:0.9023,scaleY:1.0876,y:376.15},0).wait(1).to({scaleX:0.8992,scaleY:1.0903,x:418.35,y:376.05},0).wait(1).to({scaleX:0.8961,scaleY:1.0931,y:375.9},0).wait(1).to({scaleX:0.8931,scaleY:1.0958,x:418.4,y:375.85},0).wait(1).to({scaleX:0.89,scaleY:1.0985,y:375.7},0).wait(1).to({scaleX:0.887,scaleY:1.1013,x:418.35,y:375.6},0).wait(1).to({scaleX:0.8839,scaleY:1.104,y:375.45},0).wait(1).to({scaleX:0.8809,scaleY:1.1067,y:375.4},0).wait(1).to({scaleX:0.8778,scaleY:1.1095,x:418.4,y:375.3},0).wait(1).to({scaleX:0.8796,scaleY:1.108,x:418.35,y:375.35},0).wait(1).to({scaleX:0.8814,scaleY:1.1065,y:375.4},0).wait(1).to({scaleX:0.8832,scaleY:1.105,y:375.45},0).wait(1).to({scaleX:0.8849,scaleY:1.1035,y:375.5},0).wait(1).to({scaleX:0.8867,scaleY:1.102,y:375.6},0).wait(1).to({scaleX:0.8885,scaleY:1.1005},0).wait(1).to({scaleX:0.8903,scaleY:1.099,y:375.7},0).wait(1).to({scaleX:0.892,scaleY:1.0975,y:375.75},0).wait(1).to({scaleX:0.8938,scaleY:1.096,y:375.85},0).wait(1).to({scaleX:0.8956,scaleY:1.0945},0).wait(1).to({scaleX:0.8974,scaleY:1.093,y:375.95},0).wait(1).to({scaleX:0.8992,scaleY:1.0915,y:376},0).wait(1).to({scaleX:0.9009,scaleY:1.09,y:376.1},0).wait(1).to({scaleX:0.9027,scaleY:1.0885,y:376.15},0).wait(1).to({scaleX:0.9045,scaleY:1.087,x:418.4},0).wait(1).to({scaleX:0.9063,scaleY:1.0855,y:376.25},0).wait(1).to({scaleX:0.908,scaleY:1.084,y:376.3},0).wait(1).to({scaleX:0.9098,scaleY:1.0825,y:376.4},0).wait(1).to({scaleX:0.9116,scaleY:1.081},0).wait(1).to({scaleX:0.9134,scaleY:1.0795,y:376.5},0).wait(1).to({scaleX:0.9152,scaleY:1.078,y:376.55},0).wait(1).to({scaleX:0.9169,scaleY:1.0765,y:376.65},0).wait(1).to({scaleX:0.9187,scaleY:1.075},0).wait(1).to({scaleX:0.9205,scaleY:1.0735,y:376.7},0).wait(1).to({scaleX:0.9223,scaleY:1.072,y:376.8},0).wait(1).to({scaleX:0.9241,scaleY:1.0705,y:376.85},0).wait(1).to({scaleX:0.9258,scaleY:1.069,y:376.95},0).wait(1).to({scaleX:0.9276,scaleY:1.0675},0).wait(1).to({scaleX:0.9294,scaleY:1.066,x:418.45,y:377.05},0).wait(1).to({scaleX:0.9312,scaleY:1.0645,x:418.4,y:377.1},0).wait(1).to({scaleX:0.9329,scaleY:1.063,y:377.2},0).wait(1).to({scaleX:0.9347,scaleY:1.0615},0).wait(1).to({scaleX:0.9365,scaleY:1.06,y:377.3},0).wait(1).to({scaleX:0.9383,scaleY:1.0585,y:377.35},0).wait(1).to({scaleX:0.9401,scaleY:1.057,y:377.4},0).wait(1).to({scaleX:0.9418,scaleY:1.0555,y:377.5},0).wait(1).to({scaleX:0.9436,scaleY:1.054},0).wait(1).to({scaleX:0.9454,scaleY:1.0525,y:377.6},0).wait(1).to({scaleX:0.9472,scaleY:1.051,y:377.65},0).wait(1).to({scaleX:0.9489,scaleY:1.0495,y:377.75},0).wait(1).to({scaleX:0.9507,scaleY:1.048},0).wait(1).to({scaleX:0.9525,scaleY:1.0465,y:377.85},0).wait(1).to({scaleX:0.9543,scaleY:1.045,x:418.45,y:377.9},0).wait(1).to({scaleX:0.9561,scaleY:1.0435,y:378},0).wait(1).to({scaleX:0.9578,scaleY:1.042},0).wait(1).to({scaleX:0.9596,scaleY:1.0405,y:378.05},0).wait(1).to({scaleX:0.9614,scaleY:1.039,y:378.15},0).wait(1).to({scaleX:0.9632,scaleY:1.0375,y:378.2},0).wait(1).to({scaleX:0.9649,scaleY:1.036,y:378.3},0).wait(1).to({scaleX:0.9667,scaleY:1.0345},0).wait(1).to({scaleX:0.9685,scaleY:1.033,y:378.4},0).wait(1).to({scaleX:0.9703,scaleY:1.0315,y:378.45},0).wait(1).to({scaleX:0.9721,scaleY:1.03,y:378.55},0).wait(1).to({scaleX:0.9738,scaleY:1.0285},0).wait(1).to({scaleX:0.9756,scaleY:1.027,y:378.65},0).wait(1).to({scaleX:0.9774,scaleY:1.0255,y:378.7},0).wait(1).to({scaleX:0.9792,scaleY:1.024,x:418.5,y:378.75},0).wait(1).to({scaleX:0.9809,scaleY:1.0225,y:378.8},0).wait(1).to({scaleX:0.9827,scaleY:1.021,x:418.45,y:378.85},0).wait(1).to({scaleX:0.9845,scaleY:1.0195,y:378.95},0).wait(1).to({scaleX:0.9863,scaleY:1.018,y:379},0).wait(1).to({scaleX:0.9881,scaleY:1.0165,y:379.1},0).wait(1).to({scaleX:0.9898,scaleY:1.015},0).wait(1).to({scaleX:0.9916,scaleY:1.0135,y:379.2},0).wait(1).to({scaleX:0.9934,scaleY:1.012,y:379.25},0).wait(41));

	// ventana
	this.instance_9 = new lib.Rectángulo2();
	this.instance_9.setTransform(0,28.65);

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(146));

	// Hoja_3
	this.instance_10 = new lib.Símbolo8("synched",0);
	this.instance_10.setTransform(335.2,111.95,1,1,120.0004,0,0,6.2,11.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_10).to({regX:8.8,rotation:0,guide:{path:[335.3,112,331.5,115.9,326.7,119.9,296,145.6,245.9,154.6,205.9,161.8,186.3,165.3,166.7,168.9,167.4,168.9,168.8,172.3,170.2,175.7,174.5,183.8,181.8,191.1,205,214.3,248.8,218.8,292.6,223.2,310.8,226.5,319.9,228.1,320.3,228.8,309.2,243.1,290.8,259.4,254,291.9,217.3,301.7,180.7,311.5,167.6,314.8,164.6,315.4,161.7,316,166,319.3,170.4,322.6,181.4,330.5,192.2,337.1,213.1,349.7,228.9,354.5]},mode:"independent"},144).wait(2));

	// hoja_1_copia
	this.instance_11 = new lib.hoja();
	this.instance_11.setTransform(542.35,100.45,0.6015,0.6796,0,0,0,195.1,126.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_11).to({regX:210,regY:126.5,scaleX:1,scaleY:1,rotation:-360,guide:{path:[542.3,103.9,543.3,116.2,541.3,131.1,537.2,160.8,521.8,173.6,506.5,186.3,490.6,194.2,485.6,196.7,481.2,198.3,479.5,198.9,477.8,199.5,481.1,202.4,484.4,205.4,493,212.5,502.9,218.8,534.5,238.9,566.9,243.1,559.1,254.4,543.9,265.8,513.5,288.7,476.8,289.6,477.5,292.1,478.2,294.6,480.6,300.8,485.1,306.3,499.8,324.1,531.4,329.2,518.6,346.8,509.2,362.4,509.1,362.6,509,362.7]}},144).wait(2));

	// hoja_1
	this.instance_12 = new lib.hoja();
	this.instance_12.setTransform(416.9,112.9,1,1,0,0,0,195,126.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_12).to({regX:210,rotation:-360,guide:{path:[416.9,113,404.7,126,388,133.8,368,143.2,360,146.4,358,147.1,356,147.8,359.7,149.6,363.4,151.3,372.8,155.6,382.5,159.4,413.5,171.7,436,174.8,454,177.3,462.5,178.5,471,179.7,470,179.7,455.2,195.2,434.6,209.1,393.3,236.8,364,228.7,368.3,232.5,372.5,236.3,383.1,245.4,393.4,252.4,426.1,274.9,443,268.7,435.5,280.2,423.9,291.8,400.6,315.1,380,315.7,384,320.9,388,326.1,397.8,338.5,407.1,348.2,408.1,349.2,409,350.1]}},144).wait(2));

	// Fondo
	this.instance_13 = new lib.Capa2();
	this.instance_13.setTransform(0,40.65);

	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(146));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,800,628.7);


// stage content:
(lib.index = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0];
	this.streamSoundSymbolsList[0] = [{id:"intro",startFrame:0,endFrame:146,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		var soundInstance = playSound("intro",0);
		this.InsertIntoSoundStreamData(soundInstance,0,146,1);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(146));

	// titulo
	this.titulo = new lib.simbolo_titulo();
	this.titulo.name = "titulo";
	this.titulo.setTransform(380.05,220,1,1,0,0,0,255.5,88.5);

	this.timeline.addTween(cjs.Tween.get(this.titulo).wait(146));

	// gatoback
	this.gatoback = new lib.gatoback();
	this.gatoback.name = "gatoback";
	this.gatoback.setTransform(400,285.65,1,1,0,0,0,400,314.3);

	this.timeline.addTween(cjs.Tween.get(this.gatoback).wait(146));

	// background
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#E7C178").s().p("Eg+fAu4MAAAhdvMB8/AAAMAAABdvg");
	this.shape.setTransform(400,300);

	this.timeline.addTween(cjs.Tween.get(this.shape).to({_off:true},1).wait(145));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(400,300,400,300);
// library properties:
lib.properties = {
	id: '301238912698CB4E81A369FA80FB69EE',
	width: 800,
	height: 600,
	fps: 24,
	color: "#E7C178",
	opacity: 1.00,
	manifest: [
		{src:"images/index_atlas_1.png?1626397136664", id:"index_atlas_1"},
		{src:"sounds/intro.mp3?1626397136766", id:"intro"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['301238912698CB4E81A369FA80FB69EE'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;