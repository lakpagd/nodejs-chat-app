
// io() connects client to the server
const socket = io()

// ELEMENTS
// '$' sign is used to let variable be identified as an element from DOM
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

// Read from HTML Element ID 'message-form'
$messageForm.addEventListener('submit', (e) => {
    // Prevents default browser refresh
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    // console.log('SEND BUTTON CLICKED!!!');
    
    // /* NOTE::
    // Event Target listens for the HTML Element 'FORM in this case'
    // then Element property can be accessed by their 'NAME'
    // e.target = to get the Form
    // elements.message.value = to get the Value 
    // */

    // Read message input, typed in Form
    const message = e.target.elements.message.value
    // Send message to server, read from 'message-form' 
    // Event name: sendMessage
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        // 'error' returns error message when this callback function
        //  is called by Server 
        if (error) {
            return console.log(error);
        }

        console.log('Message Delivered!');
    })
})

// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition( (position) => {
        // console.log(position)
        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }, (acknowledge) => {
            // 'acknowledge' is a callback function 
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!');
        })
    })
})