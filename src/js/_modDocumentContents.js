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
			console.log('-- document contents collection standby.');
		},
		model: contConteditor.cls.models.documentContent
	});

	/**
	 * ドキュメントモジュール: ビュー
	 */
	contConteditor.cls.views.documentContent = Backbone.View.extend({
		tagName: 'li',
		initialize: function() {
			// this.model.on('destroy', this.remove, this);
			// this.model.on('change', this.render, this);
		},
		events: {
			// 'click .delete': 'destroy',
			// 'click .toggle': 'toggle'
		},
		toggle: function() {
			// this.model.set('completed', !this.model.get('completed'));
		},
		destroy: function() {
			// if (confirm('are you sure?')) {
			// 	this.model.destroy();
			// }
		},
		remove: function() {
			// this.$el.remove();
		},
		template: _.template('<p>TEST: <%- name %></p>'),
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
		tagName: 'ul',
		initialize: function() {
			// this.collection.on('add', this.addNew, this);
		},
		addNew: function(docMod) {
			// var docModView = new contConteditor.cls.views.documentModule({model: docMod});
			// this.$el.append(docModView.render().el);
		},
		render: function() {
			this.collection.each(function(docMod) {
				var docModView = new contConteditor.cls.views.documentModule({model: docMod});
				this.$el.append(docModView.render().el);
			}, this);
			return this;
		}
	});


})(window.contConteditor);
