import React from "react";
import "./App.css";
import { useState } from "react";
import update from "immutability-helper";

var values = [
  [null, 1, null, null, null, null, null, 2, 3],
  [null, 5, 9, null, null, null, 1, 6, null],
  [null, null, 2, 1, null, 5, 7, null, null],
  [null, 2, null, null, 5, null, null, 7, null],
  [4, null, null, 6, null, 9, null, null, 5],
  [null, 8, null, null, 1, null, null, 3, null],
  [null, null, 7, 4, null, 6, 3, null, null],
  [null, 3, 8, null, null, null, 9, 4, null],
  [2, 4, null, null, null, null, null, 5, 7]
];

// var values = [
//   [null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null]
// ];

var solvedValues = JSON.parse(JSON.stringify(values));
var validOptionArray = [[]];

function getNextNumber(y, x) {
  if (solvedValues[y][x] == null) {
    checkRow(y, x);
    if (!isSolved()) checkColumn(y, x);
    if (!isSolved()) checkBox(y, x);
  }
}

function guess() {
  let loop = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  for (let i of loop) {
    for (let j of loop) {
      if (solvedValues[i][j] !== null) continue;
      let selectedOptions = validOptionArray[i][j];
      if (selectedOptions == null || selectedOptions.length === 0) {
        return false;
      }
      console.log(selectedOptions.toString());

      for (let k = 0; k < selectedOptions.length; k++) {
        solvedValues[i][j] = selectedOptions[k];
        solve();
        if (isSolved()) {
          return true;
        } else {
          if (!guess()) {
            //solvedValues[i][j] = null;
            console.log(solvedValues);
            j = j + 1;

            continue;
          }
          //solvedValues[i][j] = null;

          return false;
        }
      }
      solvedValues[i][j] = null;

      //break;
    }
  }
}

function checkRow(y, x) {
  let viableResult = null;
  for (let selectedValidOption of validOptionArray[y][x]) {
    if (viableResult == null) {
      viableResult = selectedValidOption;
      for (let i = 0; i < 9; i++) {
        if (
          i !== x &&
          validOptionArray[y][i] != null &&
          validOptionArray[y][i].includes(selectedValidOption)
        ) {
          viableResult = null;
        }
      }
    }
  }
  if (viableResult !== null) {
    solvedValues[y][x] = viableResult;
  }
}

function checkColumn(y, x) {
  let viableResult = null;
  for (let selectedValidOption of validOptionArray[y][x]) {
    if (viableResult == null) {
      viableResult = selectedValidOption;
      for (let i = 0; i < 9; i++) {
        if (
          i !== y &&
          validOptionArray[i][x] != null &&
          validOptionArray[i][x].includes(selectedValidOption)
        ) {
          viableResult = null;
        }
      }
    }
  }
  if (viableResult !== null) {
    solvedValues[y][x] = viableResult;
  }
}

function checkBox(y, x) {
  let yrange = y < 3 ? [0, 1, 2] : y >= 3 && y < 6 ? [3, 4, 5] : [6, 7, 8];
  let xrange = x < 3 ? [0, 1, 2] : x >= 3 && x < 6 ? [3, 4, 5] : [6, 7, 8];

  let viableResult = null;
  for (let selectedValidOption of validOptionArray[y][x]) {
    if (viableResult == null) {
      viableResult = selectedValidOption;
      for (let row of yrange) {
        for (let column of xrange) {
          if (
            !(row === y && column === x) &&
            validOptionArray[row][column] != null &&
            validOptionArray[row][column].includes(selectedValidOption)
          ) {
            viableResult = null;
          }
        }
      }
    }
  }
  if (viableResult !== null) {
    solvedValues[y][x] = viableResult;
  }
}

