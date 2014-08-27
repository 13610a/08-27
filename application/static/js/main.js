$(function() {
    // 3-3 delete start
    /*
    var pusher = new Pusher(PUSHER_KEY),
        testChannel = pusher.subscribe('uos-pusher'),
        broadcast = pusher.subscribe('br'),
        $window = $(window),
    */
    // 3-3 delete end
    var $window = $(window),    // 3-4 add
        $usernameInput = $('.usernameInput[name=username]'),
        $messages = $('.messages'),
        $inputMessage = $('.inputMessage'),
        $loginPage = $('.login.page'),
        $chatPage = $('.chat.page');


    var username;

    $usernameInput.focus();

    /*
    $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: success,
      dataType: dataType
    });
    */

    // 3-5 delete start
    /*
    broadcast.bind('new_message', function(data) {
        addChatMessage(data);
    });
    */
    // 3-5 delete end

    // 3-6 add start
    function startPusher() {
        var pusher = new Pusher(PUSHER_KEY),
            testChannel = pusher.subscribe('test_channel'),
            broadcast = pusher.subscribe('br');

        broadcast.bind('new_message', function(data) {
            addChatMessage(data);
        });

        broadcast.bind('user_joined', function(data) {
            log(data.username + ' joined');
        });
    }
    // 3-6 add end

    function addChatMessage(data) {
        var $usernameDiv = $('<span class="username"></span>');
        $usernameDiv.css("color", getUsernameColor(data.username));
        $usernameDiv.text(data.username);

        var $messageBodyDiv = $('<span class="messageBody"></span>');
        $messageBodyDiv.text(data.message);

        var typingClass = data.typing ? 'typing' : '';
        var $messageDiv = $('<li class="message ' + typingClass + '"></li>');
        $messageDiv.append($usernameDiv)
            .append($messageBodyDiv)
            .data('username', data.username);

        addMessageElement($messageDiv);
    }

    function addMessageElement(el) {
        var $el = $(el);
        $messages.append($el);

        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    function getUsernameColor(username) {
        // Compute hash code
        var hash = 7;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % 360);
        return "hsl(" + index + ", 77%, 60%)";
    }

    function sendMessage () {
        var message = $inputMessage.val().trim();

        // if there is a non-empty message
        if (message) {
            $inputMessage.val('');

            $.post('/api/call/new_message', {
                "message": message,
                "username": username
            });
        }
    }

    function setUsername() {
        var __username = $usernameInput.val().trim();

        // If the username is valid
        if (__username) {
            // 3-7 delete start
            /*
            username = __username;
            $loginPage.fadeOut();
            $chatPage.show();
            $inputMessage.focus();
            */
            // 3-7 delete end

            // 3-8 add start
            $.post("/api/start", {
                    'username': __username,
                },
                function(data) {
                    if (data.status == 0) {
                        username = __username;
                        $loginPage.fadeOut();
                        $chatPage.show();
                        $inputMessage.focus();

                        startPusher();
                        connected = true;
                        // Display the welcome message
                        var message = "Welcome to Chat &mdash; ";
                        log(message);
                    } else {
                        alert("error");
                    }
                }, "json"
            );
            // 3-8 add end
        }
    }

    // 3-9 add start
    function log(message, options) {
        var el = '<li class="log">' + message + '</li>';
        addMessageElement(el, options);
    }
    // 3-9 add end

    $window.keydown(function(event) {
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {

            if (username) {
                sendMessage();
            } else {
                setUsername();
                $usernameInput.blur();
            }

        }
    });

});