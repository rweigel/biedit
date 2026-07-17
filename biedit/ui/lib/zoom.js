function fitPreview() {

  let pagew = $('iframe').contents().find('.pagedjs_page').width();
  if (!pagew) {
    util.log(`.pagedjs_page width undefined. Not setting #zoom-right-input`,'zoom',1);
    return;
  }
  if (hash.get("zoom") !== '') {
    util.log(`zoom set in hash. Will not fit.`,'zoom');
    return;
  }
  const page1 = $('#pdf-preview iframe').contents().find('#page-1');
  const marginLeft  = parseInt(page1.css('marginLeft').replace("px",""));
  const marginRight = parseInt(page1.css('marginLeft').replace("px",""));

  // TODO: Why is -5 needed?
  const headerw = $("#right-header").width() - (-5 + marginLeft + marginRight);
  const zval = (100*headerw/pagew).toFixed(1);

  util.log(`page width = ${pagew}`,'zoom',1);
  util.log(`#right-header width - margin) = ${headerw}`,'zoom',1);
  util.log(`Setting #zoom-right-input to ${zval}`,'zoom',1);
  $('#zoom-right-input').val(Math.ceil(zval));
  zoom('pdf-preview', zval);
}

function zoom(view, value) {

  // CSS zoom is not part of the standard, but seems to work as desired in at
  // least webkit.
  // TODO: See
  // https://medium.com/@sai_prasanna/
  // simulating-css-zoom-with-css3-transform-scale-461d1b9762d6
  // for standard-compliant implementation.

  util.log(`zoom() called with view='${view}', value='${value}'`,"zoom",1);

  if (view === undefined) {
    view = hash.get("view");
  }
  if (view === "") {
    view = "html-rendered";
  }
  if (value === undefined) {
    value = hash.get("zoom");
    if (value === undefined) {
      value = 100;
    }
  }

  zoom[view] = value;

  if (parseInt(value) !== 100) {
    hash.update("zoom", value);
  } else {
    hash.update("zoom", "");
  }

  util.log(` Setting zoom on view='${view}' to ${value}%`,'zoom',1);
  if (view === "pdf-preview") {
      $('#pdf-preview iframe')
        .contents().find('body').css('zoom', value + "%");
  } else {
    $('#' + view).css('zoom', value + "%");
    view.startsWith("pdf")
    util.log(` Triggering window resize`,'zoom',1);
    $(window).trigger('resize');
  }
}
