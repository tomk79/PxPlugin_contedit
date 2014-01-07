/**
 * ドキュメントコンテンツ モデル定義
 */
(function(EDITOR){

	/**
	 * ドキュメントコンテンツ: モデル
	 */
	EDITOR.cls.models.documentContent = Backbone.Model.extend({
		defaults:{
			module_id: null ,
			data: {} ,
			module_label: 'unknown'
		},
		initialize: function(){
			var module = EDITOR.docModules.get( {id: this.get('module_id')} );
			this.set('module_label', module.get('label') );
		}
	});

	/**
	 * ドキュメントコンテンツ: コレクション
	 */
	EDITOR.cls.collections.documentContents = Backbone.Collection.extend({
		initialize: function(){
			// console.log('-- document contents collection standby.');
		},
		model: EDITOR.cls.models.documentContent
	});

	/**
	 * ドキュメントモジュール: ビュー
	 */
	EDITOR.cls.views.documentContent = Backbone.View.extend({
		tagName: 'div',
		initialize: function() {
			this.model.on('destroy', this.remove, this);
			// this.model.on('change', this.render, this);
		},
		events: {
			'click .cont_docCont_edit': 'uiEdit' ,
			'click .cont_docCont_delete': 'uiDestroy'
		},
		uiEdit: function(e) {
			// 要素を編集する
			var module = EDITOR.docModules.get( {id: this.model.get('module_id')} );
			var tplsAll = module.get('template');
			var tpls = [];
			var collection = new EDITOR.cls.collections.uiWinEditElements();
			for( var i in tplsAll ){
				if( tplsAll[i].type != 'function' ){ continue; }
				collection.add(tplsAll[i]);
			}

			// 新規エレメント追加UI
			var uiWinEditElement = new EDITOR.cls.views.uiWinEditElements({collection: collection});

			// alert('開発中です。');
		},
		uiDestroy: function() {
			// 要素を削除する
			this.model.destroy();
		},
		remove: function() {
			this.$el.remove();
		},
		template: _.template(
			  '<div>'
			+ '<%- module_label %>: <%- module_id %>'
			+ '<button class="cont_docCont_edit">edit</button>'
			+ '<button class="cont_docCont_delete">delete</button>'
			+ '</div>'
		),
		render: function() {
			var template = this.template(this.model.toJSON());
			this.$el.html(template);
			return this;
		}
	});

	/**
	 * ドキュメントモジュール: コレクションビュー
	 */
	EDITOR.cls.views.documentContents = Backbone.View.extend({
		tagName: 'div',
		initialize: function() {
			this.collection.on('add', this.addNew, this);
		} ,
		events: {
			// 'click .delete': 'destroy',
			// 'click .cont_addNew': 'addNewtest'
		} ,
		addNew: function(docMod) {
			var docModView = new EDITOR.cls.views.documentContent({model: docMod});
			this.$el.append(docModView.render().el);
		} ,
		render: function() {
			this.collection.each(function(docMod) {
				var docModView = new EDITOR.cls.views.documentContent( {model: docMod} );
				this.$el.append( docModView.render().el );
			}, this);
			return this;
		}
	});


})(window.contConteditor);
