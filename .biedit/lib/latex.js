function latex(includeHeader, cb) {

  fetch('/.biedit/lib/latex.tex')
    .then((resp) => resp.text())
    .then((data) => {
        if (includeHeader) {
          cb(body(header(data)));
        } else {
          cb(body());
        }
      });


  function undoinline(el) {

    el = el.clone();
    eqns = el.find('[raw]');

    for (let i = 0; i < eqns.length; i++) {
      let raw = $(eqns[i]).attr('raw');
      raw = raw
            .replace(/^__|__$/g,"$$$$")
            .replace(/^_|_$/g,"$$")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
      $(eqns[i]).replaceWith(raw);
    }

    let imgs = el.find('img');
    for (let i = 0; i < imgs.length; i++) {
      let src = $(imgs[i]).attr('src').replace(".svg", ".tikz");
      $(imgs[i]).replaceWith(`\\input{${src}}`);
    }

    let strongs = el.find('strong');
    for (let i = 0; i < strongs.length; i++) {
      let text = $(strongs[i]).text();
      $(strongs[i]).replaceWith(`\\textbf{${text}}`);
    }

    let ems = el.find('em');
    for (let i = 0; i < ems.length; i++) {
      let text = $(ems[i]).text();
      $(ems[i]).replaceWith(`\\emph{${text}}`);
    }

    let codes = el.find('code');
    for (let i = 0; i < codes.length; i++) {
      let text = $(codes[i]).text();
      $(codes[i]).replaceWith(`\\texttt{${text}}`);
    }

    return el.text();
  }

  function header(text) {

    let doc = [text];
    macros = "\n";
    for (const [key, value] of Object.entries(options.macros.math)) {

      // KaTeX macros don't have number of parameters specified, but
      // LaTeX needs it. So we infer the number here so that we can
      // have the KaTeX macro
      //  "\bfvec": "\vec{\mathbf{#1}}"
      // written as
      //  \newcommand{\bfvec}[1]{\vec{\\mathbf{#1}}}
      let m = value.match(/#[0-9]/g);
      let np = 0;
      if (m && m.length > 0) {
        np = m.slice(-1)[0].slice(-1);
      }
      if (key == "\\mbox") {
        macros = macros + `\\renewcommand{${key}}{${value}}` + "\n";
      } else {
        macros = macros + `\\newcommand{${key}}[${np}]{${value}}` + "\n";
      }
    }
    doc.push(macros);

    let title = undoinline($('p.title'));
    let subtitle = undoinline($('p.subtitle'));
    let hastitle = false;
    if (title) {
      let fulltitle = title;
      if (subtitle) {
        fulltitle = `${title} \\\\ ${subtitle}`
      }
      doc.push([
        '\\usepackage{fancyhdr}',
        '\\pagestyle{fancy}',
        `\\lhead{${title}}`,
        '\\rhead{\\thepage}',
        '\\fancyfoot{}'
      ].join("\n"))

    }

    doc.push("\\begin{document}");
    if (hastitle) {
      doc.push("\\maketitle");
    }

    return doc;
  }

  function body(doc) {

    if (!doc) {
      doc = ["\\begin{document}"];
    }

    let sections = $('.section');
    //sections.find('.katex-error-message').remove();
    let blocks, el, tagName, text;

    for (let i = 0; i < sections.length; i++) {

      util.log("Working on section #" + i,'renderLatex',1);
      blocks = $(sections[i]).find('> .block');
      for (let j = 0; j < blocks.length; j++) {

        util.log("Working on block #" + j,'renderLatex',1);
        el = $(blocks[j]).find(':first-child')[0];
        tagName = el.tagName;

        if (tagName === "H1") {
          text = undoinline($(el).find('.htext'));
          text = `\\section{${text}}`;
          util.log("Appending " + text,'renderLatex',1);
          doc.push(text);
        }
        if (tagName === "H2") {
          text = undoinline($(el).find('.htext'));
          text = `\\subsection{${text}}`;
          util.log("Appending " + text,'renderLatex',1);
          doc.push(text); 
        }
        if (tagName === "H3") {
          text = undoinline($(el).find('.htext'));
          text = `\\subsubsection{${text}}`;
          util.log("Appending " + text,'renderLatex',1);
          doc.push(text); 
        }
        if (tagName === "H4") {
          text = undoinline($(el).find('.htext'));
          text = `\\paragraph{${text}}`;
          util.log("Appending " + text,'renderLatex',1);
          doc.push(text); 
        }
        if (tagName === "H5") {
          text = undoinline($(el).find('.htext'));
          text = `\\subparagraph{${text}}`;
          util.log("Appending " + text,'renderLatex',1);
          doc.push(text); 
        }
        if (tagName === "H6") {
          text = undoinline($(el).find('.htext'));
          text = `\\textbf{(Level 6 heading not supported)} ${text}`;
          util.log("Appending " + text,'renderLatex',1);
          doc.push(text); 
        }
        if (tagName.startsWith("H")) {
          util.log("Moving to next block.",'renderLatex',1);
          continue;
        }
        if (tagName === "P") {
          if ($(el).hasClass('title') || $(el).hasClass('subtitle') || $(el).hasClass('date')){
            util.log("Found p.title or p.subtitle. Skipping b/c already handled.",'renderLatex',1);
            continue;
          }
        }
        if (tagName === "UL" || tagName === "OL") {
          util.log("Calling list() with:\n" + html_beautify(el.outerHTML),'renderLatex',1);
          //list(el, doc, 0);
          doc.push(list(el, 0));
        } else {
          util.log("Calling block()",'renderLatex',1);
          doc.push(block(blocks[j]));
        }

      }
    }
    doc.push("\\end{document}")
    doc = doc.join("\n\n").replace(/\n\s*\n\s*\n+/g,"\n\n");//.replace(/^\\%|\s+\\%/gm, "%");
    return undoSmartypants(doc, true);
  }

  function block(el) {

    let doc = [];

    util.log('block(): Called with el:\n' + html_beautify(el.outerHTML),'renderLatex',1)

    if (el.tagName === "DIV") {
      if ($(el).hasClass("block")) {
        util.log("block(): Element is div.block. Calling block() with first child.", 'renderLatex',1);
        let children = $(el).children();
        return block(children[0]);
      } 
      if ($(el).hasClass("inline-html")) {
        util.log("block(): Element is div.inline-html. Looping through children.",'renderLatex',1);
        let children = $(el).children();
        let b = "";
        for (let i = 0; i < children.length; i++) {
          b = b + "\n" + block(children[i]);
        }
        return b
      }
      util.log("block(): Element is not div.inline-html or div.block. Converting contents to latex.",'renderLatex',1);
    }

    fc = el;

    if (fc.tagName === "P") {
      util.log("block(): Element is a P.",'renderLatex',1);
      text = undoinline($(fc));
      //util.log("block(): After undoinline():\n" + text,'renderLatex',1);
      //util.log("block(): Appending above",'renderLatex',1);
      doc.push(text);
    } else if (fc && fc.tagName === "IMG") {
      util.log("block(): Element is an IMG. Wrapp src with \\input{} and replacing .svg with .tikz",'renderLatex',1);
      let src = $(fc).attr('src').replace(".svg", ".tikz");
      doc.push(`\\input{${src}}`);
    } else if ($(el).hasClass('comment')) {
      //util.log("block(): Element has class 'comment'",'renderLatex',1);
      text = "%" + $(el).text();            
      doc.push($(el).text());
    } else if ($(fc).is(":empty")) {
      //util.log("block(): Element is empty. Using css height to set vskip.",'renderLatex',1);
      //util.log("empty",'renderLatex',1);
      // Vertical space given as, e.g., <div style="height:1em"/>
      // https://www.overleaf.com/learn/latex/Lengths_in_LaTeX
      // https://stackoverflow.com/questions/27859219/html-how-are-pixels-defined
      // It is not easy to get raw value of height specified in element
      // with jQuery or native Javascript. Generally access to
      // computed height in pixels is easy.
      let h = $(fc).css("height");
      if (h) {
        h = parseInt(h);
        //https://tex.stackexchange.com/questions/8260/what-are-the-various-units-ex-em-in-pt-bp-dd-pc-expressed-in-mm
        // https://tex.stackexchange.com/questions/21758/globally-redefining-1-pt-to-1-72-in-postscript-point-and-other-similar-changes        // h is pixels.
        // 96 css pixels = 1 inch
        // 72.27 TeX pts = 1 inch 
        // h = h*72.27/96.0 // => h in TeX pts.
        if (h != 0) {
          h = h*72.0/96.0; // use TeX 'bp' instead of 'pt' so common h values will be integer.
          doc.push(`\\vskip ${h}pt`);
        }
      }
    } else if ($(el).hasClass('newpage')) {
      //util.log("block(): Element has class 'newpage'",'renderLatex',1);
      doc.push("\\newpage");
    } else if ($(fc).hasClass('solutionsfalse')) {
      util.log("block(): Element has class 'solutionsfalse'",'renderLatex',1);
      console.log(fc)
      let prev = $(fc).closest('.block').find('.solutionstrue');
      console.log(prev)
      if (prev.length != 0) {
        util.log('previous elment has class .solutionstrue; skipping.','renderLatex',1);
      } else {
        util.log('solutionsfalse','renderLatex',1);
        falsecase = [];
        fcc = $(fc).children()
        for (i = 0; i < fcc.length; i++) {
          falsecase.push(block(fcc[i]).trimStart());
        }
        falsecase = falsecase.join("\n\n  ")
        doc.push("\\ifsolutions\\else\n" + falsecase + "\n\\fi");
      }
    } else if ($(fc).hasClass('solutionstrue')) {
        util.log("block(): Element has class 'solutionstrue'. Looping through children.",'renderLatex',1);
        truecase = [];
        fcc = $(fc).children()
        for (i = 0; i < fcc.length; i++) {
          truecase.push(block(fcc[i]));
        }
        truecase = truecase.join("\n\n").replace(/^\n/,"");
        next = false;
        let next1 = $(fc).closest('.solutionstrue').next();
        if (next1.hasClass('solutionsfalse')) {
          next = next1;
          util.log("block(): Next element has .solutionsfalse' element:",'renderLatex',1);
        }
        if (next && next.length > 0) {
          falsecase = [];
          util.log("block(): Looping through children of:",'renderLatex',1);
          util.log(next,'renderLatex',1);
          fcc = $(next).children()
          for (i = 0; i < fcc.length; i++) {
            //falsecase.push(block(fcc[i]).trimStart());
            falsecase.push(block(fcc[i]));
          }
          falsecase = falsecase.join("\n\n")
          doc.push("\\ifsolutions\n" + truecase + "\n\\else\n" + falsecase + "\n\\fi");
        } else {
          doc.push("\\ifsolutions\n" + truecase + "\n\\fi");          
        }
    } else if (fc.tagName === "UL" || fc.tagName === "OL") {
      util.log(`block(): Element is a ${fc.tagName}. Calling list().`,'renderLatex',1);
      doc.push(list(fc, 1));
    } else if (fc.tagName === "DIV") {
      util.log("block(): Element is a div. Calling block with its children",'renderLatex',1);
      doc.push(block($(fc).children()[0]));
    }

    if (doc.length > 0) {
      return doc.join("\n\n");
    } else {
      return "";
    }
  }

  function list(el, level) {

    let indento = 2;
    let text = [];
    util.log(`list(${level}): Called with:\n` + html_beautify(el.outerHTML),'renderLatex',1);
    let indent = "";
    if (level > 0) {
      indent = " ".repeat(2*level + indento);
    }
    let tagName = el.tagName;
    if (tagName === "UL") {
      text.push("\n" + indent + `\\begin{itemize}`);
    } else {
      text.push("\n" + indent + `\\begin{enumerate}`);
    }

    let startattr = $(el).attr('start');
    if (tagName === "OL" && startattr) {
      start = parseInt(startattr);
    }

    let items = $(el).find('> li');
    util.log(`list(${level}): Looping over ` + items.length + " li(s)",'renderLatex',1);
    for (let k = 0; k < items.length; k++) {

      let itemtxt;
      if (startattr) {
        itemtxt = indent + `  \\item[${k+start}.] `;
      } else {
        itemtxt = indent + `  \\item ` ;
      }
      text.push(itemtxt);

      let els = $(items[k]).find('> .block');

      util.log(`list(${level}): # elements in li #${k+1}: ${els.length}`,'renderLatex',1);
      util.log(`list(${level}): Looping over ` + els.length + " elements(s)",'renderLatex',1);
      for (let l = 0; l < els.length; l++) {

        let tagName = els[l].tagName;
        util.log(`list(${level}): element #${l+1} is a ${tagName}:\n` + html_beautify(els[l].outerHTML),'renderLatex',1);

        let olsublist = $(els[l]).find('ol')[0];
        if (olsublist) {
          util.log("Sublist",'renderLatex',1);
          text.push(list(olsublist, ++level));
          continue;
        }

        let ulsublist = $(els[l]).find('ul')[0];
        if (ulsublist) {
          util.log("Sublist",'renderLatex',1);
          text.push(list(ulsublist, ++level));
          continue;
        }

        util.log(`list(${level}): Calling block() with above`,'renderLatex',1);

        let tmp = block(els[l]).trim();
        //if (tmp == "") continue;
        let tmps = tmp.split("\n");

        util.log(`list(${level}): Indenting level #${level}; item #${l}`,'renderLatex',1);
        //console.log(tmps)
        //console.log("li # = " + l)
        //console.log("level = " + level)
        let space = "";
        if (l > 0) {
          space = " ".repeat(itemtxt.length);
        }
        if (tmps.length == 1) {
          util.log(`list(${level}): Indenting one item:\n` + tmp,'renderLatex',1);
          tmp = tmp.replace(/^(.*)/gm, space + "$1")
          util.log(`list(${level}): Appending:\n` + tmp,'renderLatex',1);
          text.push(tmp);
        } else {
          util.log(`list(${level}): Indenting more than one item.`,'renderLatex',1);
          tmp = tmps.join("\n");
          //console.log(tmp)
          //console.log(space.length)
          //space = " ".repeat(2*(level+1) + indento);
          if (l == 0) {
            util.log(`list(${level}): Setting indentation for first item.`,'renderLatex',1);
            space = " ".repeat(itemtxt.length);
            if (level > 0) {
              space = space.slice(2*(level+1));
            }
            tmp = tmp.replace(/\n\s*(.*)/gm, "\n" + indent + space + "$1");
            util.log(`list(${level}): Appending:\n` + tmp,'renderLatex',1);
            text.push(tmp);
          } else {
            util.log(`list(${level}): Setting indentation for second+ item.`,'renderLatex',1);
            tmp = tmp.replace(/^(\n*)(\s*)(.*)/gm, "$1" + indent + space + "$2$3")
            util.log(`list(${level}): Appending:\n` + tmp,'renderLatex',1);
            text.push(tmp);
          }
        }
      }
      //doc.push(itemtxt + text.join("\n\n") );
      //text.push(text.join("\n\n"));
    }

    if (tagName === "UL") {
      //doc.push(indent + `\\end{itemize}`);
      text.push(indent + `\\end{itemize}`);
    } else {
      //doc.push(indent + `\\end{enumerate}`);
      text.push(indent + `\\end{enumerate}`);
    }
    //console.log(text.join("\n\n"))
    return text.join("\n\n").replace(/\\item(.*?) \n\n/gm,"\\item$1 ");
  }
}
