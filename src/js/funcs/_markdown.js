/**
 * conteditUI モジュール markdown
 */
(function(EDITOR){

	EDITOR.cls.editElementUiViews.markdown = EDITOR.cls.views.uiWinEditElementBase.extend({
		events: {
			'change textarea': 'update'
		},
		update: function(){
			var val = this.$el.find('textarea').val();
			this.model.set('content_data', {src: val});
		} ,
		template: _.template(
			  '<th>Markdown</th>'
			+ '<td>'
			+ '<p>マークダウン形式で入力してください。</p>'
			+ '<textarea style="width:100%; height:30em;"></textarea>'
			+ '</td>'
		)
	});

})(window.contConteditor);
