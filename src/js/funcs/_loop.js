/**
 * conteditUI モジュール loop
 */
(function(EDITOR){

	EDITOR.cls.editElementUiViews.loop = EDITOR.cls.views.uiWinEditElementBase.extend({
		events: {
			'change input': 'update'
		},
		update: function(){
			var val = this.$el.find('input').val();
			var valBefore = this.model.get('content_data');
			if(!valBefore){ valBefore={}; }
			valBefore.count = val;
			valBefore.children = new EDITOR.cls.collections.documentModules({});
			valBefore.childrenView = new EDITOR.cls.views.documentModules({collection: valBefore.children});
			this.model.set('content_data', valBefore);
		} ,
		template: _.template(
			  '<th>Loop</th>'
			+ '<td>'
			+ '<p>繰り返し回数を入力してください。</p>'
			+ '<input type="text" style="width:30px;" /> 回<br />'
			+ '</td>'
		),
		render: function() {
			var template = this.template(this.model.toJSON());
			this.$el.html(template);
			if( this.model.get('content_data') ){
				this.$el.find('input').val(this.model.get('content_data').count);
			}
			return this;
		}
	});

})(window.contConteditor);
