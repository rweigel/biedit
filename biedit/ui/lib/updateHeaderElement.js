function updateHeaderElement(el, hline) {

  let nhash = hline.match(/^#{1,6}\s/);
  nhash = nhash[0].length;

  util.log("Line with header from editor: '" + hline + "'",'updateHeaderElement',1);
  util.log("Calling marked with text: '" + hline.slice(nhash) + "'",'updateHeaderElement',1)
  var toParse = hline.slice(nhash);
  var raw = toParse;
  if (toParse.startsWith("#")) {
    // bug-006-hash-in-heading.md
    toParse = "\\" + toParse;
  }

  var newTitle = marked(toParse, {'debug': app['logLevel']['marked']});
  //console.log(newTitle)
  let htitle = $(newTitle).find('p').html() || "";
  util.log("New header html: " + htitle, 'updateHeaderElement',1);

  var number = el.find('a').attr('number');
  util.log("raw: " + raw,'updateHeaderElement',1);
  var newSlug = slug(raw, number);
  util.log("New slug: " + newSlug,'updateHeaderElement',1);

  if ($('#markdownTOC').is(':checked') == true) {
    util.log("#markdownTOC is checked. Modifying title from: '" + htitle + "'", 'updateHeaderElement',1);
    htitle = htitle.replace(number+" ", "");
    util.log("to: '" + htitle + "'", 'updateHeaderElement',1);
  }

  //let oldSlug = el.find('a').attr('href').slice(1);

  el.find('a')
    .attr('name', newSlug)
    .attr('raw', hline)
    .attr('href', '#' + newSlug)

  util.log('Updating .hnumber and .htext elements in #display.','updateHeaderElement',1)
  el.find('.hnumber').first().html(number);
  el.find('.htext').first().html(htitle);

  let lo = el.attr('lo');

  util.log('Updating title, raw, and slug in side TOC.','updateHeaderElement',1)
  $('#toc [lo="' + lo + '"]')
        .attr('href', '#' + newSlug)
        .attr('raw', hline)
        .find("> span")
        .html(htitle)

}