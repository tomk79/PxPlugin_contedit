/**
 * ドキュメントモジュール モデル定義
 */
(function(EDITOR){

	/**
	 * ドキュメントモジュール: モデル
	 */
	EDITOR.cls.models.documentModule = Backbone.Model.extend({
		defaults:{
			id: null,
			category: null,
			name: null,
			label: 'unknown'
		},
		initialize: function(){
			// console.log('--- init model documentModule ---');
			this.set('id', this.get('category')+'/'+this.get('name'));
			// console.log(this.toJSON());
		}
	});

	/**
	 * ドキュメントモジュール: コレクション
	 */
	EDITOR.cls.collections.documentModules = Backbone.Collection.extend({
		initialize: function(){
			// console.log('--- init collection documentModules');
			// console.log(this.toJSON());
		},
		model: EDITOR.cls.models.documentModule
	});

	/**
	 * ドキュメントモジュール: ビュー
	 */
	EDITOR.cls.views.documentModule = Backbone.View.extend({
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
		template: _.template('<%- label %>'),
		render: function() {
			var template = this.template(this.model.toJSON());
			this.$el.html(template);
			return this;
		}
	});

	/**
	 * ドキュメントモジュール: コレクションビュー
	 */
	EDITOR.cls.views.documentModules = Backbone.View.extend({
		tagName: 'select',
		initialize: function() {
			// this.collection.on('add', this.addNew, this);
		} ,
		// addNew: function(docMod) {
		// 	var docModView = new EDITOR.cls.views.documentModule({model: docMod});
		// 	this.$el.append(docModView.render().el);
		// } ,
		render: function() {
			this.collection.each(function(docMod) {
				var docModView = new EDITOR.cls.views.documentModule({model: docMod});
				this.$el.append(docModView.render().el);
			}, this);
			return this;
		} ,
		mk_modSelectOptions: function() {
			// オプション選択要のプルダウンを作成
			var rtn = '';
			this.collection.each(function(docMod) {
				rtn += '<option value="'+docMod.get('id')+'">';
				rtn += docMod.get('label');
				rtn += '</option>';
			}, this);
			return rtn;
		}

	});


})(window.contConteditor);
