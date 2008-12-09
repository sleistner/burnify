
$namespace('burnify.replay');

burnify.replay.Goto = function(memo) {
  //console.log('burnify.replay.Goto', memo);

  document.fireEvent('project:changed', memo.project);
  if ($defined(memo.iteration)) {
    document.fireEvent('iteration:changed', memo.iteration);
  }
  if ($defined(memo.story)) {
    document.fireEvent('story:changed', memo.story);
  }
}


window.addEvent('domready', function() {
  try {
    var replay = JSON.decode($('replay').textContent);

    if ($defined(replay.flash)) {
      document.fireEvent('status:show:message', replay.flash, 20);
    }
    if ($defined(replay.goto)) {
      burnify.replay.Goto(replay.goto);
    }
    
  } catch (ex) {
  }
});

