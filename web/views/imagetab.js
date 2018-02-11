function ImageTab(label,O) {
    O=O||this;
    JSQWidget(O);

    var m_label=label||'Image';

    var m_imageView=new ImageView(null);
    m_imageView.setParent(O);
    var m_imageInfo=new ImageInfo(null);
    m_imageInfo.setParent(O);

    var m_imageViewWidthFraction=0.75;

    this.setImageUrl=function(url) {return m_imageView.setImageUrl(url);};
    this.recalculate=function() {return m_imageView.recalculate();};

    JSQ.connect(m_imageInfo,'downloadMDAFileRequest',O,downloadMDAFile);
    function downloadMDAFile() {
        download(m_imageView.getImage().data(),m_label+'.mda');
    }

    JSQ.connect(O,'sizeChanged',O,update_layout);
    update_layout();

    function update_layout() {
        m_imageView.setSize(O.width()*m_imageViewWidthFraction,O.height());
        m_imageView.setPosition(0,0);
        m_imageInfo.setSize(O.width()-m_imageView.width(),O.height());
        m_imageInfo.setPosition(m_imageView.width(),0);
    }
}
