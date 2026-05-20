var tests = [
  {
    input: "abc\\newcommand{abc}{def}def\nghi\\newcommand{123}{345}jkl",
    output: [
      {
        token: "abc",
        type: "text"
      },
      {
        token: "\\newcommand{abc}{def}",
        type: "command"
      },
      {
        token: "def",
        type: "text"
      },
      {
        token: "\n",
        type: "newline"
      },
      {
        token: "ghi",
        type: "text"
      },
      {
        token: "\\newcommand{123}{345}",
        type: "command"
      },
      {
        token: "jkl",
        type: "text"
      }
    ]
  },
  {
    input: "\\newpage",
    output: []
  }
];