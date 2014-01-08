/**
 * conteditUI モジュール
 */
(function(EDITOR){

	/**
	 * コントロールパネル
	 */
	EDITOR.cls.views.uiControlPanel = Backbone.View.extend({
		el: '.conteditUI.conteditUI-controlpanel',
		initialize: function() {
			$('.conteditUI-add_element select').append(EDITOR.docModulesView.mk_modSelectOptions());
		},
		events: {
			'click .conteditUI-btn_cancel': 'uiCancel',
			'click .conteditUI-btn_save': 'uiSave',
			'submit .conteditUI-add_element': 'uiAddNewElement'
		},
		uiCancel: function(e){
			// キャンセルボタンをクリック
			if( !confirm('編集内容は保存されていません。画面を遷移してもよろしいですか？') ){
				return false;
			}
			$(window).unbind('beforeunload');
			return true;
		},
		uiSave: function(e){
			// 保存ボタンをクリック
			EDITOR.save(e.target.href);
			$(window).unbind('beforeunload');
			return false;
		},
		uiAddNewElement: function(e){
			// 新規要素追加フォーム 送信
			e.preventDefault();

			var selectedValue = $('.conteditUI-add_element select option:selected').attr('value');
			if( !selectedValue ){
				alert('選択してください。');
				return this;
			}
			var val = {
				module_id: selectedValue
			};

			this.collection.add(val);
			return this;
		}
	});

	/**
	 * エレメント編集ウィンドウ (modal window)
	 */
	var _model_uiWinEditElement = Backbone.Model.extend({
		defaults:{
			edit_element_id: null,
			func: 'text',
			type: 'func' ,
			content_data: {}
		},
		initialize: function(){
		}
	});
	EDITOR.cls.collections.uiWinEditElements = Backbone.Collection.extend({
		initialize: function(){
		},
		model: _model_uiWinEditElement
	});
	var _view_uiWinEditElement = Backbone.View.extend({
		tagName: 'tr' ,
		initialize: function() {
		},
		events: {
			'change textarea': 'update'
		},
		update: function(){
			var val = this.$el.find('textarea').val();
			this.model.set('content_data', {src: val});
		} ,
		template: _.template(
			  '<th><%- type %>: <%- func %></th>'
			+ '<td><textarea></textarea></td>'
		),
		render: function() {
			var template = this.template(this.model.toJSON());
			this.$el.html(template);
			if( this.model.get('content_data') ){
				this.$el.find('textarea').val(this.model.get('content_data').src);
			}
			return this;
		}
	});
	EDITOR.cls.views.uiWinEditElements = Backbone.View.extend({
		tagName: 'div',
		initialize: function() {
		},
		events: {
			'click .conteditUI-btn_cancel': 'uiCancel',
			'click .conteditUI-btn_ok': 'uiOk'
		},
		setTargetModel: function(moduleContentModel){
			this.moduleContentModel = moduleContentModel;
			return this;
		},
		uiCancel: function(e){
			e.preventDefault();
			this.remove();
			return false;
		},
		uiOk: function(e){
			e.preventDefault();
			var content_data = {};
			this.collection.each(function(model) {
				content_data[model.get('edit_element_id')] = model.get('content_data');
			}, this);
			this.moduleContentModel.set('content_data', content_data);
			this.remove();
			return false;
		},
		render: function() {
			this.$el
				.addClass('conteditUI')
				.addClass('conteditUI-uiWinEditElements')
				.append(
					  '<div class="conteditUI-uiWinEditElements_brind">'
					+ '</div>'
					+ '<div class="conteditUI-uiWinEditElements_windowBody">'
					+ '<table class="conteditUI-formTable">'
					+ '</table>'
					+ '<div class="conteditUI-uiWinEditElements_btnWrap">'
					+ '<a href="" class="conteditUI-btn_cancel">Cancel</a>'
					+ '<a href="" class="conteditUI-btn_ok">OK</a>'
					+ '</div>'
					+ '</div>'
				)
			;

			var _moduleContentModel = this.moduleContentModel;
			this.collection.each(function(model) {
				model.set('content_data', _moduleContentModel.get('content_data')[model.get('edit_element_id')]);

				var view = new _view_uiWinEditElement( {model: model} );
				this.$el.find('.conteditUI-formTable').append( view.render().el );
			}, this);

			$('body').append(this.$el);
			return this;
		}
	});

})(window.contConteditor);
