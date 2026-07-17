function checkInternalLinks() {

  let links = {};

  util.log("Finding section anchors",'checkInternalLinks',1);
  $('#display a[name]').each(
    (idx, el) => {
      let name = $(el).attr('name');
      links[name] = true
    });

  util.log("Finding section anchor references",'checkInternalLinks',1);
  $('#display [href]').each( 
    function(idx, el) {
      let href = $(el).attr('href');
      if (!$(el).hasClass('anchor') && href.startsWith('#')) {
        util.log("Checking href = " + $(el).attr('href'),'checkInternalLinks',1);
        if (!links[href.slice(1)]) {
          let section = $(el).closest('.section').find('h1,h2,h3,h4,h5,h6')[0];
          let number = $(section).find("> a").attr('number');
          util.log('Found broken internal link ' + href + ' in section ' + number,'checkInternalLinks',1);
          $(el).addClass("broken-internal-link");
        } else {
          if ($(el).hasClass("broken-internal-link")) {
            $(el).removeClass("broken-internal-link");
            util.log('Found formerly broken internal link in document href: ' + href,'checkInternalLinks',1);
          }
        }
      }
    });

  $('#display .section').each(function (idx, el) {
    let n_broken = $(el).find('a.broken-internal-link').length;
    let number = $(el).find('h1,h2,h3,h4,h5,h6').find("> a").attr('number') || 0;
    util.log(n_broken + " broken links in section " + number,'checkInternalLinks',1);
    if (n_broken > 0) {
      let header = $(el).find('h1,h2,h3,h4,h5,h6');
      if ($(header).find('.broken-internal-link').length == 0) {
        util.log("Appending *",'checkInternalLinks',1);
        $(el).find('h1,h2,h3,h4,h5,h6').append("<span title='One or more broken internal links in this section' class='broken-internal-link'><sup>*</sup></span>");
      }
    }
    if ($(el).find('a.broken-internal-link').length == 0) {
      $(el).find('h1,h2,h3,h4,h5,h6').find('span.broken-internal-link').remove();
    }
  })
}
