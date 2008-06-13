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

window.addEvent('load', function() {
  iteration_chart = new Chart({ canvas: $('iteration_chart'), width: 350, height: 250 });
  story_chart = new Chart({ canvas: $('story_chart'), width: 350, height: 250 });
  document.addEvent('iteration:changed', function(iteration_id) {
    iteration_chart.render(data);
    story_chart.render(data);
  });
});