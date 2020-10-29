
// io() connects client to the server
const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

// Read from HTML Element ID 'message-form'
document.querySelector('#message-form').addEventListener('submit', (e) => {
    // Prevents default browser refresh
    e.preventDefault()

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
        // 'error' returns error message when this callback function
        //  is called by Server 
        if (error) {
            return console.log(error);
        }

        console.log('Message Delivered!');
    })
})

// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition( (position) => {
        // console.log(position)
        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }, (acknowledge) => {
            // 'acknowledge' is a callback function 
            console.log('Location shared!');
        })
    })
})