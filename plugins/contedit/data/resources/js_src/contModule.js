// /**
//  * 汎用モジュールクラス
//  */
// function contModule( _contConteditor, _data, _modKey, _elmCanvas ){
// 	var _this = this;
// 	var _modInfo = _contConteditor.getModuleDefinitions().list[_modKey];
// 	if( _modInfo === undefined ){
// 		_modInfo = {
// 			id: null,
// 			name: null,
// 			path_template: null,
// 			template: '{$parts|units|boxes}',
// 			thumb: null,
// 			type: 'root'
// 		};
// 	}

// 	// console.log(_data);
// 	// console.log(_modKey);
// 	// console.log(_modInfo);
// 	// console.log(_contConteditor.getModuleDefinitions());

// 	_elmCanvas.html( _modInfo.template );

// }//contModule()


// backboneのテスト中
(function(){
	window.contModule = Backbone.Model.extend({
		defaults:{
			contConteditor: contConteditor,
			data: {},
			modKey: null,
			jqElmCanvas: $('#content'),
			children: []
		},
		initialize: function(){
			alert('init model contModule');
			console.log(this.toJSON().data);
		}
	});
	window.contModView = Backbone.View.extend({
		tagName: 'div',
		template: _.template('<div><%- data %></div>') ,
		initialize: function(){
			alert('init view contModView');
		} ,
		render: function(){
			var tpl = this.template( this.model.toJSON() );
			this.$el.html(tpl);
			return this;
		}
	});
})();
