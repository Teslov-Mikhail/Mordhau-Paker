const { remote, shell } = require('electron');
const { app, dialog } = require('electron').remote;
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-jetpack');
const changelog = require('./data/changelog.json');
let appPath = app.getAppPath();

const TeslovInput = require("./js/components/input.js");
const DataManager = require("./js/DataManager.js");

let topNav = document.querySelectorAll('.nav-btns .nav-btn');
let thisWindow = remote.getCurrentWindow();

document.querySelector("#title").innerHTML = document.querySelector("#title").innerHTML.replace("{{currentVersion}}", changelog[0].version);

topNav[0].onclick = function(e) {
  inputs.log.innerHTML = "";
  for (let version of changelog) {
    inputs.log.innerHTML += `
      <h3>${version.version}</h3>
      <ul>
    `;
    for (let change of version.log) {
      inputs.log.innerHTML += `<li>${change}</li>`;
    }
    inputs.log.innerHTML += `</ul>`;
  }
  inputs.log.parentElement.style.display = "block";
};

topNav[1].onclick = function(e) {
  shell.openExternal('https://docs.google.com/document/d/1QuqXCDM4aHAh7BiERZ3Iyq_dv8jSyyBp2M9o4xjrho4/edit');
};

topNav[2].onclick = function(e) {
  thisWindow.minimize();
};

topNav[3].onclick = function(e) {
  if (!thisWindow.isMaximized()) {
    thisWindow.maximize();
  } else {
      thisWindow.unmaximize();
  }
};

topNav[4].onclick = function(e) {
  thisWindow.close();
};

let inputs = {
  filename: document.querySelector("teslov-input[name='filename']"),
  dirPreview: document.querySelector("teslov-input[name='dir']"),
  dir: document.querySelector("teslov-input[name='dir']").button,
  structure: document.querySelector("teslov-input[name='structure']"),
  structureClear: document.querySelector("teslov-input[name='structure']").button,
  targetPreview: document.querySelector("teslov-input[name='target']"),
  target: document.querySelector("teslov-input[name='target']").button,
  pak: document.querySelector(".button[name='pak']"),
  log: document.querySelector(".log > div"),
  closeLog: document.querySelector(".log > .button")
};

let data = new DataManager();
console.log(data);

inputs.filename.onkeyup = function(e) {
  data.filename = this.value;
};

inputs.structure.onkeyup = function(e) {
  data.structure = this.value;
};

inputs.structureClear.onclick = function(e) {
  data.structure = "../../../Mordhau/Content/Mordhau/Assets/*.*";
};

inputs.dir.onclick = function(e) {
  dialog.showOpenDialog({
    title: "Choose directory to PAK",
    buttonLabel: "Choose Directory",
    defaultPath: data.dir || app.getPath("desktop"),
    properties: ["openDirectory"]
  }).then((filepath) => {
    if (filepath.canceled) {
      return;
    }
    data.dir = filepath.filePaths[0];
  });
};

inputs.target.onclick = function(e) {
  dialog.showOpenDialog({
    title: "Choose target directory",
    buttonLabel: "Choose Directory",
    defaultPath: data.target || app.getPath("desktop"),
    properties: ["openDirectory"]
  }).then((filepath) => {
    if (filepath.canceled) {
      return;
    }
    data.target = filepath.filePaths[0];
  });
};

inputs.closeLog.onclick = function() {
  inputs.log.parentElement.style.display = "none";
}

inputs.pak.onclick = function(e) {
  fs.file(
    path.resolve(appPath, './ue4pak/response-file.txt'),
    {
      content: `"${data.dir}\\*.*" ${data.structure}`
    }
  );

  let child = spawn(path.resolve(appPath, './ue4pak/UnrealPak.exe'), [
    path.resolve(data.target, data.filename + ".pak"),
    `-Create="${ path.resolve(appPath, './ue4pak/response-file.txt') }"`,
  ]);

  inputs.log.innerHTML = "";

 child.stdout.on('data', (chunk) => {
  inputs.log.parentElement.style.display = "block";
  console.log(chunk.toString());
  inputs.log.innerHTML += chunk.toString() + "<br>";
 });

 child.stderr.on('error', (chunk) => {
  inputs.log.parentElement.style.display = "block";
  console.error("Error", chunk);
  inputs.log.innerHTML += chunk.toString() + "<br>";
 });

 child.on('error', (err) => {
  inputs.log.parentElement.style.display = "block";
  console.error("Error", err);
  inputs.log.innerHTML += err.toString() + "<br>";
 });

 child.on('close', (code, signal) => {
   console.log("Close", code, signal);
 });

 child.on('exit', (code, signal) => {
   console.log("Exit", code, signal);
 });
};
