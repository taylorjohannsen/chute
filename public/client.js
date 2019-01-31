console.log('Client JS Connected');

function noSpace(event) {
    let spaceBar = event ? event.which : window.event.keyCode;
    if (spaceBar == 32) return false;
}