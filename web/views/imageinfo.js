function ImageInfo(O) {
    O=O||this;
    JSQWidget(O);

    var m_groupBox = $('<fieldset id=infoBox><legend>Info</legend></fieldset>');
    var m_xpos_label=$('<label id=xpos>--</label>');
    var m_ypos_label=$('<label id=ypos>--</label>');
    var m_value_label=$('<label id=value>--</label>');

    m_groupBox.append('<label>X: </label>');
    m_xpos_label.appendTo(m_groupBox);
    m_groupBox.append('<br>');

    m_groupBox.append('<label>Y: </label>');
    m_ypos_label.appendTo(m_groupBox);
    m_groupBox.append('<br>');

    m_groupBox.append('<label>Value: </label>');
    m_value_label.appendTo(m_groupBox);
    m_groupBox.append('<br>');

    $('<button>Download MDA file</button>')
        .css({position: 'absolute', bottom: 10})
        .click(function() {
            O.emit('downloadMDAFileRequest');
    }).appendTo(m_groupBox);

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

    this.setPixelInfo = function setPixelInfo(data) {
        data = data||{};
        var x = JSON.stringify(data.x)||'--';
        var y = JSON.stringify(data.y)||'--';
        var v = JSON.stringify(data.value)||'--';
        m_xpos_label.text(x);
        m_ypos_label.text(y);
        m_value_label.text(v);
    }
}
