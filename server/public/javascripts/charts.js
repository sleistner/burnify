
Chart = new Class({
  gap: 35,
  font: 'sans',
  fontsize: 10,
  themes: {
    blue: { background: ['#10B0EC', '#fff'], color: '#000' },
    green: { background: ['#90BA2F', '#fff'], color: '#000' },
    dark: { background: ['#333', '#fff'], color: '#000' }
  },
  
  initialize: function(options) {
    this.canvas = options.canvas;
    this.context = this.canvas.getContext('2d');
    this.theme = options.theme || this.themes.blue;
    this.setSize(options.width, options.height);
    this.selected_stories = new Array();
    CanvasTextFunctions.enable(this.context);
    document.addEvent('chart:update', this.load.bind(this));
    document.addEvent('story:changed', this.onStorySelected.bind(this));
  },
  
  load: function(url) {
    if($defined(url)) {
      this.url = url;
    }
    this.resetSelectedStories();
    new Request.JSON({ url: this.url, method: 'get', onComplete: this.render.bind(this) }).send();
  },

  render: function(data) {
    this.updateAttributes(data);
    this.context.strokeStyle = this.theme.color;
    this.drawBackground();
    this.drawAxes();
    this.drawGridLines();
    this.drawExpectedLine(this.data);
    this.drawDevelopingLine(this.data);
    var stories = this.filterStories(this.data.stories);
    stories.each(this.drawExpectedLine.bind(this));
    stories.each(this.drawDevelopingLine.bind(this));
  },

  reRender: function() {
    if($chk(this.data)) {
      this.render(this.data);
    }
  },
  
  drawBackground: function() {
    var lingrad = this.context.createLinearGradient(0, 0, 0, this.canvas.getHeight() / .6);
    for(var i = 0; i < this.theme.background.length; i++) {
      lingrad.addColorStop(Math.max(0, i / 2), this.theme.background[i]);
    }
    this.context.fillStyle = lingrad;
    this.context.fillRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
  },
  
  drawAxes: function() {
    this.context.beginPath();
    this.context.lineWidth = .4;
    this.context.moveTo(this.gap, 0);
    this.context.lineTo(this.gap, this.axis_height);
    this.context.lineTo(this.gap + this.axis_width, this.axis_height);
    this.context.stroke();
    this.context.save();
  },
  
  drawGridLines: function() {
    this.context.lineWidth = .06;
    
    for (var i = 0; i <= this.max_x; i++) {
      var x = this.gap + (i * this.step_x);

      if (i != this.max_x) {
        this.context.beginPath();
        this.context.moveTo(x, 0);
        this.context.lineTo(x, this.axis_height + (this.gap / 2));
        this.context.stroke();
      }
      if (i > 0) {
        var label = this.data.days[i-1].day.toDate().strftime('%d.%m');
        this.context.drawText(this.font, this.fontsize, x - this.gap - 1, this.axis_height + (this.gap / (i % 2 == 0 ? 2.3 : 1.3)), label);
      }
    }

    for (var i = this.steps_y; i >= 0; i--) {
      var y = i * this.wide_y, label = (((i - this.steps_y) * - 1) * this.step_y).toString();
      this.context.beginPath();
      this.context.moveTo(this.gap / 2, y);
      this.context.lineTo(this.gap + this.axis_width, y);
      this.context.stroke();
      this.context.drawText(this.font, this.fontsize, 5, y + (this.fontsize) + 1, label);
    }
  },
  
  drawExpectedLine: function(data) {
    this.context.strokeStyle = data.color;
    this.context.beginPath();
    this.context.lineWidth = .5;
    var first_day_with_history = this.firstDayWithHistory(data.days).day;
    if (first_day_with_history != this.iteration_start_at) {
      this.context.moveTo(this.positionX(this.iteration_start_at) - this.step_x, this.positionY(data.estimated_hours));
      this.context.lineTo(this.positionX(first_day_with_history) - this.step_x, this.positionY(data.estimated_hours));
    }
    this.context.moveTo(this.positionX(first_day_with_history) - this.step_x, this.positionY(data.estimated_hours));
    this.context.lineTo(this.positionX(data.days.getLast().day), this.positionY(0));
    this.context.stroke();
  },
  
  drawDevelopingLine: function(data) {
    if (first_day = this.firstDayWithHistory(data.days)) {
      this.context.lineWidth = 2;
      this.context.strokeStyle = data.color;

      this.context.beginPath();
      this.context.moveTo(this.positionX(first_day.day) - this.step_x, this.positionY(data.estimated_hours));

      this.daysWithHoursLeft(data.days).each(function(e) {
        this.context.lineTo(this.positionX(e.day), this.positionY(e.hours_left));
      }, this);

      this.context.stroke();
    }
  },
  
  setSize: function(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.axis_width = this.canvas.getWidth() - this.gap;
    this.axis_height = this.canvas.getHeight() - this.gap;
    this.reRender();
  },
  
  setTheme: function(theme) {
    this.theme = theme;
    this.reRender();
  },
  
  onStorySelected: function(story_id) {
    with (this.selected_stories) { (contains(story_id) && erase(story_id)) || push(story_id) }
    this.reRender();
  },
  
  positionX: function(value) {
    var entry = this.data.days.detect(function(e) { return e.day == value });
    return this.gap + ((this.data.days.indexOf(entry) + 1) * this.step_x);
  },
  
  positionY: function(value) {
    return this.axis_height - value * (this.axis_height / this.max_y);
  },
  
  resetSelectedStories: function() {
    this.selected_stories.empty();
  },

  updateAttributes: function(data) {
    if (this.data && this.data.id != data.id) { this.resetSelectedStories() }
    this.iteration_start_at = data.start_at;
    this.data = data;
    this.max_x = this.data.days.length;
    this.step_x = this.axis_width / this.max_x;
    this.rated_days = this.daysWithHoursLeft(this.data.days);
    this.max_hours = this.rated_days.map(function(e) { return e.hours_left }).sort(function(a, b) { return a - b }).getLast() + 10;
    this.max_y = Math.max(this.data.estimated_hours, this.max_hours);
    this.step_y = 10;
    this.steps_y = this.max_y / this.step_y;
    this.wide_y = (this.axis_height / this.steps_y);
  },
  
  firstDayWithHistory: function(days) {
    return days.detect(function(day) {
      return day.hours_left != null;
    }) || days[0];
  },
  
  daysWithHoursLeft: function(days) {
    return days.filter(function(e) { return e.hours_left != null });
  },
  
  filterStories: function(stories) {
    var selected_stories = this.selected_stories;
    return (stories || []).filter(function(story) { return selected_stories.contains(story.id) });
  }
  
});
