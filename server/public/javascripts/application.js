var $break = { };

Array.implement({
  
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

window.addEvent('domready', function() {
  chart = new Chart({ canvas: $('iteration_chart'), width: 600, height: 375 });
  document.addEvent('iteration:changed', function(iteration_id) {
    chart.load('/iterations/' + iteration_id + '/chart_data');
  });
});