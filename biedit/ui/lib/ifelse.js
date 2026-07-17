function ifsolutions() {

  let found = $('.solutionstrue').length > 0;

  if (!found) {
    $('#solutions-checkbox-wrapper').hide();
    $('#solutions-checkbox').off('click');
    return;
  }

  let solutions = hash.get('solutions');
  if (solutions === '') {
    if ($($('.solutionstrue')[0]).css('display') === "block") {
      solutions = 'true';
    }
  }

  if (solutions === 'true') {
    hash.update('solutions','true');
    $('#solutions-checkbox-wrapper').show();
    $('#solutions-checkbox').attr('checked',true);
  }

  $('#solutions-checkbox').on('click', function () {
    if ($('#solutions-checkbox').is(':checked')) {
      hash.update('solutions','true');
      $('.solutionstrue').css('display','block');
      $('.solutionsfalse').css('display','none');
    } else {
      hash.update('solutions','');
      $('.solutionstrue').css('display','none');
      $('.solutionsfalse').css('display','block');
    }
    if (hash.get('view')) {
      // If no view in hash, need to trigger full parse.
      $('#view-options').trigger('change');
    }
  });
}
