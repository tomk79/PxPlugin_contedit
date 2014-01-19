/**
 * conteditUI モジュール include
 */
(function(EDITOR){

	EDITOR.cls.editElementUiViews.include = EDITOR.cls.views.uiWinEditElementBase.extend({
		events: {
			'change select': 'update'
		} ,
		update: function(){
			var val = this.$el.find('select option:selected').attr('value');
			var valBefore = this.model.get('content_data');
			if(!valBefore){ valBefore={}; }
			valBefore.module_id = val;
			valBefore.include = new EDITOR.cls.models.moduleContent({
				module_id: val
			});
			valBefore.includeView = new EDITOR.cls.views.moduleContent({model: valBefore.include});
			this.model.set('content_data', valBefore);
		} ,
		template: _.template(
			  '<th>インクルード</th>'
			+ '<td>'
			+ '<p>インクルードするモジュールを選択してください。</p>'
			+ '<select class="conteditUI-moduleSelector"><option value="">選択してください。</option></select>'
			+ '</td>'
		) ,
		render: function() {
			var template = this.template(this.model.toJSON());
			this.$el.html(template);
			this.$el.find('select').append(EDITOR.docModulesView.mk_modSelectOptions());
			if( this.model.get('content_data') ){
				this.$el.find('select option[value="'+this.model.get('content_data').module_id+'"]').attr({selected:'selected'});
			}
			return this;
		}
	});

})(window.contConteditor);
