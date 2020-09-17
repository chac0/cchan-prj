$(function(){
    $('button#msg-btn').on('mousedown', function(){
        var button = $(this)
        button.css({
            'top': '3px',
            'border-bottom': '0'
        })
    })
    $('button#msg-btn').on('mouseup', function(){
        var button = $(this)
        button.css({
            'top': '0',
            'border-bottom': '3px solid white'
        })
    })

    $('input#msg-input').keypress(function(e){
        if(e.which == 13){
            sendMessage()
        }
    })
})