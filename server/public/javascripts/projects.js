
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
    container.addEvent('change', this.onChange.bind(this));
    return container;
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


FxResource = new Class({ Extends: Resource,

  ulClass:        'fx1',
  // selectedClass:  'selected',
  titleClass:     'title',
  title:          'FxResource',

  createContainerElement: function() {
    var container = new Element('ul', { class: this.ulClass });
    container.adopt(new Element('li', { class: this.titleClass }).appendText(this.title));
    return container;
  },

  createItemElement: function(it) {
    var el      = new Element('li').appendText(it.name);
    var overfxs = new Fx.Morph(el, { duration: 300, link: 'cancel' });

    el.addEvent('click', this.onSelect.bind(this, it.id));
    el.addEvent('mouseenter', function(e) { overfxs.start('.item_hover'); el.setStyle('cursor', 'pointer') });
    el.addEvent('mouseleave', function(e) { overfxs.start('.item_none');  el.setStyle('cursor', 'auto') });

    return el;
  }
});


Projects = new Class({ Extends: FxResource,

  title: 'Project',

  initialize: function() {
    this.configure({ type: 'projects', root: 'project' });
    this.load();
  }
});


Iterations = new Class({ Extends: FxResource,

  title: 'Iteration',

  initialize: function() {
    this.configure({ type: 'iterations', root: 'iteration' });
    document.addEvent('project:changed', this.onProjectChanged.bind(this));
  },

  onProjectChanged: function(project_id) {
    this.load('/projects/' + project_id + '/' + this.type);
  }
});


Stories = new Class({ Extends: FxResource,

  title: 'UserStory',

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
