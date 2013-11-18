// backboneのテスト中
(function(){
	window.contModule = Backbone.Model.extend({
		defaults:{
			contConteditor: contConteditor,
			data: {},
			modKey: null,
			jqElmCanvas: $('#content'),
			children: []
		},
		initialize: function(){
			alert('init model contModule');
			console.log(this.toJSON().data);
		}
	});
	window.contModView = Backbone.View.extend({
		tagName: 'div',
		template: _.template('<div><%- data %></div>') ,
		initialize: function(){
			alert('init view contModView');
		} ,
		render: function(){
			var tpl = this.template( this.model.toJSON() );
			this.$el.html(tpl);
			return this;
		}
	});
})();
