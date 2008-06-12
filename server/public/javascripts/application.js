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

function draw(data) {
  var canvas = $('canvas');
  var ctx = canvas.getContext('2d');
  CanvasTextFunctions.enable(ctx);

  // var dimensions = document.viewport.getDimensions();
  canvas.width =  580;//dimensions.width;
  canvas.height = 360;//dimensions.height;

  var gap = 25;
  var width = canvas.getWidth() - gap;
  var height = canvas.getHeight() -gap;

  var maxX = data.days.length;
  var stepX = width / maxX;

  var rated_days = data.days.filter(function(e) { return e.left != null });
  var max_hours = rated_days.map(function(e){return e.left}).sort(function(a,b) {return a - b}).getLast() + 10;
  var maxY = Math.max(data.hours_estimated, max_hours);
  var stepY = 10;
  var stepsY = maxY / stepY;
  var wideY = (height / stepsY);

  var font = "sans";
  var fontsize = 6;

  var valueY = function(p) {
    return height - p * (height / maxY)
  };

  var valueX = function(day) {
    var entry = data.days.detect(function(e) { return e.day == day });
    return gap + (data.days.indexOf(entry) * stepX);
  };

  // axes
  ctx.beginPath();
  ctx.lineWidth = .5;
  ctx.moveTo(gap, 0);
  ctx.lineTo(gap, height);
  ctx.lineTo(gap + width, height);
  ctx.stroke();
  ctx.save();

  // x
  ctx.lineWidth = .06;
  for(var i = 0; i < maxX; i++) {
    var x = gap + (i * stepX);
    var label = data.days[i].day.toString();
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height + (gap / 2));
    ctx.stroke();
    ctx.drawText(font, fontsize, x - (fontsize / 2), height + (gap / (i % 2 == 0 ? 2 : 1)), label);
    ctx.save();
  }

  for(var i = stepsY; i >= 0; i--) {
    var y = i * wideY;
    ctx.beginPath();
    ctx.moveTo(gap / 2, y);
    ctx.lineTo(gap + width, y);
    ctx.stroke();
    ctx.drawText(font, fontsize, 0, y - (fontsize / 2), (((i - stepsY) * - 1) * stepY) + '');
    ctx.save();
  }

  // optimal line
  ctx.beginPath();
  ctx.lineWidth = .5;
  ctx.moveTo(valueX(data.days[0].day), valueY(data.hours_estimated));
  ctx.lineTo(valueX(data.days.getLast().day), valueY(0));
  ctx.stroke();
  ctx.save();

  ctx.lineWidth = 2;
  ctx.strokeStyle = "green";
  var prev = data.days[0];
  rated_days.each(function(e) {
    ctx.beginPath();
    ctx.moveTo(valueX(prev.day), valueY(prev.left));
    ctx.lineTo(valueX(e.day), valueY(e.left));
    ctx.stroke();
    ctx.save();
    prev = e;
  });
}

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

window.addEvent('load', function(){draw(data)});
