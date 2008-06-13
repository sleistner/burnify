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
  iteration_chart = new Chart({ canvas: $('iteration_chart'), width: 350, height: 250 });
  story_chart = new Chart({ canvas: $('story_chart'), width: 350, height: 250 });
  document.addEvent('iteration:changed', function(iteration_id) {
    console.log('iteration_id', iteration_id);
    new Request.JSON({ url: '/iterations/' + iteration_id + '/chart_data', method: 'get', onComplete: function(data) {
        iteration_chart.render(data);
      } 
    }).send();
    // story_chart.render(data);
  });
});