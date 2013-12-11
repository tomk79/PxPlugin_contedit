/**
 * モデル定義
 */
(function(contConteditor){

	/**
	 * ドキュメントモジュール: モデル
	 */
	contConteditor.cls.models.documentModule = Backbone.Model.extend({
		defaults:{
			key: '',
			category: '',
			id: '',
			name: '',
			template: []
		},
		initialize: function(){
			console.log('--- init model documentModule');
			console.log(this.toJSON());
		}
	});

	/**
	 * ドキュメントモジュール: コレクション
	 */
	contConteditor.cls.collections.documentModules = Backbone.Collection.extend({
		initialize: function(){
			console.log('--- init collection documentModules');
			// console.log(this.toJSON().data);
		},
		model: contConteditor.cls.models.documentModule
	});

	/**
	 * ドキュメントモジュール: ビュー
	 */
	contConteditor.cls.views.documentModule = Backbone.View.extend({
		tagName: 'li',
		initialize: function() {
			// this.model.on('destroy', this.remove, this);
			// this.model.on('change', this.render, this);
		},
		events: {
			// 'click .delete': 'destroy',
			// 'click .toggle': 'toggle'
		},
		toggle: function() {
			// this.model.set('completed', !this.model.get('completed'));
		},
		destroy: function() {
			// if (confirm('are you sure?')) {
			// 	this.model.destroy();
			// }
		},
		remove: function() {
			// this.$el.remove();
		},
		template: _.template('<%- name %>'),
		render: function() {
			var template = this.template(this.model.toJSON());
			this.$el.html(template);
			return this;
		}
	});

	/**
	 * ドキュメントモジュール: コレクションビュー
	 */
	contConteditor.cls.views.documentModules = Backbone.View.extend({
		tagName: 'ul',
		initialize: function() {
			// this.collection.on('add', this.addNew, this);
		},
		addNew: function(docMod) {
			// var docModView = new contConteditor.cls.views.documentModule({model: docMod});
			// this.$el.append(docModView.render().el);
		},
		render: function() {
			this.collection.each(function(docMod) {
				var docModView = new contConteditor.cls.views.documentModule({model: docMod});
				this.$el.append(docModView.render().el);
			}, this);
			return this;
		}
	});


/*
<script type="text/template" id="task-template">
<input type="checkbox" class="toggle" <%= completed ? 'checked': '' %>>
<span class="<%= completed ? 'completed' : '' %>">
<%- title %>
</span>
<span class="delete">[x]</span>
</script>





var Task = Backbone.Model.extend({
	defaults: {
		title: 'do something',
		completed: false
	}
});
var Tasks = Backbone.Collection.extend({
	model: Task
});

var TaskView = Backbone.View.extend({
    tagName: 'li',
    initialize: function() {
        this.model.on('destroy', this.remove, this);
        this.model.on('change', this.render, this);
    },
    events: {
        'click .delete': 'destroy',
        'click .toggle': 'toggle'
    },
    toggle: function() {
        this.model.set('completed', !this.model.get('completed'));
    },
    destroy: function() {
        if (confirm('are you sure?')) {
            this.model.destroy();
        }
    },
    remove: function() {
        this.$el.remove();
    },
    template: _.template($('#task-template').html()),
    render: function() {
        var template = this.template(this.model.toJSON());
        this.$el.html(template);
        return this;
    }
});
var TasksView = Backbone.View.extend({
    tagName: 'ul',
    initialize: function() {
        this.collection.on('add', this.addNew, this);
    },
    addNew: function(task) {
        var taskView = new TaskView({model: task});
        this.$el.append(taskView.render().el);
    },
    render: function() {
        this.collection.each(function(task) {
            var taskView = new TaskView({model: task});
            this.$el.append(taskView.render().el);
        }, this);
        return this;
    }
});

var AddTaskView = Backbone.View.extend({
    el: '#addTask',
    events: {
        'submit': 'submit'
    },
    submit: function(e) {
        e.preventDefault();
        var task = new Task({title: $('#title').val()});
        this.collection.add(task);
    }
});

var tasks = new Tasks([
    {
        title: 'task1',
        completed: true
    },
    {
        title: 'task2'
    },
    {
        title: 'task3'
    }
]);

var tasksView = new TasksView({collection: tasks});
var addTaskView = new AddTaskView({collection: tasks});

$('#tasks').html(tasksView.render().el);

*/

})(contConteditor);
