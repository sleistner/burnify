$namespace('burnify.status');

burnify.status.StatusBar = new function() {

  var divIDs = ['statusbar'];

  var messageId = 0;
  var clearEffects = {};

  // message can be plain text or complex html.
  // duration in seconds. (default is 6.0)
  //
  // if duration is negative, the message will never disappear,
  // otherwise the message will disappear after given duration.
  //
  document.addEvent('status:show:message', function(message, duration) {
    burnify.status.StatusBar.showMessage(message, duration);
  });

  document.addEvent('status:show:loading', function() {
    burnify.status.StatusBar.showMessage('loading <img align="top" border="0" alt="loading" src="/images/statusbar-loading.gif"/>', -1);
  });

  document.addEvent('status:hide', function() {
    burnify.status.StatusBar.clear(messageId);
  });

  var cancelClearEffects = function(id) {
    if (clearEffects[id] != null) {
      clearEffects[id].cancel();
      clearEffects[id] = null;
    }
  }

  // *** please don't use this method directly:
  //   use the 'status:show:message' event instead!! ***
  this.showMessage = function(message, duration) {
    duration = $defined(duration) ? duration*1000 : 6000;
    if (message != null) {
      divIDs.each(function(id) {
        cancelClearEffects(id);
        $(id).innerHTML = message;
        $(id).setStyle('opacity', '1.0');
        var effect = new Fx.Morph(id, {duration: 'long', transition: Fx.Transitions.Sine.easeOut});
        effect.start({ 'background-color': ['#ffff00', '#f0f0f0'] });
      });
      ++messageId;
      if (duration > 0) {
        setTimeout('burnify.status.StatusBar.clear('+messageId+')', 1500+duration);
      }
    } else {
      divIDs.each(function(id){ $(id).innerHTML = '' });
    }
  };

  this.clear = function(m_id) {
    if (messageId == m_id) {
      divIDs.each(function(id) {
        if (clearEffects[id] == null) {
          clearEffects[id] = new Fx.Morph(id, {
            duration: 'long',
            transition: Fx.Transitions.Sine.easeOut,
            complete: function(){ clearEffects[id] = null }
          });
          clearEffects[id].start({ 'opacity': '0.0' });
        }
      });
    }
  };
}