function updateLineNumbers(lf, delta) {

  // TODO: Update line number divs only when they become visible
  // https://codepen.io/tutsplus/pen/yppgrm
  if (delta == 0) {
    util.log("delta = 0. No update needed.",'updateLineNumbers',1);
    $('#display').find('.added').removeClass('added');
    return;
  };

  var startTime = util.tic();

  var els = $('#display').find('[lo]');

  util.log("# elements with lo attribute: " + els.length,'updateLineNumbers',1);
  //delta = delta < 0 ? 0 : delta;
  els.each( (idx, el) => {
    var el_lo = parseInt($(el).attr('lo'));
    var el_lf = parseInt($(el).attr('lf')) || el_lo;
    util.log('lf = ' + lf + 
        '; el_lo = ' + el_lo + 
        '; el_lf = ' + el_lf +
        '; delta = ' + delta +
        '; hasClass("added") = ' + $(el).hasClass('added'),
        'updateLineNumbers',1);
    if (delta < 0 & el_lf > lf) {
      util.log('Updating to lo = ' + (el_lo+delta) + "; lf = " + (el_lf + delta),
          'updateLineNumbers',1);
      $(el).attr({'lo': el_lo + delta, 'lf': el_lf + delta});
      if (app['showLineNumbers']['preview']) {
        var next = $(el).next();  
        if (next.hasClass('line-number')) {
          if (el_lo == el_lf) {
            next.html((el_lo + delta));
          } else {
            next.html((el_lo + delta) + '-' + (el_lf + delta));
          }
        }
      }
    }
    if (delta > 0 && el_lo >= lf - delta && !$(el).hasClass('added')) {
      util.log('Updating to lo = ' + (el_lo+delta) + "; lf = " + (el_lf + delta),
          'updateLineNumbers',1);
      $(el).attr({'lo': el_lo + delta, 'lf': el_lf + delta});
      var next = $(el).parent().find('.line-numbers');  
      if (next) {
        if (el_lo == el_lf) {
          next.html((el_lo + delta));
        } else {
          next.html((el_lo + delta) + '-' + (el_lf + delta));
        }
      }
    }
    $(el).removeClass('added');
  })

  util.toc(startTime,'to update line numbers.')
}
