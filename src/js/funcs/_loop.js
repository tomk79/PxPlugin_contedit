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
			var _this = this;
			this.model.set('content_data', (function(){
				var valBefore = _this.model.get('content_data');
				if(!valBefore){ valBefore={}; }
				valBefore.val = val;
				return valBefore;
			})());
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
				this.$el.find('input').val(this.model.get('content_data').val);
			}
			return this;
		}
	});

})(window.contConteditor);
