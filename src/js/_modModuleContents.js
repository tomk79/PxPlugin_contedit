/**
 * ドキュメントコンテンツ モデル定義
 */
(function(EDITOR){
	var autoId = 0;//UTODO: 仮実装 ただの連番では困る。

	/**
	 * ドキュメントコンテンツ: モデル
	 */
	EDITOR.cls.models.moduleContent = Backbone.Model.extend({
		defaults:{
			element_id: 'autoid'+(autoId ++),
			module_id: null ,
			content_data: {} ,
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
	EDITOR.cls.collections.moduleContents = Backbone.Collection.extend({
		initialize: function(){
			// console.log('-- document contents collection standby.');
		},
		model: EDITOR.cls.models.moduleContent
	});

	/**
	 * ドキュメントモジュール: ビュー
	 */
	EDITOR.cls.views.moduleContent = Backbone.View.extend({
		tagName: 'div',
		initialize: function() {
			this.model.on('destroy', this.remove, this);
			this.model.on('change', this.render, this);
		},
		events: {
			'click .cont_docCont_edit': 'uiEdit' ,
			'click .cont_docCont_delete': 'uiDestroy',
			'mouseover': 'uiMouseOver',
			'mouseout': 'uiMouseOut'
		},
		uiEdit: function(e) {
			// 要素を編集する
			var module = EDITOR.docModules.get( {id: this.model.get('module_id')} );
			var tplsAll = module.get('template');
			var tpls = [];
			var collection = new EDITOR.cls.collections.uiWinEditElements();
			for( var i in tplsAll ){
				if( tplsAll[i].type != 'func' ){ continue; }
				collection.add(tplsAll[i]);
			}

			// 新規エレメント追加UI
			new EDITOR.cls.views.uiWinEditElements({collection: collection}).setTargetModel(this.model).render();
		},
		uiDestroy: function() {
			// 要素を削除する
			this.model.destroy();
		},
		uiMouseOver: function() {
			this.$el.css({border:'1px solid #ff0000'});
			this.$el.find('button').css({visibility:'visible'});
		},
		uiMouseOut: function() {
			this.$el.css({border:'1px solid transparent'});
			this.$el.find('button').css({visibility:'hidden'});
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
			this.uiMouseOut();
			return this;
		}
	});

	/**
	 * ドキュメントモジュール: コレクションビュー
	 */
	EDITOR.cls.views.moduleContents = Backbone.View.extend({
		tagName: 'div',
		initialize: function() {
			this.collection.on('add', this.addNew, this);
		} ,
		events: {
			// 'click .delete': 'destroy',
			// 'click .cont_addNew': 'addNewtest'
		} ,
		addNew: function(docMod) {
			var docModView = new EDITOR.cls.views.moduleContent({model: docMod});
			this.$el.append(docModView.render().el);
		} ,
		render: function() {
			this.collection.each(function(docMod) {
				var docModView = new EDITOR.cls.views.moduleContent( {model: docMod} );
				this.$el.append( docModView.render().el );
			}, this);
			return this;
		}
	});


})(window.contConteditor);
