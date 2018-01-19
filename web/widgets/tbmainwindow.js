function TBMainWindow(O) {
	O=O||this;
	JSQWidget(O);
	O.div().addClass('TBMainWindow');

	this.setTBManager=function(manager) {m_tb_manager=manager;};

	var m_tb_manager=null;

	JSQ.connect(O,'sizeChanged',O,update_layout);
	function update_layout() {
		var W=O.width();
		var H=O.height();
	}

	update_layout();
}

