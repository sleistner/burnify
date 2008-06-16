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

window.addEvent('load', function() {
  iteration_chart = new Chart({ canvas: $('iteration_chart'), width: 600, height: 375 });
  // story_chart = new Chart({ canvas: $('story_chart'), width: 350, height: 250 });
  document.addEvent('iteration:changed', function(iteration_id) {
    var url = '/iterations/' + iteration_id + '/chart_data';
    new Request.JSON({ url: url, method: 'get', onComplete: iteration_chart.render.bind(iteration_chart) }).send();
    // story_chart.render(data);
  });
});