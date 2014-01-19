/**
 * ドキュメントモジュール モデル定義
 */
(function(EDITOR){

	/**
	 * ドキュメントモジュール: モデル
	 */
	EDITOR.cls.models.documentModule = Backbone.Model.extend({
		idAttribute: 'module_id' ,
		defaults:{
			module_id: null,
			category: null,
			name: null,
			label: 'unknown',
			template: []
		},
		initialize: function(){
			// console.log('--- init model documentModule ---');
			// this.set('id', this.get('module_id') );
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
		} ,
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
				rtn += '<option value="'+docMod.get('module_id')+'">';
				rtn += docMod.get('label');
				rtn += '</option>';
			}, this);
			return rtn;
		}

	});


})(window.contConteditor);
