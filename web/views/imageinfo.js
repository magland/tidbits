function ImageInfo(O) {
    O=O||this;
    JSQWidget(O);

    var m_groupBox = $('<fieldset><legend>Info</legend></fieldset>');
    m_groupBox.append('<button>Download MDA file</button>').click(function() {
        O.emit('downloadMDAFileRequest');
    });

    O.div().append(m_groupBox);

    JSQ.connect(O,'sizeChanged',O,update_layout);
    update_layout();

    function update_layout() {
        m_groupBox.css({
            position:'absolute',
            left:0,
            top:0,
            width:O.width()-35,
            height:O.height()-25,
        });
    }
}
