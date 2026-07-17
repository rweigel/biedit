function addTOC(cb) {

  let startTime = util.tic();

  util.log('Adding TOC.','TOC',1);
  tocHTML();
  util.log('Adding click events to TOC elements.','TOC',1);
  tocClickListen();

  // Hide certain levels
  util.log("Hiding TOC levels > app['TOC']['showLevels'] (= " + app['TOC']['showLevels'] + ")." ,'TOC',1);
  var q = "> ol".repeat(app['TOC']['showLevels']);
  $('#toc ' + q + ' ol').hide();

  util.toc(startTime,'to insert TOC into DOM.');

  let section_lo = $('.highlighted').attr('lo');
  if (section_lo) {
    util.log("Highlighting #toc element associated with highlighted #display h element." ,'TOC',1);
    $("#toc [lo='" + section_lo + "']").addClass('highlighted');
  }
  if (cb) cb();
}

// No jQuery b/c also used in stand-alone HTML.
function tocClickListen() {
  let hs = document.querySelectorAll('#toc > ol ol');
  let el, ns;
  for (let i = 0; i < hs.length; i++) {
    if (hs[i].previousElementSibling) {
      el = hs[i].previousElementSibling.firstElementChild;
      if (el.length == 0) {
        continue;
      }
      el.addEventListener('click', event => {
        ns = event.target.parentNode.nextElementSibling;
        if (!ns) return;
        if (ns.style.display === 'none') {
          ns.style.display = 'block';
        } else
        {
          ns.style.display = 'none';}
      });
    }
  }
}

function highlightTOC(raw,lo) {

  //raw = raw.replace(/\\/g,"\\\\");
  // Highlight text in TOC
  util.log("Removing class .highlighted from all elements in #toc",'displayClick',1);
  $('#toc .highlighted').removeClass('highlighted');

  util.log("Adding class .highlighted to #toc element with lo = " + lo + " and raw = " + raw,'displayClick',1);
  //util.log($('#toc a[lo="' + lo + '"]'),'displayClick',1)
  $('#toc a[lo="' + lo + '"]').addClass('highlighted');

  // Highlight heading in display
  util.log("Removing class .highlighted from all a elements in #display",'displayClick',1);
  $('#display .highlighted').removeClass('highlighted');

  util.log("Adding class .highlighted to #display element with a[lo = " + lo + "] and raw = " + raw, 'displayClick',1);
  //util.log($('#display a[lo="' + lo + '"]').parent(), 'displayClick',1);
  $('#display a[lo="' + lo + '"]').parent().addClass('highlighted');
}

function tocHTML() {

  $('#toc').empty();
  let hs = $('h1,h2,h3,h4,h5,h6');

  if (hs.length > 0) {
    $('#toc').append('<ol level="h1"></ol>');
    $('#toc').css('min-width', '5em');
    $('#toc').show();
  } else {
    $('#toc').hide();
    return;    
  }

  let taglast = "h1";
  let el, ela, href, raw, text, lo, li, tag;
  hs.each(function (idx) {
    ela = $(this).find('a');
    text = ela.find('.htext').html();
    href = ela.attr('href');
    raw = ela.attr('raw');
    lo = ela.attr('lo');
    li = `<li>
            <a href="${href}" raw="${raw}" lo="${lo}">
              <span class="toctext">${text}</span>
            </a>
          </li>`;
    // This is a compute-intesive way to create TOC b/c of look-up
    // at each iteration. See tocMarkdown.js for code to make
    // TOC as a single string.
    // TODO: This does not account for a jump 
    el = $(this);
    tag = el[0].tagName.toLowerCase();
    if (tag <= taglast) {
      $('#toc')
        .find("[level='" + tag + "']").last()
        .append(li); 
    } else {
      $('#toc')
        .find('li').last()
        .append(`<ol class="toc" level="${tag}">${li}</ol>`); 
    }
    taglast = tag;
  })
  $("#toc ol").each(function() {$(this).removeAttr('level')});
}