
Resource = new Class({

  configure: function(config) {
    this.element = $(config.type);
    this.type    = config.type;
    this.root    = config.root;
  },

  load: function(url) {
    new Request.JSON({ url: url || '/' + this.type, method: 'get', autoCancel: true, onComplete: this.onLoadComplete.bind(this) }).send();
  },

  onLoadComplete: function(items) {
    this.render(items.map(function(it) { return it[this.root] }, this));
  },

  render: function(items) {
    this.element.empty().adopt(this.createContainerElement().adopt(items.map(this.createItemElement.bind(this))));
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

  ulClass:            'fx1',
  liClass:            'item',
  itemContainerClass: 'it_c',
  editClass:          'edit',
  selectedClass:      'selected',
  titleClass:         'title',
  title:              'FxResource',
  initFadeStep:       300,

  render: function(items) {
    this.selectedElement = undefined;
    this.fadeDuration = this.initFadeStep;
    this.parent(items);
  },

  createContainerElement: function() {
    var container = new Element('div', { 'class': this.ulClass });
    container.adopt(new Element('div', { 'class': this.itemContainerClass }).adopt(
      new Element('div', { 'class': this.titleClass }).appendText(this.title),
      this.createEditButton(this.onCreate.bind(this, this.root))
    ));
    return container;
  },

  createItemElement: function(it) {
    var el      = new Element('div', { 'class': this.liClass }).appendText(it.name.abbreviate(0, 30));
    var overfxs = new Fx.Morph(el, { duration: 300, link: 'cancel' });
    var initfxs = new Fx.Tween(el, { duration: this.fadeDuration, link: 'cancel' });

    el.addEvent('click', this.onSelectItemElement.bind(this, { el: el, id: it.id }));
    el.addEvent('mouseenter', function(e) { overfxs.start('.item_hover'); el.setStyle('cursor', 'pointer') });
    el.addEvent('mouseleave', function(e) { overfxs.start('.item_none');  el.setStyle('cursor', 'auto') });

    initfxs.start('color', '#fff', '#333');
    this.fadeDuration += this.initFadeStep;

    var editButton = this.createEditButton(this.onEdit.bind(this, it.id));

    return new Element('div', { 'class': this.itemContainerClass }).adopt(el, editButton);
  },

  createEditButton: function(eventHandler) {
    var btn = new Element('div', { 'class': this.editClass });
    btn.addEvent('click', eventHandler);
    return btn;
  },

  onSelectItemElement: function(memo) {
    if ($defined(this.selectedElement)) {
      this.selectedElement.removeClass(this.selectedClass);
    }
    memo.el.addClass(this.selectedClass);
    this.selectedElement = memo.el;
    this.onSelect(memo.id);
  },

  onCreate: function(resource) {
    document.fireEvent(resource + ':create', resource);
  },

  onEdit: function(item_id) {
    document.fireEvent(this.root + ':edit', item_id);
  }
});


Projects = new Class({ Extends: FxResource,

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


Iterations = new Class({ Extends: FxResource,

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


Stories = new Class({ Extends: FxResource,

  title: 'UserStory',

  initialize: function() {
    this.configure({ type: 'stories', root: 'story' });
    document.addEvent('project:changed',   this.onProjectChanged.bind(this));
    document.addEvent('iteration:changed', this.onIterationChanged.bind(this));
    document.addEvent('story:edit',        this.onStoryEdit.bind(this));
    this.render([]);
  },

  onProjectChanged: function() {
    this.render([]);
  },

  onIterationChanged: function(iteration_id) {
    this.load('/iterations/' + iteration_id + '/' + this.type);
  },

  onStoryEdit: function(story_id) {
    createAndShowHistoryDialog(story_id);
  }
});


HistoryDialog = new Class({

  weekDays:     ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  scrollPaneId: 'working_days',

  initialize: function(story_id, working_days) {
    this.story_id     = story_id;
    this.working_days = working_days;
  },

  show: function() {
    jQuery.facebox(this.createHtml());
    this.setupScrollFx();
  },

  getScrollPane: function() {
    return $('working_days');
  },

  setupScrollFx: function() {
    this.srollFx = new Fx.Scroll(this.scrollPaneId, { transition: 'sine:out', link: 'cancel' });
    this.srollFx.set(0, 0);

    var scrollPane = this.getScrollPane();
    var offsetY    = scrollPane.getPosition().y + scrollPane.getHeight()/2;

    this.inputFields.getKeys().each(function(id) {
      var field = $(id);
      this.inputFields.set(id, field.getPosition().y-offsetY+(field.getHeight()/2));
    }.bind(this));
  },

  createHtml: function() {
    var div = new Element('div', { 'class': 'history_dialog' }).adopt(
      new Element('h1').appendText(this.working_days.title),
      new Element('p').appendText(this.working_days.estimated_hours + ' estimated hours'),
      new Element('div', { id: 'rainbow' })
    );
    
    this.inputFields = new Hash();

    var wd = new Element('div', { 'id': 'working_days' });
    var table = new Element('table', { 'class': 'working_days', width: '100%' }).adopt( this.working_days.days.map( function(wday) {
      var tr = new Element('tr');
      tr.adopt(new Element('td', { 'class': 'left' }).appendText(this.getFormattedDay(wday.day)));

      var day_id = this.getDayId(wday.day);
      var input  = new Element('input', { value: wday.hours_left, size: 4, id: day_id });
      this.inputFields.set(day_id, 0);

      input.addEvent('change', function(event) {
        new Request({ url: '/stories/' + this.story_id + '/set_hours_left', onComplete: function() {
          document.fireEvent('chart:update');
        }}).send('day='+wday.day+'&hours_left='+input.value);
      }.bind(this));
      
      input.addEvent('focus', function(event) {
        this.srollFx.start(0, this.inputFields.get(event.target.id));
      }.bind(this));

      return tr.adopt(new Element('td', { 'class': 'right' } ).adopt(input));
    }.bind(this)));

    return div.adopt(wd.adopt(table));
  },

  getFormattedDay: function(day) {
    var day = new Date(day);
    return this.weekDays[day.getDay()] + ", " + day.getDate() + '.' + day.getMonth();
  },

  getDayId: function(day) {
    var day = new Date(day);
    return 'day_' + day.getDate() + day.getMonth();
  }

});

function createAndShowHistoryDialog(story_id) {
  new Request.JSON({ url: '/stories/' + story_id + '/working_days',
    method: 'get',
    onComplete: function(working_days) {
      var dialog = new HistoryDialog(story_id, working_days);
      dialog.show();
    }
  }).send();
};



function SaveProject(form) {
  new Request.JSON({
    url:        form.action,
    method:     form.method,
    onSuccess:  function(json, text, location) {
      jQuery(document).trigger('close.facebox');
      document.fireEvent('projects:update');
    },
    onFailure:  function(xhr, json) {
      console.warn(json);
      $H(json).each(function(pair){
        console.log(pair);// TODO
        $('project_'+pair.key+'_error').innerHTML = pair.value;
      });
    },
  }).send(form.toQueryString());
}


window.addEvent('domready', function() {

  projects   = new Projects();
  iterations = new Iterations();
  stories    = new Stories();

  document.addEvent('project:create', function(resource) {
    jQuery.facebox({ ajax: '/projects/new' })
  });

  document.addEvent('iteration:create', function(resource) {
    console.info('CREATE '+resource);
  });

  document.addEvent('story:create', function(resource) {
    console.info('CREATE '+resource);
  });

  document.addEvent('project:save', SaveProject);
});
