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
			_.extend(rtn, this.attributes);

			for( var i in rtn.content_data ){
				if( rtn.content_data[i].children && rtn.content_data[i].children.toJSON ){
					// ネストされたBackboneオブジェクトをJSONに変換
					// console.log('before children.toJSON()');
					rtn.content_data[i].children = rtn.content_data[i].children.toJSON();
					delete rtn.content_data[i].childrenView;
				}
				if( rtn.content_data[i].include && rtn.content_data[i].include.toJSON ){
					// ネストされたBackboneオブジェクトをJSONに変換
					// console.log('before include.toJSON()');
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
				var editElementId = module.get('template')[i].edit_element_id;
				if( !editElementId ){
					continue;
				}
				if( module.get('template')[i].func == 'loop' ){
					// ネストされたloopのJSONをBackboneオブジェクトに変換
					if( this.get('content_data')[editElementId] ){
						if( this.get('content_data')[editElementId].children ){
							var editElementId = editElementId;
							this.attributes.content_data[editElementId].children = new EDITOR.cls.collections.moduleContents( this.attributes.content_data[editElementId].children );
							this.attributes.content_data[editElementId].childrenView = new EDITOR.cls.views.moduleContents({collection: this.attributes.content_data[editElementId].children});
						}
					}
				}
				if( module.get('template')[i].func == 'include' ){
					// ネストされたincludeのJSONをBackboneオブジェクトに変換
					if( this.get('content_data')[editElementId] ){
						if( this.get('content_data')[editElementId].include ){
							this.attributes.content_data[editElementId].include = new EDITOR.cls.models.moduleContent( this.attributes.content_data[editElementId].include );
							this.attributes.content_data[editElementId].includeView = new EDITOR.cls.views.moduleContent({model: this.attributes.content_data[editElementId].include});
// console.log(this.attributes);
// console.log(this.attributes.content_data);
// console.log(this.attributes.content_data[editElementId]);
// console.log(this.attributes.content_data[editElementId].includeView);
						}
					}
				}
			}
			return this;
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
			return this;
		},
		uiDestroy: function() {
			// 要素を削除する
			this.model.destroy();
			return this;
		},
		uiUp: function() {
			// 上に並び替えます。
			alert('[開発中] 上に並び替えます。');
			return this;
		},
		uiDown: function() {
			// 下に並び替えます。
			alert('[開発中] 下に並び替えます。');
			return this;
		},
		uiMouseOver: function() {
			this.$el.css({border:'1px solid #ff0000'});
			this.$el.find('button').css({visibility:'visible'});
			return this;
		},
		uiMouseOut: function() {
			this.$el.css({border:'1px solid transparent'});
			this.$el.find('button').css({visibility:'hidden'});
			return this;
		},
		remove: function() {
			this.$el.remove();
			return this;
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
			return this;
		} ,
		render: function() {
			var template = this.template(this.model.toJSON());
			this.$el.html(template);
			this.uiMouseOut();

			// var contentData = this.model.get('content_data');
			// console.log(this.model.attributes.content_data);
			// if( this.model.attributes.content_data.edit_element_1 ){
			// 	console.log(this.model.attributes.content_data.edit_element_1);
			// 	console.log(this.model.attributes.content_data.edit_element_1.include);
			// 	console.log(this.model.attributes.content_data.edit_element_1.includeView);
			// }
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
			return this;
		} ,
		events: {
			// 'click .delete': 'destroy',
			// 'click .cont_addNew': 'addNewtest'
		} ,
		addNew: function(docMod) {
			var docModView = new EDITOR.cls.views.moduleContent({model: docMod});
			this.$el.append(docModView.render().el);
			return this;
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
