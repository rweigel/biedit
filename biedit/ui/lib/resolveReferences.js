function resolveReferences() {
  $(".lref").each(function (idx, el) {
    let href = $(el).attr('href');
    console.log($(`.lanchor[href="${href}"]`))
  });
}