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

String.prototype.abbreviate = function(offset, maxWidth) {
  if(maxWidth < 4) {
    throw new Error('Minimum abbreviation width is 4');
  }
  if(this.length <= maxWidth) {
    return this;
  }
  if(offset > this.length) {
    offset = this.length;
  }
  if((this.length - offset) < (maxWidth - 3)) {
    offset = this.length - (maxWidth - 3);
  }
  if(offset <= 4) {
    return this.substring(0, maxWidth - 3) + '...';
  }
  if(maxWidth < 7) {
    throw new Error('Minimum abbreviation width with offset is 7');
  }
  if((offset + (maxWidth - 3)) < thie.length) {
    return '...' + this.abbreviate(this.substring(offset), 0, maxWidth - 3);
  }
  return '...' + this.substring(this.length - (maxWidth - 3));
}

Request.JSON.implement({

  success: function(text){
    try {
      this.response.json = JSON.decode(text, this.options.secure);
    } catch (ex) {}
    this.onSuccess(this.response.json, text, this.getHeader('Location'));
  },

  onFailure: function(){
    var json = null;
    try {    
      json = JSON.decode(this.xhr.responseText, this.options.secure);
    } catch (ex) {}
    this.fireEvent('onComplete').fireEvent('onFailure', [this.xhr, json]);
  }
});


window.addEvent('domready', function() {
  chart = new Chart({ canvas: $('iteration_chart'), width: 600, height: 375 });
  document.addEvent('iteration:changed', function(iteration_id) {
    chart.load('/iterations/' + iteration_id + '/chart_data');
  });
});