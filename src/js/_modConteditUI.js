/**
 * conteditUI モジュール
 */
(function(contConteditor){

	/**
	 * モジュール追加フォーム: ビュー
	 */
	contConteditor.cls.views.uiAddElement = Backbone.View.extend({
		el: '.conteditUI.conteditUI-add_element',
		initialize: function() {
			$('.conteditUI.conteditUI-add_element select').append(contConteditor.docModulesView.mk_modSelectOptions());
		},
		events: {
			'submit': 'addNewElement'
		},
		addNewElement: function(e){
			e.preventDefault();

			var selectedValue = $('.conteditUI.conteditUI-add_element select option:selected').attr('value');
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
