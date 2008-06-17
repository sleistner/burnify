
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

  ulClass:        'fx1',
  selectedClass:  'selected',
  titleClass:     'title',
  title:          'FxResource',
  initFadeStep:   300,

  render: function(items) {
    this.selectedElement = undefined;
    this.fadeDuration = this.initFadeStep;
    this.parent(items);
  },

  createContainerElement: function() {
    var container = new Element('ul', { 'class': this.ulClass });
    return container.adopt(new Element('li', { 'class': this.titleClass }).appendText(this.title));
  },

  createItemElement: function(it) {
    var el      = new Element('li').appendText(it.name);
    var overfxs = new Fx.Morph(el, { duration: 300, link: 'cancel' });
    var initfxs = new Fx.Tween(el, { duration: this.fadeDuration, link: 'cancel' });

    el.addEvent('click', this.onSelectItemElement.bind(this, { el: el, id: it.id }));
    el.addEvent('mouseenter', function(e) { overfxs.start('.item_hover'); el.setStyle('cursor', 'pointer') });
    el.addEvent('mouseleave', function(e) { overfxs.start('.item_none');  el.setStyle('cursor', 'auto') });

    initfxs.start('color', '#fff', '#333');
    this.fadeDuration += this.initFadeStep;

    return el;
  },

  onSelectItemElement: function(memo) {
    if ($defined(this.selectedElement)) {
      this.selectedElement.removeClass(this.selectedClass);
    }
    memo.el.addClass(this.selectedClass);
    this.selectedElement = memo.el;
    this.onSelect(memo.id);
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
    document.addEvent('story:changed', this.onStoryChanged.bind(this));
    this.render([]);
  },

  onProjectChanged: function() {
    this.render([]);
  },

  onIterationChanged: function(iteration_id) {
    this.load('/iterations/' + iteration_id + '/' + this.type);
  },

  onStoryChanged: function(story_id) {
    new Request.JSON({ url: '/stories/' + story_id + '/working_days',
      method: 'get',
      onComplete: function(working_days) {
        var dialog = new HistoryDialog(story_id, working_days);
        dialog.show();
      }
    }).send();
  }
});


HistoryDialog = new Class({

  weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

  initialize: function(story_id, working_days) {
    this.story_id     = story_id;
    this.working_days = working_days;
  },

  show: function() {
    jQuery.facebox( this.createHtml());

    this.sfx = new Fx.Scroll('working_days');
    this.sfx.set(0, 0);
    this.storeInputPositions();
  },

  storeInputPositions: function() {
    var offsetY = $('working_days').getPosition().y + $('working_days').getHeight()/2;
    this.inputs.getKeys().each( function(k){
      this.inputs.set(k, $(k).getPosition().y-offsetY+($(k).getHeight()/2));
    }.bind(this));
  },

  createHtml: function() {
    var div = new Element('div', { 'class': 'history_dialog' }).adopt(
      new Element('h1').appendText(this.working_days.title),
      new Element('p').appendText(this.working_days.estimated_hours + ' estimated hours')
    );
    var wd = new Element('div', { 'id': 'working_days' });
    this.inputs = new Hash();
    var table = new Element('table', { 'class': 'working_days', width: '100%' }).adopt( this.working_days.days.map( function(wday) {
      var tr = new Element('tr');
      tr.adopt(new Element('td', { 'class': 'left' }).appendText(this.getFormattedDay(wday.day)));
      this.inputs.set(day_id, 0);
      var input = new Element('input', { value: wday.hours_left, size: 4, id: day_id });
      input.addEvent('change', function(event) {
        new Request({ url: '/stories/' + this.story_id + '/set_hours_left', onComplete: function() {
          document.fireEvent('chart:update');
        }}).send('day='+wday.day+'&hours_left='+input.value);
      }.bind(this));
      
      input.addEvent('focus', function(event) {
        this.sfx.start(0, this.inputs.get(event.target.id));
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


window.addEvent('domready', function() {
  projects   = new Projects();
  iterations = new Iterations();
  stories    = new Stories();
});
