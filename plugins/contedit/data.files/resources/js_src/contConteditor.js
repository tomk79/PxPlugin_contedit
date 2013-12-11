/**
 * contConteditor
 */
var contConteditor = new (function(){
	var _this = this;
	var _loadingStatus = {
		'canvas': false,
		'module_definitions': false,
		'content_data': false
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
	loadServerData({apiMethod:'get_content_data', standbyKey:'content_data', success: function(data){_contentData = data;}});


	/**
	 * すべての要素のロードが完了したら。
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

console.log('--- editorOnLoad()');
console.log(_moduleDefinitions);
console.log(_contentData);

/*
var tasks = new Tasks([
    {
        title: 'task1',
        completed: true
    },
    {
        title: 'task2'
    },
    {
        title: 'task3'
    }
]);
var tasksView = new TasksView({collection: tasks});
$('#content', _winIframe.document).html(tasksView.render().el);
*/

		var docModules = new _this.cls.collections.documentModules([]);
		var docModulesView = new _this.cls.views.documentModules({collection: docModules});

		for( var i in _moduleDefinitions.list ){
			docModules.add( new _this.cls.models.documentModule({
				key: _moduleDefinitions.list[i].category+'/'+_moduleDefinitions.list[i].id,
				category: _moduleDefinitions.list[i].category,
				id: _moduleDefinitions.list[i].id,
				name: _moduleDefinitions.list[i].name,
				template: _moduleDefinitions.list[i].template
			}) );
		}

		$('#content', _winIframe.document).html( docModulesView.render().el );

// 		_rootNode = new this.cls.models.documentModule({
// 			data: {},
// 			modKey: null,
// 			jqElmCanvas: _elmContent
// 		});
// 		var view = new contModView({model: _rootNode});

// console.log(_rootNode.toJSON());
// console.log(view.render().el);

	}//editorOnLoad()

	/**
	 * モジュール定義の一式を得る
	 */
	this.getModuleDefinitions = function(){
		return _moduleDefinitions;
	}

})();
