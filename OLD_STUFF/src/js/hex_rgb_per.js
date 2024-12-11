const HEX_REGEX = new RegExp(/^#?[0-9A-Fa-f]{6}$/i);
const colorPreview = document.getElementById("color-preview");
const hexInput = document.getElementById("i-hex");
const rgbRawElements = document.getElementsByName("rgb_raw");
const rgbPerElements = document.getElementsByName("rgb_per");
const rgbPerCompElements = document.getElementsByName("rgb_comp_per");
const color3fCodeElement = document.getElementById("color3f-code");
const copyColor3fCodeBtn = document.getElementById("copy-color3f-code-btn");
const tooltipClipbordElement = document.getElementById("clipboard-tooltip");

let tooltipClipboardTimeout;

hexInput.value = ""; // reset on refresh

function resetElements() {
    for (let i = 0; i < 3; i++) {
    
        rgbRawElements[i].innerText = "0";
        rgbPerElements[i].innerText = "0%";
        rgbPerCompElements[i].innerText = "0.0f";
    }
}

hexInput.addEventListener("input", (event) => {
    const target = event.target;
    let value = target.value;

    if (value === "") {
        target.classList.remove("border-green-700");
        target.classList.remove("border-red-700");
        resetElements();
        colorPreview.style.backgroundColor = "";
        return;
    } 

    if (!HEX_REGEX.test(value)) {
        target.classList.remove("border-green-700");
        target.classList.add("border-red-700");
        resetElements();
        return;
    }

    if (!value.includes("#")) {
        target.value = value = "#" + value;
    }

    const rgbRawValues = value.split("#")[1].match(/.{1,2}/g).map((v) => parseInt(v, 16));

    for (let i = 0; i < 3; i++) {
        const valuePer = (rgbRawValues[i] / 255).toFixed(2);

        rgbRawElements[i].innerText = rgbRawValues[i];
        rgbPerElements[i].innerText = `${(valuePer * 100).toFixed(0)}%`; // solves XX.0000001
        rgbPerCompElements[i].innerText = `${valuePer}f`;
    }

    target.classList.remove("border-red-700");
    target.classList.add("border-green-700");

    colorPreview.style.backgroundColor = value;
});

copyColor3fCodeBtn.addEventListener("click", (event) => {
    navigator.clipboard.writeText(color3fCodeElement.innerText.trim());

    tooltipClipbordElement.classList.add("active");

    if (tooltipClipboardTimeout) {
        clearTimeout(tooltipClipboardTimeout);
    }

    tooltipClipboardTimeout = setTimeout((e) => {
        tooltipClipbordElement.classList.remove("active");
    }, 1500);
});