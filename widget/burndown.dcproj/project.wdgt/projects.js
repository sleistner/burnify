Resource = new Class({

  configure: function(config) {
    this.element = $(config.type);
    this.type    = config.type;
    this.root    = config.root;
	
	this.element.addEvent('change', this.onChange.bind(this));
  },

  load: function(url) {
	var domain = 'http://localhost:3000';
    new Request.JSON({ url: domain + (url || '/' + this.type), method: 'get', autoCancel: true, onComplete: this.onLoadComplete.bind(this) }).send();
  },

  onLoadComplete: function(items) {
    this.render(items.map(function(it) { return it[this.root] }, this));
	document.fireEvent(this.root + ':changed', items[0][this.root].id);
  },

  render: function(items) {
	this.element.empty().adopt(items.map(this.createItemElement.bind(this)));
  },

  createItemElement: function(it) {
    return new Element('option', { value: it.id }).appendText(it.name);
  },

  onChange: function(event) {
    this.onSelect(event.target.getSelected().get('value'));
  },

  onSelect: function(id) {
    document.fireEvent(this.root + ':changed', id);
  }
});

Projects = new Class({ Extends: Resource,

  title: 'Project',

  initialize: function() {
    this.configure({ type: 'projects', root: 'project' });
    this.load();
    document.addEvent('projects:update', this.onProjectsUpdate.bind(this));
  },

  onProjectsUpdate: function() {
    this.load();
  }
});

Iterations = new Class({ Extends: Resource,

  title: 'Iteration',

  initialize: function() {
    this.configure({ type: 'iterations', root: 'iteration' });
    document.addEvent('project:changed', this.onProjectChanged.bind(this));
    this.render([]);
  },

  onProjectChanged: function(project_id) {
    this.load('/projects/' + project_id + '/' + this.type);
  }
});

window.addEvent('domready', function() {
	var projects = new Projects();
	var iterations = new Iterations();
});