/**
 * contConteditor
 */
var contConteditor = new (function(){
	var _loadingStatus = {
		'canvas': false,
		'module_definitions':false
	};
	var _moduleDefinitions = {};
	var _winIframe = null;
	var _elmContent = null;

	this.standby = function(div){
		_loadingStatus[div] = true;
		if( this.isStandby() ){
			onload();
		}
	}
	this.isStandby = function(){
		for( var i in _loadingStatus ){
			if( !_loadingStatus[i] ){
				return false;
				break;
			}
		}
		return true;
	}

	// モジュール定義を読み込む
	$.ajax({
		url: '?PX=plugins.contedit.edit&mode=api&method=get_module_definitions' ,
		success: function(data){
			_moduleDefinitions = data;
			contConteditor.standby('module_definitions');
		},
		error: function(){
			alert('ERROR.');
		}
	});

	/**
	 * すべての要素のロードが完了したら。
	 */
	function onload(){
		_winIframe = window.conteditUICanvas;

		$('a', _winIframe.document).each(function(){
			this.href = 'javascript:alert(\'編集中のため押せません。\');'
			this.onclick = 'alert(\'編集中のため押せません。\'); return false;'
		});

		_elmContent = $('#content', _winIframe.document);
		_elmContent.html('<p>開発中です。</p>');

	}//onload()


})();
