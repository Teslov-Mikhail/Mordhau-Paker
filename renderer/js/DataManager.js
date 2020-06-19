class DataManager {
  constructor() {
    this.filename = localStorage.getItem('filename') || "ModName-p";
    this.dir = localStorage.getItem('dir') || path.resolve(appPath);
    this.structure = localStorage.getItem('structure') || "../../../Mordhau/Content/Mordhau/Assets/*.*";
    this.target = localStorage.getItem('target') || path.resolve(appPath, './paks/');
  }

  get filename() {
    return this._filename;
  }

  set filename(val) {
    this._filename = val;
    inputs.filename.value = val;
    localStorage.setItem('filename', val);
  }

  get structure() {
    return this._structure;
  }

  set structure(val) {
    this._structure = val;
    inputs.structure.value = val;
    localStorage.setItem('structure', val);
  }

  get dir() {
    return this._dir;
  }

  set dir(val) {
    this._dir = val;
    inputs.dirPreview.value = val;
    localStorage.setItem('dir', val);
  }

  get target() {
    return this._target;
  }

  set target(val) {
    this._target = val;
    inputs.targetPreview.value = val;
    localStorage.setItem('target', val);
  }
}

module.exports = DataManager;