function getValidOptions(y, x) {
  if (solvedValues[y][x] !== null) {
    return null;
  }

  let validOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = 1; i < 10; i++) {
    if (solvedValues[y].includes(i)) {
      let index = validOptions.findIndex(value => value === i);
      validOptions.splice(index, 1);
    }
  }

  let newValidOptions = [].concat(validOptions);
  for (let i = 0; i < validOptions.length; i++) {
    for (let j = 0; j < 9; j++) {
      if (
        j !== y &&
        solvedValues[j][x] !== null &&
        solvedValues[j][x] === validOptions[i]
      ) {
        let index = newValidOptions.findIndex(
          value => value === validOptions[i]
        );
        newValidOptions.splice(index, 1);
      }
    }
  }
  validOptions = [].concat(newValidOptions);

  for (let i = 0; i < validOptions.length; i++) {
    let condition = false;
    if (y < 3 && x < 3) {
      if (
        solvedValues[0].slice(0, 3).includes(validOptions[i]) ||
        solvedValues[1].slice(0, 3).includes(validOptions[i]) ||
        solvedValues[2].slice(0, 3).includes(validOptions[i])
      ) {
        condition = true;
      }
    } else if (y < 3 && x >= 3 && x < 6) {
      if (
        solvedValues[0].slice(3, 6).includes(validOptions[i]) ||
        solvedValues[1].slice(3, 6).includes(validOptions[i]) ||
        solvedValues[2].slice(3, 6).includes(validOptions[i])
      ) {
        condition = true;
      }
    } else if (y < 3 && x >= 6 && x < 9) {
      if (
        solvedValues[0].slice(6, 9).includes(validOptions[i]) ||
        solvedValues[1].slice(6, 9).includes(validOptions[i]) ||
        solvedValues[2].slice(6, 9).includes(validOptions[i])
      ) {
        condition = true;
      }
    } else if (y >= 3 && y < 6 && x < 3) {
      if (
        solvedValues[3].slice(0, 3).includes(validOptions[i]) ||
        solvedValues[4].slice(0, 3).includes(validOptions[i]) ||
        solvedValues[5].slice(0, 3).includes(validOptions[i])
      ) {
        condition = true;
      }
    } else if (y >= 3 && y < 6 && x >= 3 && x < 6) {
      if (
        solvedValues[3].slice(3, 6).includes(validOptions[i]) ||
        solvedValues[4].slice(3, 6).includes(validOptions[i]) ||
        solvedValues[5].slice(3, 6).includes(validOptions[i])
      ) {
        condition = true;
      }
    } else if (y >= 3 && y < 6 && x >= 6 && x < 9) {
      if (
        solvedValues[3].slice(6, 9).includes(validOptions[i]) ||
        solvedValues[4].slice(6, 9).includes(validOptions[i]) ||
        solvedValues[5].slice(6, 9).includes(validOptions[i])
      ) {
        condition = true;
      }
    } else if (y >= 6 && y < 9 && x < 3) {
      if (
        solvedValues[6].slice(0, 3).includes(validOptions[i]) ||
        solvedValues[7].slice(0, 3).includes(validOptions[i]) ||
        solvedValues[8].slice(0, 3).includes(validOptions[i])
      ) {
        condition = true;
      }
    } else if (y >= 6 && y < 9 && x >= 3 && x < 6) {
      if (
        solvedValues[6].slice(3, 6).includes(validOptions[i]) ||
        solvedValues[7].slice(3, 6).includes(validOptions[i]) ||
        solvedValues[8].slice(3, 6).includes(validOptions[i])
      ) {
        condition = true;
      }
    } else if (y >= 6 && y < 9 && x >= 6 && x < 9) {
      if (
        solvedValues[6].slice(6, 9).includes(validOptions[i]) ||
        solvedValues[7].slice(6, 9).includes(validOptions[i]) ||
        solvedValues[8].slice(6, 9).includes(validOptions[i])
      ) {
        condition = true;
      }
    }

    if (condition) {
      let index = newValidOptions.findIndex(value => value === validOptions[i]);
      newValidOptions.splice(index, 1);
    }
  }
  return newValidOptions;
}

function validate() {
  for (let y = 0; y < 9; y++) {
    validOptionArray.push([]);
    for (let x = 0; x < 9; x++) {
      validOptionArray[y][x] = getValidOptions(y, x);
    }
  }
}

function solve() {
  let oldValues = "";
  while (oldValues !== JSON.stringify(solvedValues)) {
    oldValues = JSON.stringify(solvedValues);

    validate();

    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        getNextNumber(y, x);
      }
    }
  }
}

function onChange(e, originalValues, setValue, y, x) {
  values = update(originalValues, {
    [y]: { [x]: { $set: parseInt(e.target.value) } }
  });
  solvedValues = JSON.parse(JSON.stringify(values));
  setValue(values);
}

function isSolved() {
  for (let i = 0; i < solvedValues.length; i++) {
    for (let j = 0; j < solvedValues[i].length; j++) {
      if (solvedValues[i][j] === null) {
        return false;
      }
    }
  }
  return true;
}

