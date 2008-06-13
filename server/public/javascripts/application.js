var $break = { };

$extend(Array.prototype, {
  
  detect: function(iterator, context) {
    var result, iterator = iterator.bind(context);
    try {
      this.each(function(value, index) {
        if (iterator(value, index)) {
          result = value;
          throw $break;
        }
      });
    } catch(e) {
      if(e != $break) throw e;
    }
    return result;
  }
});

Chart = new Class({
  gap: 30,
  font: 'sans',
  fontsize: 8\,
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
    CanvasTextFunctions.enable(this.context);
  },
  
  render: function(data) {
    this.context.strokeStyle = this.theme.color;
    this.drawBackground();
    this.updateAttributes(data);
    this.drawAxes();
    this.drawGridLines();
    this.drawExpectedLine();
    this.drawDevelopingLine();
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
    
    for(var i = 0; i < this.max_x; i++) {
      var x = this.gap + (i * this.step_x), label = this.data.days[i].day.toString();
      this.context.beginPath();
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.axis_height + (this.gap / 2));
      this.context.stroke();
      this.context.drawText(this.font, this.fontsize, x - (this.fontsize / 2), this.axis_height + (this.gap / (i % 2 == 0 ? 2 : 1)), label);
      this.context.save();
    }

    for(var i = this.steps_y; i >= 0; i--) {
      var y = i * this.wide_y, label = (((i - this.steps_y) * - 1) * this.step_y).toString();
      this.context.beginPath();
      this.context.moveTo(this.gap / 2, y);
      this.context.lineTo(this.gap + this.axis_width, y);
      this.context.stroke();
      this.context.drawText(this.font, this.fontsize, 0, y - (this.fontsize / 2), label);
      this.context.save();
    }
  },
  
  drawExpectedLine: function() {
    this.context.strokeStyle = 'orange';
    this.context.beginPath();
    this.context.lineWidth = .5;
    this.context.moveTo(this.positionX(this.data.days[0].day), this.positionY(this.data.hours_estimated));
    this.context.lineTo(this.positionX(this.data.days.getLast().day), this.positionY(0));
    this.context.stroke();
    this.context.save();
  },
  
  drawDevelopingLine: function() {
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'green';
    var prev = this.data.days[0];
    this.rated_days.each(function(e) {
      this.context.beginPath();
      this.context.moveTo(this.positionX(prev.day), this.positionY(prev.left));
      this.context.lineTo(this.positionX(e.day), this.positionY(e.left));
      this.context.stroke();
      this.context.save();
      prev = e;
    }, this);
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
  
  reRender: function() {
    if($chk(this.data)) {
      this.render(this.data);
    }
  },
  
  positionX: function(value) {
    var entry = this.data.days.detect(function(e) { return e.day == value });
    return this.gap + (this.data.days.indexOf(entry) * this.step_x);
  },
  
  positionY: function(value) {
    return this.axis_height - value * (this.axis_height / this.max_y);
  },
  
  updateAttributes: function(data) {
    this.data = data;
    this.max_x = this.data.days.length;
    this.step_x = this.axis_width / this.max_x;
    this.rated_days = this.data.days.filter(function(e) { return e.left != null });
    this.max_hours = this.rated_days.map(function(e) { return e.left }).sort(function(a, b) { return a - b }).getLast() + 10;
    this.max_y = Math.max(this.data.hours_estimated, this.max_hours);
    this.step_y = 10;
    this.steps_y = this.max_y / this.step_y;
    this.wide_y = (this.axis_height / this.steps_y);
  }
  
});

var data = {
  days: [
    { day: 1 , left: 150 },
    { day: 2 , left: 170 },
    { day: 3 , left: 168 },
    { day: 4 , left: 140 },
    { day: 5 , left: 155 },
    { day: 6 , left: 120 },
    { day: 7 , left: 100 },
    { day: 8 , left: 80 },
    { day: 9 , left: 30 },
    { day: 10, left: null },
    { day: 11, left: null },
    { day: 14, left: null },
    { day: 15, left: null }
  ],
  hours_estimated: 150
};

var c;
window.addEvent('load', function() {
  // c = new Chart({ canvas: $('canvas'), width: 500, height: 300 })
  // c.render(data);
  
});
