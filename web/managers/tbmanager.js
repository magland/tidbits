function TBManager(O) {
  O=O||this;
  JSQObject(O);

	this.setConfig=function(X) {setConfig(X);};

  var m_config={};

  function setConfig(X) {
    if (JSON.stringify(X)==JSON.stringify(m_config)) return;
    m_config=JSQ.clone(X);
    O.emit('changed');
  }
}
