$namespace('burnify.chart');

burnify.chart.BurnifyChart = new Class({

  initialize: function(container_element_id, size) {

    this.container_element_id = container_element_id;
    this.size = size;

    // Make a graph object with canvas id and width
    var g = this.bluff = new Bluff.Line(container_element_id, size);
    
    // Set theme and options
    g.theme_37signals();
    //g.title = 'Burnify';
    
    // Add data and labels
    /*
    g.data('Apples', [1, 2, 3, 4, 4, 3]);
    g.data('Oranges', [4, 8, 7, 9, 8, 9]);
    g.data('Watermelon', [2, 3, 1, 5, 6, 8]);
    g.data('Peaches', [9, 9, 10, 8, 7, 9]);
    g.labels = {0: '2003', 2: '2004', 4: '2005'};
    */
    
    // Render the graph
    //g.draw();
  },

  initBluff: function() {
    var g = new Bluff.Line(this.container_element_id, this.size);
    g.theme_37signals();
    return g;
  },

  loadIteration: function(url) {
    if($defined(url)) { this.url = url; }
    new Request.JSON({ url: this.url, method: 'get', onComplete: this.showIteration.bind(this) }).send();
  },

  showIteration: function(iteration) {
    var g = this.initBluff();

    g.title = iteration.project.name;

    var labels = {}, n = 0;
    iteration.days.forEach(function(day) {
      labels[n++] = day.day.toDate().strftime('%d.%m');
    });
    g.labels = labels;
   
    /*
    var ideal_data = new Array(iteration.days.length);
    ideal_data[0] = iteration.estimated_hours;
    ideal_data[iteration.days.length-1] = 0;
    g.data('ideal', ideal_data, '#cccccc');
    */

    var graph_data = this.compactGraphData(iteration.days.map(function(day){ return day.hours_left }));
    //var graph_data = iteration.days.map(function(day){ return day.hours_left });
    g.data(iteration.title, graph_data, iteration.color);

    g.minimum_value = 0;
    g.maximum_value = iteration.estimated_hours;

    g.draw();
  },

  compactGraphData: function(graph_data) {
    var new_data = [];
    graph_data.forEach(function(v){ new_data.push(v == null ? undefined : v) });
    return new_data;
  }
});

window.addEvent('domready', function() {
    
  var chart = new burnify.chart.BurnifyChart('iteration_chart', '650x400');

  document.addEvent('iteration:changed', function(iteration_id) {
    chart.loadIteration('/iterations/' + iteration_id + '/chart_data');
  });
});

