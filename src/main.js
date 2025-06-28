(function(global) {
	var cjs = createjs || {};
	var utils = cjs.utils;
	var exportRoot;
	var stage;

	var data = {
		result: '',
		meta: {}
	};

	global.onload = function() {
		utils.onStart = onGameStart;
		utils.init(config);
	};

	function onGameStart(res, st) {
		exportRoot = res;
		stage = st;

		//定义按钮元素并添加手型：
		btnTip = exportRoot.btnTip;
		btnReset = exportRoot.btnReset;
		btnSubmit = exportRoot.btnSubmit;
		btnAns = exportRoot.btnAns;
		showPointerArray = [
			btnTip, btnReset, btnSubmit,btnAns
		];
		//定义元素：
		tip = exportRoot.tip;
		tip.visible = false;
		init();
	}

	function init() {
		handleControls();
	}

	function handleControls() {
		//添加手型：
		showPointer();
		//
		tip_Controls(btnTip, tip);
		pickLineFun();
		//
		operating_Space();
	}

	function showPointer() {
		showPointerArray.forEach(function(child, i) {
			child.cursor = 'pointer';
		});
	}


	function tip_Controls(btn, mc) {
		utils.on(btn, 'click', function() {
			mc.visible = true;
		});
		var dot = mc.mc;
		dot.chuX = dot.x;
		dot.chuY = dot.y;
		dot.lastX = dot.chuX;
		dot.lastY = dot.chuY;

		utils.on(dot, 'mousedown', function(e) {
			var p = dot.parent.globalToLocal(e.stageX, e.stageY);
			downX = p.x;
			downY = p.y;
			dot.lastX = dot.x;
			dot.lastY = dot.y;
		});

		utils.on(dot, 'pressmove', function(e) {
			var p = dot.parent.globalToLocal(e.stageX, e.stageY);
			var newX = dot.lastX + (p.x - downX);
			var newY = dot.lastY + (p.y - downY);
			if (newX <= (mc.rec.x - mc.rec.nominalBounds.width * 0.5 + dot.nominalBounds.width * 0.5)) newX = mc.rec
				.x - mc.rec.nominalBounds.width * 0.5 + dot.nominalBounds.width * 0.5;
			else if (newX >= (mc.rec.x + mc.rec.nominalBounds.width * 0.5 - dot.nominalBounds.width * 0.5)) newX = mc.rec
				.x + mc.rec.nominalBounds.width * 0.5 - dot.nominalBounds.width * 0.5;
			if (newY <= (mc.rec.y - mc.rec.nominalBounds.height * 0.5 + dot.nominalBounds.height * 0.5)) newY = mc.rec
				.y - mc.rec.nominalBounds.height * 0.5 + dot.nominalBounds.height * 0.5;
			else if (newY >= (mc.rec.y + mc.rec.nominalBounds.height * 0.5 - dot.nominalBounds.height * 0.5)) newY =
				mc.rec.y + mc.rec.nominalBounds.height * 0.5 - dot.nominalBounds.height * 0.5;
			dot.x = newX;
			dot.y = newY;
		});
		dot.btnClose.cursor = 'pointer';
		utils.on(dot.btnClose, 'click', function() {
			mc.visible = false;
		});
	}

	function pickLineFun(){
		isSubmit = false;
		itemArray = [];
		leftArray = [];
		rightArray = [];
		leftPoint = [];
		rightPoint = [];
		lineArray = [];
		leftNum = 0;
		rightNum = 0;
		curNum = 0;
		leftTarget = null;
		rightTarget = null;
		for(var i=1;i<7;i++){
			itemArray.push(exportRoot["item"+i]);
			leftArray.push(exportRoot["ls"+i]);
			rightArray.push(exportRoot["rs"+i]);
			leftPoint.push(exportRoot["l"+i]);
			rightPoint.push(exportRoot["r"+i]);
			lineArray.push(exportRoot["line"+i]);
		}
		hideItem();
		line_cz();
	}
	function line_cz() {
		resetLeft();
		resetRight();
		for(var i = 0; i < lineArray.length; i++) {
			lineArray[i].left = null;
			lineArray[i].right = null;
		}
		leftPoint.forEach(function(curPoint, index) {
			curPoint.cursor = 'pointer';
			curPoint.num = index + 1;
			curPoint.line = null;
			curPoint.ok = 0;
		
			utils.on(curPoint, 'click', function(e) {
				audioPlayer.pauseAudio();
				sBtnArray.forEach(function(s,i){s.gotoAndStop(0);});
				if(isSubmit) return;
				leftTarget = curPoint;
				leftNum = curPoint.num;
				curNum = curPoint.num;
				resetLeft();
				leftArray[leftNum - 1].gotoAndStop(1);
		
				if(rightNum != 0) {
					leftNum = 0;
					rightNum = 0;
					resetLeft();
					resetRight();
					if(leftTarget.ok == 1) {
						leftTarget.line.removeAllChildren();
						leftTarget.line.left.ok = 0;
						leftTarget.line.right.ok = 0;
					}
					if(rightTarget.ok == 1) {
						rightTarget.line.removeAllChildren();
						rightTarget.line.left.ok = 0;
						rightTarget.line.right.ok = 0;
					}
		
					var shape = new createjs.Shape();
					shape.graphics.setStrokeStyle(2).beginStroke("blue");
					shape.graphics.moveTo(leftTarget.x, leftTarget.y);
					shape.graphics.lineTo(rightTarget.x, rightTarget.y);
					lineArray[curNum - 1].removeAllChildren();
					lineArray[curNum - 1].addChild(shape);
		
					leftTarget.ok = 1;
					rightTarget.ok = 1;
					leftTarget.line = lineArray[curNum - 1];
					rightTarget.line = lineArray[curNum - 1];
					lineArray[curNum - 1].left = leftTarget;
					lineArray[curNum - 1].right = rightTarget;
					setSubVisible();
				}
			});
		});
		
		rightPoint.forEach(function(curPoint, index) {
			curPoint.cursor = 'pointer';
			curPoint.num = index + 1;
			curPoint.line = null;
			curPoint.ok = 0;
		
			utils.on(curPoint, 'click', function(e) {
				audioPlayer.pauseAudio();
				sBtnArray.forEach(function(s,i){s.gotoAndStop(0);});
				if(isSubmit) return;
				rightTarget = curPoint;
				rightNum = curPoint.num;
				resetRight();
				rightArray[rightNum - 1].gotoAndStop(1);
		
				if(leftNum != 0) {
					leftNum = 0;
					rightNum = 0;
					resetLeft();
					resetRight();
					if(leftTarget.ok == 1) {
						leftTarget.line.removeAllChildren();
						leftTarget.line.left.ok = 0;
						leftTarget.line.right.ok = 0;
					}
					if(rightTarget.ok == 1) {
						rightTarget.line.removeAllChildren();
						rightTarget.line.left.ok = 0;
						rightTarget.line.right.ok = 0;
					}
		
					var shape = new createjs.Shape();
					shape.graphics.setStrokeStyle(2).beginStroke("blue");
					shape.graphics.moveTo(leftTarget.x, leftTarget.y);
					shape.graphics.lineTo(rightTarget.x, rightTarget.y);
					lineArray[curNum - 1].removeAllChildren();
					lineArray[curNum - 1].addChild(shape);
		
					leftTarget.ok = 1;
					rightTarget.ok = 1;
					leftTarget.line = lineArray[curNum - 1];
					rightTarget.line = lineArray[curNum - 1];
					lineArray[curNum - 1].left = leftTarget;
					lineArray[curNum - 1].right = rightTarget;
		
					setSubVisible();
				}
			});
		});
	}
	function setSubVisible() {
		if(isSubmit) return;
		btnSubmit.gotoAndStop(0);
		for(var i = 0; i < leftPoint.length; i++) {
			if(leftPoint[i].ok == 0) return;
		}
		btnSubmit.gotoAndStop(1);
	}
	
	function resetLeft() {
		for(var i = 0; i < leftArray.length; i++) {
			leftArray[i].gotoAndStop(0);
		}
	}
	
	function resetRight() {
		for(var i = 0; i < rightArray.length; i++) {
			rightArray[i].gotoAndStop(0);
		}
	}
	function hideItem() {
		for(var i = 0; i < itemArray.length; i++) {
			itemArray[i].visible = false;
		}
	}
	
	function showItem() {
		for(var i = 0; i < itemArray.length; i++) {
			itemArray[i].visible = true;
		}
	}
	function LineVisible(bloom) {
		for(var i = 0; i < lineArray.length; i++) {
			lineArray[i].visible = bloom;
		}
	}

	function operating_Space() {
		/* utils.on(btnSound, 'click', function() {
			btnSound.currentFrame == 0?audioPlayer.setVolume(0):audioPlayer.setVolume(1);
			btnSound.gotoAndStop(btnSound.currentFrame == 0?1:0);
		}); */
		
		utils.on(btnTip, 'click', function() {
			stage.addChild(tip);
			tip.mc.gotoAndStop(exportRoot.currentFrame);
			tip.visible = true;
		});
		utils.on(btnReset, 'click', function() {
			reset();
		});
		utils.on(btnAns, 'click', function() {
			if (btnAns.currentFrame == 0) return;
			stage.addChild(tip);
			tip.mc.gotoAndStop(3);
			tip.visible = true;
		});
		utils.on(btnSubmit, 'click', function(e) {
			if(btnSubmit.currentFrame == 1) {
				isSubmit = true;
				resetLeft();
				resetRight();
				showItem();
				for(var i = 0; i < lineArray.length; i++) {
					if(lineArray[i].left.num == lineArray[i].right.num) {
						itemArray[i].gotoAndStop(0);
					} else {
						itemArray[i].gotoAndStop(1);
					}
				}
				btnSubmit.gotoAndStop(0);
				btnAns.gotoAndStop(1);
				data.result = true;
				audioPlayer.playAudio("sounds/right.mp3");
				itemArray.forEach(function(results, i) {
					if(results.currentFrame == 1) {
						audioPlayer.playAudio("sounds/wrong.mp3");
						data.result = false;
					}
				});
			}
			try {
				SendDataApi.sendDataServer(data);
			} catch (error) {}
		});
		sBtnArray = [ ];
		for(var i=0;i<6;i++){
			sBtnArray.push(exportRoot["s"+i]);
		}
		sBtnArray.forEach(function(s,i){
			s.cursor = 'pointer';
			utils.on(s, 'click', function() {
				sBtnArray.forEach(function(s,i){s.gotoAndStop(0);});
				s.gotoAndStop(1);
				audioPlayer.playAudio('sounds/s'+i+'.mp3');
			});
		});
	}

	function reset() {
		sBtnArray.forEach(function(mc,i){mc.gotoAndStop(0);});
		for(var i=1;i<7;i++){
			exportRoot["item"+i].gotoAndStop(0);
			exportRoot["ls"+i].gotoAndStop(0);
			exportRoot["rs"+i].gotoAndStop(0);
			/* exportRoot["l"+i].gotoAndStop(0);
			exportRoot["r"+i].gotoAndStop(0); */
		}
		btnSubmit.gotoAndStop(0);
		data.result = false;
		audioPlayer.pauseAudio();
		isSubmit = false;
		hideItem();
		btnAns.gotoAndStop(0);
		for(var i = 0; i < lineArray.length; i++) {
			lineArray[i].removeAllChildren();
			leftPoint[i].ok = 0;
			leftPoint[i].clock = 0;
		}
		LineVisible(true);
		resetLeft();
		resetRight();
		leftNum = 0;
		rightNum = 0;
		curNum = 0;
	}
})(window);
