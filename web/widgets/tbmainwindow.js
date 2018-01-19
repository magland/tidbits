function TBMainWindow(O) {
	O=O||this;
	JSQWidget(O);
	O.div().addClass('TBMainWindow');

	this.setTBManager=function(manager) {m_tb_manager=manager; refresh();};

	var m_tb_manager=null;
	var m_tabber=new Tabber();
	var containers={
		north:m_tabber.createTabWidget('north'),
		south:m_tabber.createTabWidget('south')
	};
	for (var container_name in containers) {
		containers[container_name].setParent(O);
	}

	JSQ.connect(O,'sizeChanged',O,update_layout);
	function update_layout() {
		var W=O.width();
		var H=O.height();

		var ymarg=10; var yspace=10;

		var H1=(H-2*ymarg-yspace)/2;
		var H2=H-H1-2*ymarg-yspace;
		containers.north.setGeometry(0,ymarg,W,H1);
		containers.south.setGeometry(0,ymarg+H1+yspace,W,H2);
	}

	function refresh() {
		for (var i=0; i<m_tb_manager.viewCount(); i++) {
			var V=m_tb_manager.view(i);
			m_tabber.addWidget(V.position,V.label,V.widget);
			if (V.widget.recalculate) {
				V.widget.recalculate();
			}
		}
	}

	update_layout();
}

