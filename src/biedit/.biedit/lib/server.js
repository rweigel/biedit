function doPOST(markdown, html, css, tex, cb) {

  let post = {};
  if (markdown) {post['markdown'] = markdown};
  if (html) {post['html'] = html;}
  if (css)  {post['css'] = css;}
  if (tex)  {post['latex'] = tex;}

  fetch(util.fileName(), {
    method: "POST",
    body: JSON.stringify(post)
  }).then(res => {
    if (res.ok) {
      util.log('Saved ' + util.fileName(), 'server', 1)
      util.status('Saved.', false, 2000);
      util.favicon('default');
      if (cb) { cb(); }
    } else {
      util.log(res, 'server', 1);
      util.status('Error. See console.', true, -1);
    }
  }).catch(err => {
      util.log(err, 'server', 1);
      util.status('Error. See console.', true, -1);
  })
}

function serverSave(markdown, html, tex, cb) {

  util.status("Saving ...", false, -1);
  // Use setTimeout() to put at end of event loop so "Saving ..." appears.
  setTimeout(() => {
    if (html) {
      finalHTML(html, 'html',
          function (html, css) {
            doPOST(markdown, html, css, tex, cb);
      });
    } else {
      if (!tex) {
        util.log("Saving markdown only.", 'server', 1);
      } else {
        util.log("Saving markdown and latex.", 'server', 1);
      }
      doPOST(markdown, "", "", tex, cb);
    }
  },0)
}

function commit(data) {

    util.log('Committing to local repository.','server',1);

    util.xconsole('Committing ...\n', true);
    fetch(util.fileName(), 
      {
        method: "POST", 
        body: JSON.stringify(
          {
            'command': 'commit',
            'file': util.fileName(),
            'message': util.fileName() + ' updated by BiEdit'
          })
      })
      .then(function(res)  {return res.text();})
      .then(function(text) {
        util.log(text,'server',1);
        util.xconsole(text, false, 7000);
      })
}

function push(data) {

    util.log('Pushing to remote repository.','server',1);
    util.xconsole('Pushing to remote ...\n', true);

    fetch(util.fileName(), {
      method: "POST", 
      body: JSON.stringify({'command': 'push'})
    })
    .then(function(res) {return res.text();})
    .then(function(text) {
      util.log(text,'server',1);
      util.xconsole(text, false, 7000);
    });
}
