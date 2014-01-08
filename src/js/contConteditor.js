/**
 * contConteditor
 */
window.contConteditor = new (function(){
	var _this = this;
	var EDITOR = this;
	var _loadingStatus = {
		'canvas': false,
		'module_definitions': false,
		'document_contents': false
	};
	var _moduleDefinitions = {}; // モジュール定義
	var _contentData = []; // コンテンツデータ
	var _elmContent = null;
	var _rootNode = null;
	_this.winIframe = null;//iframeウィンドウオブジェクト
	_this.cls = {
		collections: {},//コレクションを格納
		models: {},//モデルを格納
		views: {}//ビューを格納
	}
	_this.docModules = {};
	_this.docModulesView = {};
	_this.docContents = {};
	_this.docContentsView = {};
	_this.uiControlPanel = {};
	_this.uiWinEditElement = {};

	(function(){
		function fitCanvas(){
			var win = $(document);
			$('.conteditUI-canvas')
				.height( win.height() )
			;
		}
		$(window).load( function(){
			$(window).on('resize', function(){
				fitCanvas();
				return true;
			});
			fitCanvas();
			$('.conteditUI-controlpanel').draggable();
		} );
		$(window).bind('beforeunload', function(){
			return '編集内容は保存されていません。画面を遷移してもよろしいですか？';
		});
	})();

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
		_this.winIframe = window.conteditUICanvas;

		// コンテンツ編集画面を準備中表示に切り替える。
		_elmContent = $('#content', _this.winIframe.document);
		_elmContent.html('<p>編集画面を準備しています。しばらくお待ち下さい。</p>');

		// 遷移する処理を無効化
		$('a', _this.winIframe.document).each(function(){
			this.href = 'javascript:alert(\'編集中のため押せません。\');'
			this.onclick = 'alert(\'編集中のため押せません。\'); return false;'
		});
		$('form', _this.winIframe.document).each(function(){
			this.action = 'javascript:alert(\'編集中のため送信できません。\');'
			this.onsubmit = 'alert(\'編集中のため送信できません。\'); return false;'
		});

		// document module collection を、一旦空白で作成する。
		_this.docModules = new _this.cls.collections.documentModules(_moduleDefinitions.list);
		_this.docModulesView = new _this.cls.views.documentModules({collection: _this.docModules});

		// document contents collection を、一旦空白で作成する。
		_this.docContents = new _this.cls.collections.moduleContents(_contentData);
		_this.docContentsView = new _this.cls.views.moduleContents({collection: _this.docContents});

		// 編集画面を描画する
		$('#content', _this.winIframe.document)
			.html( _this.docContentsView.render().el )
		;

		// 編集パネル
		_this.uiControlPanel = new contConteditor.cls.views.uiControlPanel({collection: _this.docContents});

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

		$.ajax({
			url: '?PX=plugins.contedit.edit&mode=api&method=save' ,
			data: {
				document_contents: json
			},
			success: function(data){
				if(!data.result){
					alert('ERROR: ' + data.message);
					return;
				}
				window.location.href = gotoUrlWhenSuccess;
			},
			error: function(){
				alert(opt.apiMethod + ' ERROR.');
			}
		});
	}//save()

})();
