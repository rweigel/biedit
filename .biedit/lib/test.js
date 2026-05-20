function test(testjson,t) {

    var Nt = testjson.length;
    var singleTest = false;
    if (typeof(t) !== "undefined") {
        singleTest = true;
        testjson = [testjson[t-1]];
    }

    var pass;
    var status = [];
    let allpass = true;
    for (var i = 0; i < testjson.length; i++) {
        if (singleTest == false) {
            t = i
        }
        console.log("%cRunning test # " + (t) 
            + "/" + Nt + " - "
            + testjson[i].description
            ,'background: black; color: yellow');
        pass = run(testjson[i]);
        if (pass == false) {
            allpass = false;
        }
        status.push(pass);
    }

    if (singleTest) {
        report(status[0], testjson[0].description, t);
    } else {
        if (allpass) {
            console.log("%cAll " + Nt + " tests passed.",
                'background: black; color: yellow');
        } else {
            for (var i = 0; i < status.length; i++) {
                if (status[i] == false) {
                    report(status[i], testjson[i].description, i);
                }
            }
        }

    }

    function report(status, description, tn) {

        if (status) {
            console.log("%cTest # " + (tn+1) + "/" + Nt + " passed.",
                'background: black; color: yellow');
        } else {
            console.log("%cTest # " + (tn+1) + "/" + Nt + " failed ("
                + description + ")",
                'background: black; color: red');        
        }
    }

    function run(testobj) {
      function equal(a, b) {
        if (a.length !== b.length) return false;
        for (var i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) return false;
      }
      return true;
    }

    let pass = true;

    // Execute edits
    testobj.edit(); 


    let updateElementExpected = testobj.updateElementExpected;
    // Get last updateElement result
    let updateElementResult = updateElement.result;
    console.log(updateElementResult)
    if ("domTest" in testobj) {
        if (testobj.domTest() == false) {
            pass = false;
            console.log("%cdomTest failed.",
                'background: red; color: white');
        }
    }

    if ("updateElementExpected" in testobj) {
        for (var key of Object.keys(updateElementExpected)) {
            if (key.startsWith("_")) continue;
            if (Array.isArray(updateElementResult[key])) {
                if (!equal(updateElementResult[key], updateElementExpected[key])) {
                    pass = false;
                    console.log("%cProblem with changedElements:",
                        'background: red; color: white');
                    //console.log(JSON.stringify(result, null, 4))
                    console.log("Expected " + key 
                        + " = [" + updateElementExpected[key].join(",") + "]");
                    console.log("Found    " + key + " = ["
                        + updateElementResult[key].join(",") + "]");
                }
            } else {
                if (updateElementExpected[key] != updateElementResult[key]) {
                    pass = false;
                    console.log("%cProblem with " + key + ":",
                        'background: red; color: white');
                    //console.log(JSON.stringify(result, null, 4))
                    console.log("Expected " + key + " = " + updateElementExpected[key]);
                    console.log("Found    " + key + " = " + updateElementResult[key]);
                }
            }
        }
    }
    return pass;
}
}
