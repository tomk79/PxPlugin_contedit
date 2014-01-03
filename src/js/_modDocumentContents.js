/**
 * ドキュメントコンテンツ モデル定義
 */
(function(contConteditor){

	/**
	 * ドキュメントコンテンツ: モデル
	 */
	contConteditor.cls.models.documentContent = Backbone.Model.extend({
		defaults:{
			key: null,
			category: null,
			id: null,
			name: 'unknown'
		},
		initialize: function(){
			this.set('key', this.category+'/'+this.id);
		}
	});

	/**
	 * ドキュメントコンテンツ: コレクション
	 */
	contConteditor.cls.collections.documentContents = Backbone.Collection.extend({
		initialize: function(){
			// console.log('-- document contents collection standby.');
		},
		model: contConteditor.cls.models.documentContent
	});

	/**
	 * ドキュメントモジュール: ビュー
	 */
	contConteditor.cls.views.documentContent = Backbone.View.extend({
		tagName: 'div',
		initialize: function() {
			this.model.on('destroy', this.remove, this);
			// this.model.on('change', this.render, this);
		},
		events: {
			// 'click .toggle': 'toggle',
			'click .cont_docCont_delete': 'destroy'
		},
		toggle: function() {
			// this.model.set('completed', !this.model.get('completed'));
		},
		destroy: function() {
			// 要素を削除する
			this.model.destroy();
		},
		remove: function() {
			this.$el.remove();
		},
		template: _.template(
			  '<div>'
			+ 'TEST: <%- name %>: <%- key %>'
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
	contConteditor.cls.views.documentContents = Backbone.View.extend({
		tagName: 'div',
		initialize: function() {
			this.collection.on('add', this.addNew, this);
		} ,

		addNew: function(docMod) {
			// alert('ここで増やす処理。');
			var docModView = new contConteditor.cls.views.documentContent({model: docMod});
			this.$el.append(docModView.render().el);
		} ,

		render: function() {
			this.collection.each(function(docMod) {
				var docModView = new contConteditor.cls.views.documentContent( {model: docMod} );
				this.$el.append( docModView.render().el );
			}, this);
			this.$el.append(
				  '<div class="cont_form_addElement">'
				+ '<select name="cont_form_addElement_modId"><option name="">選択してください</option>'+contConteditor.docModulesView.mk_modSelectOptions()+'</select>'
				+ '<button href="javascript:;" class="cont_addNew">要素を増やす</button>'
				+ '</div>'
			);
			return this;
		} ,

		events: {
			// 'click .delete': 'destroy',
			'click .cont_addNew': 'addNewtest'
		},
		addNewtest: function(){
			// alert('増やします。');
			this.collection.add({});
		}

	});


})(window.contConteditor);
