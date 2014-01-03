/**
 * contConteditor
 */
window.contConteditor = new (function(){
	var _this = this;
	var _loadingStatus = {
		'canvas': false,
		'module_definitions': false,
		'document_contents': false
	};
	var _moduleDefinitions = {}; // モジュール定義
	var _contentData = []; // コンテンツデータ
	var _winIframe = null;
	var _elmContent = null;
	var _rootNode = null;
	this.cls = {
		collections: {},//コレクションを格納
		models: {},//モデルを格納
		views: {}//ビューを格納
	}
	_this.docModules = {};
	_this.docModulesView = {};
	_this.docContents = {};
	_this.docContentsView = {};


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

	function loadServerData(opt){
		// モジュール定義を読み込む
		$.ajax({
			url: '?PX=plugins.contedit.edit&mode=api&method='+opt.apiMethod ,
			success: function(data){
				opt.success(data);
				_this.standby(opt.standbyKey);
			},
			error: function(){
				alert(opt.apiMethod + ' ERROR.');
			}
		});
	}
	loadServerData({apiMethod:'get_module_definitions', standbyKey:'module_definitions', success: function(data){_moduleDefinitions = data;}});
	loadServerData({apiMethod:'get_document_contents', standbyKey:'document_contents', success: function(data){_contentData = data.data;}});


	/**
	 * すべての要素のロードが完了したら呼ばれる
	 */
	function editorOnLoad(){
		_winIframe = window.conteditUICanvas;

		// コンテンツ編集画面を開発中表示に切り替える。
		_elmContent = $('#content', _winIframe.document);
		_elmContent.html('<p>開発中です。</p>');

		// 遷移する処理を無効化
		$('a', _winIframe.document).each(function(){
			this.href = 'javascript:alert(\'編集中のため押せません。\');'
			this.onclick = 'alert(\'編集中のため押せません。\'); return false;'
		});
		$('form', _winIframe.document).each(function(){
			this.action = 'javascript:alert(\'編集中のため送信できません。\');'
			this.onsubmit = 'alert(\'編集中のため送信できません。\'); return false;'
		});

		// document module collection を、一旦空白で作成する。
		_this.docModules = new _this.cls.collections.documentModules(_moduleDefinitions.list);
		_this.docModulesView = new _this.cls.views.documentModules({collection: _this.docModules});

		// document module collection にモジュールを追加する。
		// for( var i in _moduleDefinitions.list ){
		// 	_this.docModules.add( new _this.cls.models.documentModule(_moduleDefinitions.list[i]) );
		// }

		// document contents collection を、一旦空白で作成する。
		_this.docContents = new _this.cls.collections.documentContents(_contentData);
		_this.docContentsView = new _this.cls.views.documentContents({collection: _this.docContents});

		// document contents collection にコンテンツを追加する。
		// for( var i in _contentData ){
		// 	_this.docContents.add( new _this.cls.models.documentContent(_contentData[i]) );
		// }

		// 編集画面を描画する
		$('#content', _winIframe.document).html( _this.docContentsView.render().el );

	}//editorOnLoad()

	/**
	 * ドキュメントモジュール定義の一式を得る
	 */
	this.getModuleDefinitions = function(){
		return _moduleDefinitions;
	}//getModuleDefinitions()

	/**
	 * 編集を保存する
	 */
	this.save = function(gotoUrlWhenSuccess){
		var json = _this.docContents.toJSON();
		// console.log(json);//preview

		$.ajax({
			url: '?PX=plugins.contedit.edit&mode=api&method=save' ,
			data: {
				document_contents: json
			},
			success: function(data){
				if(!data.result){
					alert('ERROR: ' + data.error);
					return;
				}
				window.location.href = gotoUrlWhenSuccess;
			},
			error: function(){
				alert(opt.apiMethod + ' ERROR.');
			}
		});
	}

})();
