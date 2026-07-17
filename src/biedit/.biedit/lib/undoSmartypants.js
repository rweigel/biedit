function undoSmartypants(text, latex) {
  // Replaces punctuation quotes set by regex in marked.
  text = text
          .replace(/…/g,'...')
          .replace(/”/g,'"')
          .replace(/’/g,"'")
          .replace(/–/g,"--")
          .replace(/—/g,"---")

  if (latex) {
    // Use LaTeX opening quote symbols
    text = text.replace(/‘/g,"`").replace(/“/g,'``');
  } else {
    text = text.replace(/‘/g,"'").replace(/“/g,'"');    
  }
  return text;
}
