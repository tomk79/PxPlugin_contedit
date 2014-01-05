/**
 * conteditUI モジュール
 */
(function(contConteditor){

	/**
	 * コントロールパネル
	 */
	contConteditor.cls.views.uiAddElement = Backbone.View.extend({
		el: '.conteditUI.conteditUI-controlpanel',
		initialize: function() {
			$('.conteditUI-add_element select').append(contConteditor.docModulesView.mk_modSelectOptions());
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
			contConteditor.save(e.target.href);
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

})(window.contConteditor);
