var socket = io()

socket.on('message', function(data){
    addMessage(data.msg, data.name)
})

var sendMessage = function(){
    var msg = $('input#msg-input').val()
    var name = $('input#user-name-input').val()
    socket.emit('message',
    {
        message: msg,
        name: name
    })
    $('input#msg-input').val('')
}

var addMessage = function(msg, username){
    var msgWhole = $('div#msg-whole')
    msgWhole.prepend(makeMessage(msg, username))
}

var makeMessage = function(msg, username){
    if(username===$('input#user-name-input').val())
        return "<div style='text-align: right'><div class='my-msg'><span class='user-name'>" + username + ":</span><span class='message'>" + msg + "</span></div></div></br>"
    else
        return "<div style='text-align: left'><div class='other-msg'><span class='user-name'>" + username + ":</span><span class='message'>" + msg + "</span></div></div></br>"
}