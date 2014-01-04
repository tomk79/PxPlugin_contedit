/**
 * ドキュメントコンテンツ モデル定義
 */
(function(contConteditor){

	/**
	 * ドキュメントコンテンツ: モデル
	 */
	contConteditor.cls.models.documentContent = Backbone.Model.extend({
		defaults:{
			module_id: null,
			name: 'unknown'
		},
		initialize: function(){
			// this.set('key', this.get('category')+'/'+this.get('id'));
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
			+ 'TEST: <%- name %>: <%- module_id %>'
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
			return this;
		} ,

		events: {
			// 'click .delete': 'destroy',
			// 'click .cont_addNew': 'addNewtest'
		}
		// addNewtest: function(){
		// 	// alert('増やします。');
		// 	var selectedValue = $('.cont_form_addElement select option:selected', contConteditor.winIframe.document).attr('value');
		// 	if( !selectedValue ){
		// 		return this;
		// 	}
		// 	var val = {};
		// 	val.module_id = selectedValue;
		// 	this.collection.add(val);
		// 	return this;
		// }

	});


})(window.contConteditor);
