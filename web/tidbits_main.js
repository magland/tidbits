/*
 * Copyright 2016-2017 Flatiron Institute, Simons Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function jsqmain(query) {

    // The url query
    query=query||{};

    // Determine whether we are running on localhost (development mode)
    var on_localhost=jsu_starts_with(window.location.href,'http://localhost');

    // Switch to https protocol if needed
    if ((!on_localhost)&&(location.protocol != 'https:')) {
        location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }

    show_full_browser_message('Tidbits','Loading config...');

    load_config(query.config_id,function(err,config) {
        if (err) {
            show_full_browser_message('Tidbits','Error loading config: '+err);
            return;
        }
        console.log ('Config:');
        console.log (config);
        show_full_browser_message('','');

        load_kbucket_url(function(err,kbucket_url) {
            if (err) {
                show_full_browser_message('Tidbits','Error loading kbucket_url: '+err);
                return;
            }
            var manager=new TBManager();
            manager.setConfig(config);
            manager.setKBucketUrl(kbucket_url);

            var X=new TBMainWindow();
            X.setTBManager(manager);
            X.showFullBrowser();
        });

        
    });
}

function load_kbucket_url(callback) {
    jsu_http_get_json('api/getKBucketUrl',{},function(tmp) {
        if (!tmp.success) {
            callback(tmp.error);
            return;
        }
        if (!tmp.object.success) {
            callback(tmp.object.error);
            return;
        }
        callback(null,tmp.object.kbucket_url);
    });
}


function load_config(config_id,callback) {
    if (!config_id) {
        callback('Missing query parameter: config_id');
        return;
    }
    jsu_http_get_json('api/getConfig?id='+config_id,{},function(tmp) {
        if (!tmp.success) {
            callback(tmp.error);
            return;
        }
        if (!tmp.object.success) {
            callback(tmp.object.error);
            return;
        }
        var config_obj=try_parse_json(tmp.object.config);
        if (!config_obj) {
            console.log (tmp.object);
            callback('Error parsing config string.');
            return;
        }
        callback(null,config_obj);
    });
}

function MessageWidget(O) {
    O=O||this;
    JSQWidget(O);
    O.div().addClass('MessageWidget');

    this.setMessage=function(msg) {m_message=msg; refresh();};
    this.setSubmessage=function(msg) {m_submessage=msg; refresh();};
    this.message=function() {return m_message;};
    this.submessage=function() {return m_submessage;};

    var m_message='';
    var m_submessage;

    function refresh() {
        O.div().html('<h2>'+m_message+'</h2><h3>'+m_submessage+'</h3>');
    }
}

var s_message_widget=new MessageWidget();
function show_full_browser_message(msg,submessage) {
    var X=s_message_widget;
    X.setMessage(msg);
    X.setSubmessage(submessage);
    X.showFullBrowser();
}

function try_parse_json(str) {
    try {
        return JSON.parse(str);
    }
    catch(err) {
        return null;
    }
}

function ends_with(str,str2) {
    return (str.slice(str.length-str2.length)==str2);
}

//window.callbacks={};
//var s_last_cb_code=0;
