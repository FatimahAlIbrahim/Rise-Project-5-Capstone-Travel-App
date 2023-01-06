import './styles/resets.scss'
import './styles/style.scss'
import pinIcon from './images/pushpin.png'

let pinImages = document.getElementsByClassName("card-pin");

for(let i = 0; i < pinImages.length; i++){
    pinImages[i].src = pinIcon;
}

alert("I Exist!")