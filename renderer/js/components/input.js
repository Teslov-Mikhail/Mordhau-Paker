const STYLE = `
@import "https://fonts.googleapis.com/icon?family=Material+Icons";

:host > div{
  padding-top: 6px;
  position: relative
}
input{
  width: calc(100% - 24px);
  padding: 10px;
}
label {
  position: absolute;
  top: 0px;
  left: 10px;
  font-size: 12px;
  background: #fff;
  color: #777;
}
i.material-icons {
  position: absolute;
  right: 0;
  top: 6px;
  bottom: 0;
  background-color: #777;
  line-height: 39px;
  width: 39px;
  -webkit-user-select: none;
  cursor: pointer;
  color: #f8f8f8;
}
i.material-icons:hover {
  background-color: #aaa;
}
`;

class TeslovInput extends HTMLElement {
  constructor() {
    super();

    var shadow = this.attachShadow({mode: 'open'});

    this.container = document.createElement('div');

    this.container.innerHTML = `
      <label for="input">
        ${this.getAttribute("label")}
      </label>
      <input
        id="input"
        type="text"
        placeholder="${this.getAttribute("label")}"
        ${( this.getAttribute("readonly") ? "readonly" : "" )}
        value="${this.getAttribute("value") || ""}"
      >
    `;

    if (this.getAttribute("btn")) {
      this.button = document.createElement("i");
      this.button.classList.add("material-icons");
      this.button.innerHTML = this.getAttribute("btn");

      this.container.appendChild(this.button);
    }

    var style = document.createElement('style');
    style.textContent = STYLE;

    shadow.appendChild(style);
    shadow.appendChild(this.container);
  }

  get value() {
    return this.container.querySelector("input").value;
  }

  set value( val ) {
    this.container.querySelector("input").value = val;
  }
}

customElements.define('teslov-input', TeslovInput);
