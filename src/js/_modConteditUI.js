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
			return true;
		},
		uiSave: function(e){
			// 保存ボタンをクリック
			EDITOR.save(e.target.href);
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
	EDITOR.cls.models.uiWinEditElement = Backbone.Model.extend({
		defaults:{
		},
		initialize: function(){
		}
	});
	EDITOR.cls.collections.uiWinEditElements = Backbone.Collection.extend({
		initialize: function(){
		},
		model: EDITOR.cls.models.uiWinEditElement
	});
	EDITOR.cls.views.uiWinEditElement = Backbone.View.extend({
	});
	EDITOR.cls.views.uiWinEditElements = Backbone.View.extend({
		tagName: 'div',
		initialize: function() {
			this.render();
		},
		events: {
			'click .conteditUI-btn_cancel': 'uiCancel',
			'click .conteditUI-btn_ok': 'uiOk'
		},
		uiCancel: function(e){
			e.preventDefault();
			this.remove();
			return false;
		},
		uiOk: function(e){
			e.preventDefault();
			alert('UTODO: 開発中です。');
			this.remove();
			return false;
		},
		render: function() {
			console.log(this);
			this.$el
				.addClass('conteditUI')
				.addClass('conteditUI-uiWinEditElements')
				.css({
				})
				.append(
					  '<div class="conteditUI-uiWinEditElements_brind">'
					+ '</div>'
					+ '<div class="conteditUI-uiWinEditElements_windowBody">'
					+ '<p>開発中</p>'
					+ '<a href="" class="conteditUI-btn_cancel">Cancel</a>'
					+ '<a href="" class="conteditUI-btn_ok">OK</a>'
					+ '</div>'
				)
			;

			this.collection.each(function(docMod) {
				var docModView = new EDITOR.cls.views.uiWinEditElement( {model: docMod} );
				this.$el.append( docModView.render().el );
			}, this);

			$('body').append(this.$el);
			return this;
		}
	});

})(window.contConteditor);
