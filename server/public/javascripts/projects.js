
Resource = new Class({

  configure: function(config) {
    this.element = $(config.type);
    this.type    = config.type;
    this.root    = config.root;
  },

  load: function(url) {
    new Request.JSON({url: url || '/' + this.type, method: 'get', onComplete: this.onLoadComplete.bind(this) }).send();
  },

  onLoadComplete: function(items) {
    this.render(items.map(function(it) { return it[this.root] }, this));
  },

  render: function(items) {
    this.element.empty().adopt( this.createContainerElement().adopt( items.map( function(it) {
      return this.createItemElement(it);
    }, this)));
  },

  createContainerElement: function() {
    var container = new Element('select', { size: 7 });
    container.addEvent('change', this.onChanged.bind(this));
    return container;
  },

  createItemElement: function(it) {
    return new Element('option', { value: it.id }).appendText(it.name);
  },

  onChanged: function(event) {
    document.fireEvent(this.root + ':changed', event.target.getSelected().get('value'));
  }

});


Projects = new Class({
  Implements: Resource,
  
  initialize: function() {
    this.configure({ type: 'projects', root: 'project' });
    this.load();
  }
});


Iterations = new Class({
  Implements: Resource,

  initialize: function() {
    this.configure({ type: 'iterations', root: 'iteration' });
    document.addEvent('project:changed', this.onProjectChanged.bind(this));
  },

  onProjectChanged: function(project_id) {
    this.load('/projects/' + project_id + '/' + this.type);
  }
});


Stories = new Class({
  Implements: Resource,

  initialize: function() {
    this.configure({ type: 'stories', root: 'story' });
    document.addEvent('iteration:changed', this.onIterationChanged.bind(this));
  },

  onIterationChanged: function(iteration_id) {
    this.load('/iterations/' + iteration_id + '/' + this.type);
  }
});



window.addEvent('load', function() {
  projects   = new Projects();
  iterations = new Iterations();
  stories    = new Stories();
});
