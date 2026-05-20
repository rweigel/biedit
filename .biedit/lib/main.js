function main() {

  events();

  if (app['server']['initialFile'] === '') {
    location.pathname = "/" + util.fileName() + "!"
    init(''); // Start editor with no content.
  } else {
    util.log("Getting " + app['server']['initialFile'], 'main', 1);
    fetch(app['server']['initialFile'])
      .then(function(res) {
        return res.text();
      })
      .then(function(text) {
        util.log("Got " + app['server']['initialFile'], 'main', 1);
        $('head > title').text(app['server']['initialFile']);
        init(text);
      });
  }

  function init(text) {

    util.log.lastTime = (new Date()).getTime();

    if (document.readyState !== 'complete') {
        // Check if ready every 10 ms. (This is not how it should be done.)
        // TODO: Is this needed anymore?
        // TODO: Create event that fires when readyState = 'complete'
        // and initial text loaded.
        util.log("Waiting for document to be ready.", 'main', 1);
        setTimeout(() => init(text), 10);
        return;
    }

    let editor = ace.edit("editor");
    initEditor(editor, text)

    if (app['server']['noHTML']) {
      $("#view-options option[value='web-standalone']").hide();
    }

    let title = $('#markdownTOCLabel').attr('title-unchecked');
    $('#markdownTOCLabel').attr('title', title);
  }
}
