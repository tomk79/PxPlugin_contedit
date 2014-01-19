/**
 * ドキュメントコンテンツ モデル定義
 */
(function(EDITOR){
	var autoId = 0;//UTODO: 仮実装 ただの連番では困る。

	/**
	 * ドキュメントコンテンツ: モデル
	 */
	EDITOR.cls.models.moduleContent = Backbone.Model.extend({
		defaults:{
			content_id: null,// id だと永続化処理(?)が走るので、この名前は避けた。
			module_id: null ,
			content_data: [] ,
			module_label: 'unknown'
		},
		toJSON: function(){
			var rtn = {};
			rtn = this.attributes;

			for( var i in rtn.content_data ){
				if( rtn.content_data[i].children ){
					// ネストされたBackboneオブジェクトをJSONに変換
					console.log('before children.toJSON()');
					rtn.content_data[i].children = rtn.content_data[i].children.toJSON();
					delete rtn.content_data[i].childrenView;
				}
				if( rtn.content_data[i].include ){
					// ネストされたBackboneオブジェクトをJSONに変換
					console.log('before include.toJSON()');
					rtn.content_data[i].include = rtn.content_data[i].include.toJSON();
					delete rtn.content_data[i].includeView;
				}
			}
			return rtn;
		},
		initialize: function(){
			// console.log('initialize contents model');
			if( !this.get('content_id') && this.collection ){
				// ↑includeされたモジュールの場合、collection が存在しない。
				// ↑かつ、includeを含むコンテンツ自体がIDを持ってるので、ここでIDを振る必要はない。
				while( 1 ){
					var val = 'autoid'+(autoId ++);
					if( this.collection.get({content_id: val}) ){
						continue;
					}
					this.set('content_id', val );
					break;
				}
			}
			var module = EDITOR.docModules.get( {id: this.get('module_id')} );
			this.set('module_label', module.get('label') );

			for( var i in module.get('template') ){
				if( !module.get('template')[i].edit_element_id ){
					continue;
				}
				if( module.get('template')[i].func == 'loop' ){
					// ネストされたloopのJSONをBackboneオブジェクトに変換
					if( this.get('content_data')[module.get('template')[i].edit_element_id] ){
						if( this.get('content_data')[module.get('template')[i].edit_element_id].children ){
							var contentData = this.get('content_data');
							contentData[module.get('template')[i].edit_element_id].children = new EDITOR.cls.collections.moduleContents( contentData[module.get('template')[i].edit_element_id].children );
							contentData[module.get('template')[i].edit_element_id].childrenView = new EDITOR.cls.views.moduleContents({collection: contentData[module.get('template')[i].edit_element_id].children});
							this.set( 'content_data', contentData );
						}
					}
				}
				if( module.get('template')[i].func == 'include' ){
					// ネストされたincludeのJSONをBackboneオブジェクトに変換
					if( this.get('content_data')[module.get('template')[i].edit_element_id] ){
						if( this.get('content_data')[module.get('template')[i].edit_element_id].include ){
							var contentData = this.get('content_data');
							contentData[module.get('template')[i].edit_element_id].include = new EDITOR.cls.collections.moduleContents( [contentData[module.get('template')[i].edit_element_id].include] );
							contentData[module.get('template')[i].edit_element_id].includeView = new EDITOR.cls.views.moduleContents({collection: contentData[module.get('template')[i].edit_element_id].include});
							this.set( 'content_data', contentData );
						}
					}
				}
			}
		}
	});

	/**
	 * ドキュメントコンテンツ: コレクション
	 */
	EDITOR.cls.collections.moduleContents = Backbone.Collection.extend({
		initialize: function(){
		},
		model: EDITOR.cls.models.moduleContent
	});

	/**
	 * ドキュメントモジュール: ビュー
	 */
	EDITOR.cls.views.moduleContent = Backbone.View.extend({
		tagName: 'div',
		initialize: function() {
			this.model.on('destroy', this.remove, this);
			this.model.on('change', this.render, this);
		},
		events: {
			'click .cont_docCont_edit': 'uiEdit' ,
			'click .cont_docCont_up': 'uiUp',
			'click .cont_docCont_down': 'uiDown',
			'click .cont_docCont_delete': 'uiDestroy',
			'mouseover': 'uiMouseOver',
			'mouseout': 'uiMouseOut'
		},
		uiEdit: function(e) {
			// 要素を編集する
			var module = EDITOR.docModules.get( {id: this.model.get('module_id')} );
			var tplsAll = module.get('template');
			var tpls = [];
			var collection = new EDITOR.cls.collections.uiWinEditElements();
			for( var i in tplsAll ){
				if( tplsAll[i].type != 'func' ){ continue; }
				collection.add(tplsAll[i]);
			}

			// 新規エレメント追加UI
			new EDITOR.cls.views.uiWinEditElements({collection: collection})
				.setTargetModel(this.model)
				.render()
			;
		},
		uiDestroy: function() {
			// 要素を削除する
			this.model.destroy();
		},
		uiUp: function() {
			// 上に並び替えます。
			alert('[開発中] 上に並び替えます。');
		},
		uiDown: function() {
			// 下に並び替えます。
			alert('[開発中] 下に並び替えます。');
		},
		uiMouseOver: function() {
			this.$el.css({border:'1px solid #ff0000'});
			this.$el.find('button').css({visibility:'visible'});
		},
		uiMouseOut: function() {
			this.$el.css({border:'1px solid transparent'});
			this.$el.find('button').css({visibility:'hidden'});
		},
		remove: function() {
			this.$el.remove();
		},
		template: _.template(
			  '<div>'
			+ '<%- module_label %>: <%- module_id %>'
			+ '<button class="cont_docCont_edit">edit</button>'
			+ '<button class="cont_docCont_up">↑</button>'
			+ '<button class="cont_docCont_down">↓</button>'
			+ '<button class="cont_docCont_delete">delete</button>'
			+ '<div class="conteditUI-children"></div>'
			+ '</div>'
		),
		update: function(){
			alert('updated');
		} ,
		render: function() {
			var template = this.template(this.model.toJSON());
			this.$el.html(template);
			this.uiMouseOut();

			// var contentData = this.model.get('content_data');
			// console.log(this.model.get('content_data').edit_element_1);
			// console.log(this.model.get('content_data').edit_element_1.include);
			// console.log(this.model.get('content_data').edit_element_1.includeView);
			// console.log( this.model );
			// console.log( contentData.includeView );
			// this.$el.find('conteditUI-children')
			// 	.html( contentData.includeView.render().el )
			// ;

			return this;
		}
	});

	/**
	 * ドキュメントモジュール: コレクションビュー
	 */
	EDITOR.cls.views.moduleContents = Backbone.View.extend({
		tagName: 'div',
		initialize: function() {
			this.collection.on('add', this.addNew, this);
		} ,
		events: {
			// 'click .delete': 'destroy',
			// 'click .cont_addNew': 'addNewtest'
		} ,
		addNew: function(docMod) {
			var docModView = new EDITOR.cls.views.moduleContent({model: docMod});
			this.$el.append(docModView.render().el);
		} ,
		render: function() {
			this.collection.each(function(docMod) {
				var docModView = new EDITOR.cls.views.moduleContent( {model: docMod} );
				this.$el.append( docModView.render().el );
			}, this);
			return this;
		}
	});


})(window.contConteditor);
