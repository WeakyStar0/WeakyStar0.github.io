// this just some cool animation in the tab title feel free to use it :D

const originalTitle = "Weaky"; // replace with your desired title
let index = originalTitle.length;
let isRemoving = true;
let delay = 300; 

function animateTitle() {
    document.title = originalTitle.substring(0, index);

    if (isRemoving) {
        index--;
        if (index <= 1) {
            isRemoving = false;
        }
    } else {
        index++;
        
        if (index >= originalTitle.length) {
            isRemoving = true;
        }
    }
}

setInterval(animateTitle, delay);