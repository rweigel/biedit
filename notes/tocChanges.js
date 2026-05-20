let testJSON = [
  {
    "oldTOC":
               {
                  "s1": {
                          "md5": "s1"
                  },
                  "s2": {
                          "md5": "s2"
                  }
               },
    "newTOCs":
              [
                {
                  "s1": {
                          "md5": "s1"
                  },
                  "s2": {
                          "md5": "s2"
                  },
                  "__changes": []
                },
                {
                  "s1": {
                          "md5": "s2"
                  },
                  "s2": {
                          "md5": "s1"
                  },
                  "__changes": ["s1 moved to s2","s2 moved to s1"]
                },
                {
                  "s1": {
                          "md5": "s1"
                  },
                  "s2": {
                          "md5": "s2new"
                  },
                  "s3": {
                          "md5": "s2"
                  },
                  "__changes": ["s2 moved to s3"]
                },
                {
                  "__changes": ["s1 deleted","s2 deleted"]
                }
              ]
  }
]

oldTOC = testJSON[0]["oldTOC"]

let allpass = true;
for (let j = 0; j < testJSON[0]["newTOCs"].length; j++) {
  newTOC = testJSON[0]["newTOCs"][j]
  changes_expected = testJSON[0]["newTOCs"][j]["__changes"]
  allpass = allpass && testChanges(oldTOC, newTOC, changes_expected);
}
if (allpass) {
  console.log("-".repeat(40) + "\nAll tests passed.\n" + "-".repeat(40));
} 

function testChanges(oldTOC, newTOC, changes_expected) {
  console.log("-".repeat(40) + "\nTesting:")
  console.log(JSON.stringify(oldTOC, null, 4))
  console.log(JSON.stringify(newTOC, null, 4))
  let changes = findChanges(oldTOC, newTOC);
  let pass = true;
  if (changes.length != changes_expected.length) {
    pass = false;
    console.log("%c FAIL", 'color: red');
    console.log("  Number of entries in changes does not match that expected.");
    console.log("  expected: " + JSON.stringify(changes_expected, null, 0));
    console.log("  returned: " + JSON.stringify(changes, null, 0));
  }
  for (let i = 0; i < changes.length; i++) {
    if (changes[i] !== changes_expected[i]) {
      pass = false;
      console.log("%c FAIL", 'color: red');
      console.log(`  Found:\n    ${changes[i]}\n  Expected:\n    ${changes_expected[i]}`);
    }
  }
  if (pass) {
    console.log("PASS")
  }
  return pass;
}

function findChanges(oldTOC, newTOC) {
  let changes = [];
  for (const [key, value] of Object.entries(oldTOC)) {
    console.log(`Working on ${key}`)
    if (newTOC[key]) {
      console.log(`  Found ${key} in new`);
      if (newTOC[key]['md5'] === oldTOC[key]['md5']) {
        let msg = `${key} unchanged`;
        //changes.push(msg);
        console.log("  " + msg);
      } else {
        console.log(`  ${key} changed`);
        let msg = "";
        // Look for md5 of old entry in new
        for (const [key2, value2] of Object.entries(newTOC)) {
          if (oldTOC[key]['md5'] === newTOC[key2]['md5']) {
            msg = `${key} moved to ${key2}`;
            changes.push(msg)
            console.log("  " + msg);
            break;
          }
        }
        if (msg == "") {
          msg = `${key} deleted or modified`;
          //changes.push(msg);
          console.log("  " + msg);
        }
      }
    } else {
      let msg = `${key} deleted`;
      changes.push(msg);
      console.log("  " + msg);
    }
  }
  return changes
}