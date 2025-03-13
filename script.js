const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={}[]:;"<,>.?/|';

let password = "";
let passwordLength = 10;
let checkCount = 0;
setIndicator("#ccc");
handleSlider();

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.textContent = passwordLength;

    const max = inputSlider.max;
    const min = inputSlider.min;
    inputSlider.style.backgroundSize = ((passwordLength-min)/(max-min)*100) + "%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getrndInteger(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}
function generateRandomNumber(){
    return getrndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getrndInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getrndInteger(65,91));
}
function generateSymbol(){
    return symbols[getrndInteger(0,symbols.length-1)];
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) setIndicator("#0f0");
    else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 6) setIndicator("#ff0");
    else setIndicator("#f00");
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Not Copied";
    }

    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value) copyContent();
});


//agar kisi bhi checkbox ko tick ya untick kiya ja rha h, to charo checkboxes ko dubara se count krna h
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked) checkCount++;
    });

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

function shufflePassword(array){
    //Fisher Yates Method - works on array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener('click', ()=>{
    //if none of the checkboxes are ticked
    if(checkCount == 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //remove old password
    password = "";

    //let's start making password
    let funcArr = [];

    if(uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if(numbersCheck.checked) funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked) funcArr.push(generateSymbol);

    //compulsory additions in the password (all the ticked checkboxes)
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    //remaining additions
    for(let i=0; i<passwordLength-funcArr.length; i++){
        password += funcArr[getrndInteger(0, funcArr.length)]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    //calculate Strength
    calcStrength();
});