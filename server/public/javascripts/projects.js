
Base = new Class({

  configure: function(config) {
    this.element = $(config.type);
    this.type    = config.type;
    this.root    = config.root;
  },
  
  load: function(url) {
    new Request.JSON({ url: url || '/' + this.type, method: 'get', onComplete: this.render.bind(this) }).send();
  },
  
  render: function(items) {
    var select = new Element('select', { size: 7 }), root = this.root;
    select.addEvent('change', this.onChanged.bind(this));
    
    this.element.empty().adopt(select.adopt(items.map(function(e) { return e[root] }).map(function(item) {
      return new Element('option', { value: item.id }).appendText(item.name);
    }, this)));
  },
  
  onChanged: function(event) {
    document.fireEvent(this.root + ':changed', event.target.getSelected().get('value'));
  }
  
});

Projects = new Class({
  Extends: Base,
  
  initialize: function() {
    this.configure({ type: 'projects', root: 'project' });
    this.load();
  }
});

Iterations = new Class({
  Extends: Base,

  initialize: function() {
    this.configure({ type: 'iterations', root: 'iteration' });
    document.addEvent('project:changed', this.onProjectChanged.bind(this));
  },
  
  onProjectChanged: function(project_id) {
    this.load('/projects/' + project_id + '/' + this.type);
  }
});

Stories = new Class({
  Extends: Base,

  initialize: function() {
    this.configure({ type: 'stories', root: 'story' });
    document.addEvent('iteration:changed', this.onIterationChanged.bind(this));
  },
  
  onIterationChanged: function(iteration_id) {
    this.load('/iterations/' + iteration_id + '/' + this.type);
  }
});

window.addEvent('load', function() {
  projects = new Projects();
  iterations = new Iterations();
  stories = new Stories();
});
