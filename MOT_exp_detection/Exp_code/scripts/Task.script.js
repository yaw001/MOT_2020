function pageLoad() {
    document.getElementById('consent').style.display = 'block';
    document.getElementById('ad').style.display = 'none';
}

function clickConsent() {
    document.getElementById('consent').style.display = 'none';
    document.getElementById('welcome').style.display = 'block';
}

function clickInstructions_1() {
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('instructions_1').style.display = 'block';
}

function clickInstructions_2() {
    document.getElementById("instructions_1").style.display = 'none';
    document.getElementById('instructions_2').style.display = 'block';
}

function clickInstructions_3() {
    document.getElementById("instructions_2").style.display = 'none';
    document.getElementById('instructions_3').style.display = 'block';
}

function clickInstructions_4() {
    document.getElementById("instructions_3").style.display = 'none';
    document.getElementById('instructions_4').style.display = 'block';
}

function clickInstructions_5() {
    document.getElementById("instructions_4").style.display = 'none';
    document.getElementById('instructions_5').style.display = 'block';
}

function clickInstructions_6() {
    document.getElementById("instructions_5").style.display = 'none';
    document.getElementById('ad').style.display = 'block';
}