function App() {
  const [originalValues, setValue] = useState(values);

  if (!isSolved()) {
    solve();

    if (!isSolved()) {
      guess();
    }
  }

  return (
    <div className="App">
      <table className="table">
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[0][0]) || null}
                onChange={e => onChange(e, originalValues, setValue, 0, 0)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[0][1]) || null}
                onChange={e => onChange(e, originalValues, setValue, 0, 1)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[0][2]) || null}
                onChange={e => onChange(e, originalValues, setValue, 0, 2)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[0][3]) || null}
                onChange={e => onChange(e, originalValues, setValue, 0, 3)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[0][4]) || null}
                onChange={e => onChange(e, originalValues, setValue, 0, 4)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[0][5]) || null}
                onChange={e => onChange(e, originalValues, setValue, 0, 5)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[0][6]) || null}
                onChange={e => onChange(e, originalValues, setValue, 0, 6)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[0][7]) || null}
                onChange={e => onChange(e, originalValues, setValue, 0, 7)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[0][8]) || null}
                onChange={e => onChange(e, originalValues, setValue, 0, 8)}
              ></input>
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[1][0]) || null}
                onChange={e => onChange(e, originalValues, setValue, 1, 0)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[1][1]) || null}
                onChange={e => onChange(e, originalValues, setValue, 1, 1)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[1][2]) || null}
                onChange={e => onChange(e, originalValues, setValue, 1, 2)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[1][3]) || null}
                onChange={e => onChange(e, originalValues, setValue, 1, 3)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[1][4]) || null}
                onChange={e => onChange(e, originalValues, setValue, 1, 4)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[1][5]) || null}
                onChange={e => onChange(e, originalValues, setValue, 1, 5)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[1][6]) || null}
                onChange={e => onChange(e, originalValues, setValue, 1, 6)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[1][7]) || null}
                onChange={e => onChange(e, originalValues, setValue, 1, 7)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[1][8]) || null}
                onChange={e => onChange(e, originalValues, setValue, 1, 8)}
              ></input>
            </td>
          </tr>
          <tr className="borderBottom">
            <td>
              <input
                type="text"
                value={parseInt(originalValues[2][0]) || null}
                onChange={e => onChange(e, originalValues, setValue, 2, 0)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[2][1]) || null}
                onChange={e => onChange(e, originalValues, setValue, 2, 1)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[2][2]) || null}
                onChange={e => onChange(e, originalValues, setValue, 2, 2)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[2][3]) || null}
                onChange={e => onChange(e, originalValues, setValue, 2, 3)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[2][4]) || null}
                onChange={e => onChange(e, originalValues, setValue, 2, 4)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[2][5]) || null}
                onChange={e => onChange(e, originalValues, setValue, 2, 5)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[2][6]) || null}
                onChange={e => onChange(e, originalValues, setValue, 2, 6)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[2][7]) || null}
                onChange={e => onChange(e, originalValues, setValue, 2, 7)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[2][8]) || null}
                onChange={e => onChange(e, originalValues, setValue, 2, 8)}
              ></input>
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[3][0]) || null}
                onChange={e => onChange(e, originalValues, setValue, 3, 0)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[3][1]) || null}
                onChange={e => onChange(e, originalValues, setValue, 3, 1)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[3][2]) || null}
                onChange={e => onChange(e, originalValues, setValue, 3, 2)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[3][3]) || null}
                onChange={e => onChange(e, originalValues, setValue, 3, 3)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[3][4]) || null}
                onChange={e => onChange(e, originalValues, setValue, 3, 4)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[3][5]) || null}
                onChange={e => onChange(e, originalValues, setValue, 3, 5)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[3][6]) || null}
                onChange={e => onChange(e, originalValues, setValue, 3, 6)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[3][7]) || null}
                onChange={e => onChange(e, originalValues, setValue, 3, 7)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[3][8]) || null}
                onChange={e => onChange(e, originalValues, setValue, 3, 8)}
              ></input>
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[4][0]) || null}
                onChange={e => onChange(e, originalValues, setValue, 4, 0)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[4][1]) || null}
                onChange={e => onChange(e, originalValues, setValue, 4, 1)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[4][2]) || null}
                onChange={e => onChange(e, originalValues, setValue, 4, 2)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[4][3]) || null}
                onChange={e => onChange(e, originalValues, setValue, 4, 3)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[4][4]) || null}
                onChange={e => onChange(e, originalValues, setValue, 4, 4)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[4][5]) || null}
                onChange={e => onChange(e, originalValues, setValue, 4, 5)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[4][6]) || null}
                onChange={e => onChange(e, originalValues, setValue, 4, 6)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[4][7]) || null}
                onChange={e => onChange(e, originalValues, setValue, 4, 7)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[4][8]) || null}
                onChange={e => onChange(e, originalValues, setValue, 4, 8)}
              ></input>
            </td>
          </tr>
          <tr className="borderBottom">
            <td>
              <input
                type="text"
                value={parseInt(originalValues[5][0]) || null}
                onChange={e => onChange(e, originalValues, setValue, 5, 0)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[5][1]) || null}
                onChange={e => onChange(e, originalValues, setValue, 5, 1)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[5][2]) || null}
                onChange={e => onChange(e, originalValues, setValue, 5, 2)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[5][3]) || null}
                onChange={e => onChange(e, originalValues, setValue, 5, 3)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[5][4]) || null}
                onChange={e => onChange(e, originalValues, setValue, 5, 4)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[5][5]) || null}
                onChange={e => onChange(e, originalValues, setValue, 5, 5)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[5][6]) || null}
                onChange={e => onChange(e, originalValues, setValue, 5, 6)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[5][7]) || null}
                onChange={e => onChange(e, originalValues, setValue, 5, 7)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[5][8]) || null}
                onChange={e => onChange(e, originalValues, setValue, 5, 8)}
              ></input>
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[6][0]) || null}
                onChange={e => onChange(e, originalValues, setValue, 6, 0)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[6][1]) || null}
                onChange={e => onChange(e, originalValues, setValue, 6, 1)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[6][2]) || null}
                onChange={e => onChange(e, originalValues, setValue, 6, 2)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[6][3]) || null}
                onChange={e => onChange(e, originalValues, setValue, 6, 3)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[6][4]) || null}
                onChange={e => onChange(e, originalValues, setValue, 6, 4)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[6][5]) || null}
                onChange={e => onChange(e, originalValues, setValue, 6, 5)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[6][6]) || null}
                onChange={e => onChange(e, originalValues, setValue, 6, 6)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[6][7]) || null}
                onChange={e => onChange(e, originalValues, setValue, 6, 7)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[6][8]) || null}
                onChange={e => onChange(e, originalValues, setValue, 6, 8)}
              ></input>
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[7][0]) || null}
                onChange={e => onChange(e, originalValues, setValue, 7, 0)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[7][1]) || null}
                onChange={e => onChange(e, originalValues, setValue, 7, 1)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[7][2]) || null}
                onChange={e => onChange(e, originalValues, setValue, 7, 2)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[7][3]) || null}
                onChange={e => onChange(e, originalValues, setValue, 7, 3)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[7][4]) || null}
                onChange={e => onChange(e, originalValues, setValue, 7, 4)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[7][5]) || null}
                onChange={e => onChange(e, originalValues, setValue, 7, 5)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[7][6]) || null}
                onChange={e => onChange(e, originalValues, setValue, 7, 6)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[7][7]) || null}
                onChange={e => onChange(e, originalValues, setValue, 7, 7)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[7][8]) || null}
                onChange={e => onChange(e, originalValues, setValue, 7, 8)}
              ></input>
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[8][0]) || null}
                onChange={e => onChange(e, originalValues, setValue, 8, 0)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[8][1]) || null}
                onChange={e => onChange(e, originalValues, setValue, 8, 1)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[8][2]) || null}
                onChange={e => onChange(e, originalValues, setValue, 8, 2)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[8][3]) || null}
                onChange={e => onChange(e, originalValues, setValue, 8, 3)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[8][4]) || null}
                onChange={e => onChange(e, originalValues, setValue, 8, 4)}
              ></input>
            </td>
            <td className="borderRight">
              <input
                type="text"
                value={parseInt(originalValues[8][5]) || null}
                onChange={e => onChange(e, originalValues, setValue, 8, 5)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[8][6]) || null}
                onChange={e => onChange(e, originalValues, setValue, 8, 6)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[8][7]) || null}
                onChange={e => onChange(e, originalValues, setValue, 8, 7)}
              ></input>
            </td>
            <td>
              <input
                type="text"
                value={parseInt(originalValues[8][8]) || null}
                onChange={e => onChange(e, originalValues, setValue, 8, 8)}
              ></input>
            </td>
          </tr>
        </tbody>
      </table>
      <table className="table">
        <tbody>
          <tr>
            <td>{solvedValues[0][0]}</td>
            <td>{solvedValues[0][1]}</td>
            <td className="borderRight">{solvedValues[0][2]}</td>
            <td>{solvedValues[0][3]}</td>
            <td>{solvedValues[0][4]}</td>
            <td className="borderRight">{solvedValues[0][5]}</td>
            <td>{solvedValues[0][6]}</td>
            <td>{solvedValues[0][7]}</td>
            <td>{solvedValues[0][8]}</td>
          </tr>
          <tr>
            <td>{solvedValues[1][0]}</td>
            <td>{solvedValues[1][1]}</td>
            <td className="borderRight">{solvedValues[1][2]}</td>
            <td>{solvedValues[1][3]}</td>
            <td>{solvedValues[1][4]}</td>
            <td className="borderRight">{solvedValues[1][5]}</td>
            <td>{solvedValues[1][6]}</td>
            <td>{solvedValues[1][7]}</td>
            <td>{solvedValues[1][8]}</td>
          </tr>
          <tr className="borderBottom">
            <td>{solvedValues[2][0]}</td>
            <td>{solvedValues[2][1]}</td>
            <td className="borderRight">{solvedValues[2][2]}</td>
            <td>{solvedValues[2][3]}</td>
            <td>{solvedValues[2][4]}</td>
            <td className="borderRight">{solvedValues[2][5]}</td>
            <td>{solvedValues[2][6]}</td>
            <td>{solvedValues[2][7]}</td>
            <td>{solvedValues[2][8]}</td>
          </tr>
          <tr>
            <td>{solvedValues[3][0]}</td>
            <td>{solvedValues[3][1]}</td>
            <td className="borderRight">{solvedValues[3][2]}</td>
            <td>{solvedValues[3][3]}</td>
            <td>{solvedValues[3][4]}</td>
            <td className="borderRight">{solvedValues[3][5]}</td>
            <td>{solvedValues[3][6]}</td>
            <td>{solvedValues[3][7]}</td>
            <td>{solvedValues[3][8]}</td>
          </tr>
          <tr>
            <td>{solvedValues[4][0]}</td>
            <td>{solvedValues[4][1]}</td>
            <td className="borderRight">{solvedValues[4][2]}</td>
            <td>{solvedValues[4][3]}</td>
            <td>{solvedValues[4][4]}</td>
            <td className="borderRight">{solvedValues[4][5]}</td>
            <td>{solvedValues[4][6]}</td>
            <td>{solvedValues[4][7]}</td>
            <td>{solvedValues[4][8]}</td>
          </tr>
          <tr className="borderBottom">
            <td>{solvedValues[5][0]}</td>
            <td>{solvedValues[5][1]}</td>
            <td className="borderRight">{solvedValues[5][2]}</td>
            <td>{solvedValues[5][3]}</td>
            <td>{solvedValues[5][4]}</td>
            <td className="borderRight">{solvedValues[5][5]}</td>
            <td>{solvedValues[5][6]}</td>
            <td>{solvedValues[5][7]}</td>
            <td>{solvedValues[5][8]}</td>
          </tr>
          <tr>
            <td>{solvedValues[6][0]}</td>
            <td>{solvedValues[6][1]}</td>
            <td className="borderRight">{solvedValues[6][2]}</td>
            <td>{solvedValues[6][3]}</td>
            <td>{solvedValues[6][4]}</td>
            <td className="borderRight">{solvedValues[6][5]}</td>
            <td>{solvedValues[6][6]}</td>
            <td>{solvedValues[6][7]}</td>
            <td>{solvedValues[6][8]}</td>
          </tr>
          <tr>
            <td>{solvedValues[7][0]}</td>
            <td>{solvedValues[7][1]}</td>
            <td className="borderRight">{solvedValues[7][2]}</td>
            <td>{solvedValues[7][3]}</td>
            <td>{solvedValues[7][4]}</td>
            <td className="borderRight">{solvedValues[7][5]}</td>
            <td>{solvedValues[7][6]}</td>
            <td>{solvedValues[7][7]}</td>
            <td>{solvedValues[7][8]}</td>
          </tr>
          <tr>
            <td>{solvedValues[8][0]}</td>
            <td>{solvedValues[8][1]}</td>
            <td className="borderRight">{solvedValues[8][2]}</td>
            <td>{solvedValues[8][3]}</td>
            <td>{solvedValues[8][4]}</td>
            <td className="borderRight">{solvedValues[8][5]}</td>
            <td>{solvedValues[8][6]}</td>
            <td>{solvedValues[8][7]}</td>
            <td>{solvedValues[8][8]}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
