function TBManager(O) {
  O=O||this;
  JSQObject(O);

	this.setConfig=function(X) {setConfig(X);};
  this.viewCount=function() {return viewCount();};
  this.view=function(i) {return view(i);};

  var m_config={};
  var m_context=new MVContext();

  function setConfig(X) {
    if (JSON.stringify(X)==JSON.stringify(m_config)) return;
    m_config=JSQ.clone(X);
    O.emit('changed');
  }
  function viewCount() {
    var views=m_config.views||[];
    return views.length;
  }
  function view(i) {
    var views=m_config.views||[];
    var config0=views[i]||null;
    if (!config0) return null;
    return create_view(i,config0);
  }
  function create_view(i,config0) {
    var ret={};
    var default_position='north';
    if (Number(i)%2==1) default_position='south';
    ret.position=config0.position||default_position;
    if (config0.templates) {
      ret.label=config0.label||'Templates';
      var W=new MVTemplatesView(null,m_context);
      var templates=config0.templates;
      if (templates.prv) {
        W.setTemplatesUrl('https://river.simonsfoundation.org/download/'+templates.prv.original_checksum);
      }
      ret.widget=W;
    }
    else {
      ret.label=config0.label||'Unknown';
      ret.widget=new DummyView();  
    }
    return ret;
  }
}

function DummyView(O) {
  O=O||this;
  JSQWidget(O);
}

function TBContext(O) {
  O=O||this;
  JSQObject(O);
}