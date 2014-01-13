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
			var _this = this;
			this.model.set('content_data', (function(){
				var valBefore = _this.model.get('content_data');
				if(!valBefore){ valBefore={}; }
				valBefore.val = val;
				return valBefore;
			})());
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
				this.$el.find('select option[value="'+this.model.get('content_data').val+'"]').attr({selected:'selected'});
			}
			return this;
		}
	});

})(window.contConteditor);
