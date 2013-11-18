/**
 * contConteditor
 */
var contConteditor = new (function(){
	var _this = this;
	var _loadingStatus = {
		'canvas': false,
		'module_definitions':false
	};
	var _moduleDefinitions = {};
	var _winIframe = null;
	var _elmContent = null;
	var _rootNode = null;


	this.standby = function(div){
		_loadingStatus[div] = true;
		if( this.isStandby() ){
			editorOnLoad();
		}
		return true;
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
			_this.standby('module_definitions');
		},
		error: function(){
			alert('ERROR.');
		}
	});

	/**
	 * すべての要素のロードが完了したら。
	 */
	function editorOnLoad(){
		_winIframe = window.conteditUICanvas;

		// 遷移する処理を無効化
		$('a', _winIframe.document).each(function(){
			this.href = 'javascript:alert(\'編集中のため押せません。\');'
			this.onclick = 'alert(\'編集中のため押せません。\'); return false;'
		});
		$('form', _winIframe.document).each(function(){
			this.action = 'javascript:alert(\'編集中のため送信できません。\');'
			this.onsubmit = 'alert(\'編集中のため送信できません。\'); return false;'
		});

		// コンテンツ編集画面を開発中表示に切り替える。
		_elmContent = $('#content', _winIframe.document);
		_elmContent.html('<p>開発中です。</p>');

		// モジュール編集画面のセットアップ開始
		// _rootNode = new contModule( _this, {}, null, _elmContent );
		_rootNode = new contModule({
			contConteditor: _this,
			data: {},
			modKey: null,
			jqElmCanvas: _elmContent
		});
		var view = new contModView({model: _rootNode});

console.log(_rootNode.toJSON());
console.log(view.render().el);

	}//editorOnLoad()

	/**
	 * モジュール定義の一式を得る
	 */
	this.getModuleDefinitions = function(){
		return _moduleDefinitions;
	}

})();
