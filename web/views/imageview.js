function ImageView(O,context) {
	O=O||this;
	MVAbstractView(O,context);
	O.div().addClass('ImageView');

	this.setImage=function(image) {return setImage(image);};
	this.setImageUrl=function(url) {m_image_url=url;};

	O.prepareCalculation=function() {prepareCalculation();};
	O.runCalculation=function(opts,callback) {runCalculation(opts,callback);};
	O.onCalculationFinished=function() {onCalculationFinished();};

	JSQ.connect(O,'sizeChanged',O,update_layout);
	/*
	JSQ.connect(mvcontext,'optionsChanged',O,O.recalculate);
	JSQ.connect(mvcontext,'currentClusterChanged',O,update_highlighting);
	JSQ.connect(mvcontext,'selectedClustersChanged',O,update_highlighting);
	*/

	var m_panel_widget=new MVPanelWidget();
	m_panel_widget.setParent(O);
	var m_image_panels=[];
	var m_image_url='';
	var m_image=null;

	m_panel_widget.onPanelClicked(panelClicked);

	function update_layout() {
		var ss=O.size();
		m_panel_widget.setPosition([5,5]);
		m_panel_widget.setSize([ss[0]-10,ss[1]-10]);
	}
	function update_highlighting() {
	}

	function setImage(image) {
		/*
		var M=templates.N1();
		var T=templates.N2();
		var K=templates.N3();
		m_cluster_data=[];
		for (var k=1; k<=K; k++) {
			var template0=templates.subArray(0,0,k-1,M,T,1);
			if ((template0.minimum()!=0)||(template0.maximum()!=0)) {
				var CD={
					template0:template0,
					k:k
				};
				m_cluster_data.push(CD);
			}
		}
		*/
		m_image=image;
		update_panels();
	}
	function update_panels() {
		m_panel_widget.clearPanels();
		m_image_panels=[];
		var P=new ImagePanel();
		P.setImage(m_image);
		m_image_panels.push(P);
		m_panel_widget.addPanel(0,0,P);
		/*
		for (var k=0; k<m_cluster_data.length; k++) {
			var CD=m_cluster_data[k];
			if (m_total_time_sec)
				CD.firing_rate=CD.num_events/m_total_time_sec;
			else
				CD.firing_rate=0;
			var Y=new MVTemplatesViewPanel();
			Y.setProperty('k',CD.k);
			Y.setChannelColors(mvcontext.channelColors());
			Y.setClusterData(CD);
			m_panel_widget.addPanel(0,k,Y);
			m_template_panels.push(Y);
		}
		update_scale_factors();
		*/
	}
	function panelClicked(ind,modifiers) {
		if (ind in m_image_panels) {
			//O.mvContext().clickCluster(m_template_panels[ind].property('k'),modifiers);
		}

	}
	function Calculator() {
		var that=this;

    	//inputs
    	this.image_url;

    	//outputs
    	this.image=null;

    	this.run=function(opts,callback) {

    		if (!that.image_url) {
    			callback({success:true});
    			return;
    		}

    		var A=new Mda();
    		A.load(that.image_url,function(result) {
    			if (!result.success) {
    				callback({success:false,error:'Problem loading image: '+result.error});
    				return;
    			}
				that.image=A;
				callback({success:true});
    		})
	    };
    }
    var m_calculator=new Calculator();
    function prepareCalculation() {
    	m_calculator.image_url=m_image_url;
    }
    function runCalculation(opts,callback) {
    	m_calculator.run(opts,callback);
    }
    function onCalculationFinished() {
    	if (m_calculator.image) {
			setImage(m_calculator.image);
		}
    }

	update_layout();
}

function ImagePanel(O) {
	O=O||this;
	JSQCanvasWidget(O);
	O.div().addClass('ImagePanel');

	this.setImage=function(image) {m_image=image; O.update();};

	var m_image=null;

	O.onPaint(paint);

	function paint(painter) {
		var W=O.width();
		var H=O.height();
		if (m_image) {
			var minval=m_image.minimum();
			var maxval=m_image.maximum();
			for (var y=0; y<m_image.N2(); y++) {
				for (var x=0; x<m_image.N1(); x++) {
					var val=m_image.value(x,y);
					var p1=coord2pix([x-0.5,y-0.5]);
					var p2=coord2pix([x+0.5,y+0.5]);
					var col=val2col((val-minval)/(maxval-minval));
					painter.fillRect(p1[0],p1[1],p2[0]-p1[0]+1,p2[1]-p1[1]+1,col);
				}
			}
		}
		else {
			painter.fillRect(0,0,W,H,'gray');
		}
    }

    function val2col(val) {
    	var val2=Math.floor(Math.max(0,Math.min(255,val*256)));
    	return `rgb(${val2},${val2},${val2})`;
    }

    function coord2pix(coord) {
    	if (!m_image) return [0,0];

    	var W=O.width();
		var H=O.height();
		var N1=m_image.N1();
		var N2=m_image.N2();
		var W0,H0;
		if (W*N2>H*N1) {
			W0=H*N1/N2;
			H0=H;
		}
		else {
			W0=W;
			H0=W*N2/N1;	
		}
		var xoffset=(W-W0)/2;
		var yoffset=(H-H0)/2;

    	var x=coord[0],y=coord[1];
		var xfrac=(x+0.5)/N1;
		var yfrac=(y+0.5)/N2;
		return [xoffset+xfrac*W0,yoffset+yfrac*H0];

    	/*var template0=m_CD.template0;
    	var M=template0.N1();
    	var T=template0.N2();
    	var W0=O.size()[0];
    	var H0=O.size()[1];
    	var pctx=0,pcty=0;
    	if (T) pctx=(t+0.5)/T;
    	if (M) pcty=(m+0.5-val*m_vert_scale_factor)/M;
    	var margx=4,margy=5;
    	var x0=m_template_rect[0]+margx+pctx*(m_template_rect[2]-margx*2);
    	var y0=m_template_rect[1]+margy+pcty*(m_template_rect[3]-margy*2);
    	return [x0,y0];
    	*/
    }
}


