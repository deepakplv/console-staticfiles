function show_ttys_form(e) {
    e.preventDefault();
    $('#tts-form-success').hide();
    $('#tts-form-error').hide();
    $('#tts-form-error-api').hide();
    $('#tts-form').show();
}

$('#tts-try-again-error').live("click", show_ttys_form);
$('#tts-try-again').live("click", show_ttys_form);

$('#tts-sub').click(function(e) {
    e.preventDefault();
    var $form = $('#tts-form');
    var number = $('#tts-form #id_phone_number').val();
    number_verify = validateNumber(number);
    if (!number_verify) {
        $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
            $('#tts-form-error').html('Invalid phone number. Please use the standard <a href="http://en.wikipedia.org/wiki/E.164" target="_blank">E.164</a> phone number format [+][country code][area code][phone number]. For example, +14157778888. <a href="" id="tts-try-again-error">Try Again</a>');
            $('#tts-form-error').fadeIn();
        });
        return
    }
    var text = $('#tts-form #id_text').val();
    if(!text) {
        $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
            $('#tts-form-error').html('Please enter some text to generate a call. <a href="" id="tts-try-again-error">Try Again</a>');
            $('#tts-form-error').fadeIn();
        });
        return;
    }
    $.ajax({
        type : 'POST',
        url  : $form.attr('action'),
        data : $("#tts-form").serialize(),
        success: function(response) {
            if(response.response) {
                $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
                    $('#tts-form-success').fadeIn();
                });
            } else {
                if(response.reason=='number') {
                    $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
			$('#tts-form-error').html('Invalid phone number. Please use the standard <a href="http://en.wikipedia.org/wiki/E.164" target="_blank">E.164</a> phone number format [+][country code][area code][phone number]. For example, +14157778888. <a href="" id="tts-try-again-error">Try Again</a>');
                        $('#tts-form-error').fadeIn();
                    });
                } else {
                    $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
                        $('#tts-form-error-api').fadeIn();
                    });
                }
            }
        },
        error: function() {
            $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
                $('#tts-form-error-api').fadeIn();
            });
        }
    });
});

function show_conference_demo(e) {
    e.preventDefault();
    $('#conference-form-success').hide();
    $('#conference-form-error').hide();
    $('#conference-form-error-api').hide();
    $('#conference-form-error-no-number').hide();
    $('#conference-form').show();
}
$('#conference-try-again-error').live("click", show_conference_demo);
$('#conference-try-again').live("click", show_conference_demo);
$('#conference-try-again-number-error').live("click", show_conference_demo);

$('#conference-sub').click(function(e) {
    e.preventDefault();
    var $form = $('#conference-form');
    var number = $('#conference-form #id_phone_number').val();
    var bridge_number = $('#conference-form #id_bridge_phone_number').val();
    var bridge_number2 = $('#conference-form #id_bridge_phone_number2').val();
    if(!number || !bridge_number || !bridge_number2 ) {
        $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
            $('#conference-form-error-no-number').fadeIn();
        });
        return
    }
    number_verify1 = validateNumber(number);
    number_verify2 = validateNumber(bridge_number);
    number_verify3 = validateNumber(bridge_number2);
    if (!number_verify1 || !number_verify2 || !number_verify3) {
        $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
            $('#conference-form-error').html('One of your numbers is invalid. Please use the standard <a href="http://en.wikipedia.org/wiki/E.164" target="_blank">E.164</a> phone number format [+][country code][area code][phone number]. For example, +14157778888. <a href="" id="conference-try-again-error">Try Again</a>');
            $('#conference-form-error').fadeIn();
        });
        return
    }

    if (number === bridge_number && bridge_number === bridge_number2) {
        $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
            $('#conference-form-error').html('You need three different <a href="/phone-numbers/sandbox-numbers/">sandbox numbers</a> to start a conference demo. <a href="" id="conference-try-again-error">Try Again.</a>');
            $('#conference-form-error').fadeIn();
        });
        return;
    }

    $.ajax({
        type : 'POST',
        url  : $form.attr('action'),
        data : $("#conference-form").serialize(),
        success: function(response) {
            if(response.response) {
                $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
                    $('#conference-form-success').fadeIn();
                });
            } else {
                if(response.reason=='number') {
                    $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
			$('#conference-form-error').html('One of your numbers is invalid. Please use the standard <a href="http://en.wikipedia.org/wiki/E.164" target="_blank">E.164</a> phone number format [+][country code][area code][phone number]. For example, +14157778888. <a href="" id="conference-try-again-error">Try Again</a>');
                        $('#conference-form-error').fadeIn();
                    });
                } else {
                    $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
                        $('#conference-form-error-api').fadeIn();
                    });
                }
            }
        },
        error: function() {
            $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
                $('#conference-form-error-api').fadeIn();
            });
        }
    });
});

function show_message_form(e) {
    e.preventDefault();
    $('#text-message-form-success').hide();
    $('#text-message-form-error').hide();
    $('#text-message-api-error').hide();
    $('#text-message-form').show();
}
$('#text-message-try-again-error').live("click", show_message_form);
$('#text-message-try-again').live("click", show_message_form);

$('#text-message-sub').click(function(e) {
    e.preventDefault();
    var $form = $('#text-message-form');
    var number = $('#text-message-form #id_phone_number').val();
    number_verify = validateNumber(number);
    if (!number_verify) {
        $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
            $('#text-message-form-error').html('Invalid phone number. Please use the standard <a href="http://en.wikipedia.org/wiki/E.164" target="_blank">E.164</a> phone number format [+][country code][area code][phone number]. For example, +14157778888. <a href="" id="text-message-try-again-error">Try Again</a>');
            $('#text-message-form-error').fadeIn();
        });
        return
    }

    var text = $('#text-message-form #id_text').val();
    if(!text) {
        $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
            $('#text-message-form-error').html('Please enter some text to send an SMS. <a href="" id="text-message-try-again-error">Try Again</a>');
            $('#text-message-form-error').fadeIn();
        });
        return;
    }

    $.ajax({
        type : 'POST',
        url  : $form.attr('action'),
        data : $("#text-message-form").serialize(),
        success: function(response) {
            if(response.response) {
                $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
                    $('#text-message-form-success').fadeIn();
                });
            } else {
                if(response.reason=='caller_id') {
                    $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
			$('#text-message-form-error').html('To send an SMS to a US number you need to have an SMS enabled <a href="/phone-numbers/search/">US number</a> in your account.');
                        $('#text-message-form-error').fadeIn();
                    });
                } else if(response.reason=='number') {
		    $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
			$('#text-message-form-error').html('Invalid phone number. Please use the standard <a href="http://en.wikipedia.org/wiki/E.164" target="_blank">E.164</a> phone number format [+][country code][area code][phone number]. For example, +14157778888. <a href="" id="text-message-try-again-error">Try Again</a>');
                        $('#text-message-form-error').fadeIn();
                    });
		} else {
                    $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
                        $('#text-message-api-error').fadeIn();
                    });
                }
            }
        },
        error: function() {
            $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
                $('#text-message-api-error').fadeIn();
            });
        }
    });
});

$('#phone-verify').click(function(e) {
    e.preventDefault();
    $('#verification-modal').modal('toggle')

    $('#modbody').show()
    $('#modheader').show()
    $('#modfooter').show()
    $('#call-form').show()

    $('#verify-form').hide();
    $('#phone-validation').hide();
    $('#phone-format').hide();
    $('#code-format').hide();
    $('#verification-success-header').hide()
    $('#verification-success-body').hide()
    $('#activate-later-header').hide()
    $('#activate-later-body').hide()

});

$('#call-sub').click(function(e) {
    e.preventDefault();
    $('#phone-format').hide();
    $('#phone-validation').hide();

    var $form = $('#call-form'),
    $validation = $('#call-validation'),
    data = $form.triggerHandler('submit');

    var number = $('#call-form #id_phone_number').val();
    number_verify = validateNumber(number);
    if (!number_verify) {
        $('#phone-format').fadeIn();
        return
    }

    $.ajax({
        type : 'POST',
        url  : $form.attr('action'),
        data : $("#call-form").serialize(),
        success: function(response) {
            if(response.status == 'success') {
                $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
                    $('#verify-form').fadeIn();
                });
            }
            else {
                $('#phone-validation').html(response.message);
                $('#phone-validation').fadeIn();
            }
        },
        error: function(response) {
            $('#phone-validation').fadeIn();
        }
    });
});

$('#verify-sub').click(function(e) {
    e.preventDefault();

    var $form = $('#verify-form'),
    $validation = $('#call-validation'),
    data = $form.triggerHandler('submit');

    var verification_code = $('#id_verification_code').val();
    code_verify = validateCode(verification_code);
    if(!code_verify) {
        $('#code-format').fadeIn();
        return
    }

    $.ajax({
        type : 'POST',
        url  : $form.attr('action'),
        data : $("#verify-form").serialize(),
        success: function(response) {
            if(response.status == 'success') {
                $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
                    $form.html($('#success-form').html()).fadeIn();
                });
                $('#modheader').hide();
                $('#modbody').hide();
                $('#modfooter').hide();
                $('#verification-success-header').show();
                $('#verification-success-body').show();
                $('#plivo-phone-number').html(response.message);
                $('#activate-later-header').hide();
                $('#activate-later-body').hide();
            }
            else {
                $('#call-validation, #call-validation-msg').fadeIn();
            }
        },
        error: function(response) {
            $('#call-validation, #call-validation-msg').fadeIn();
        }
    });
});

$('#activate-later').click(function(e) {
    e.preventDefault();
    $('#verify-form').hide();
    $('#phone-validation').hide();
    $('#phone-format').hide();
    $('#code-format').hide();
    $('#verification-success-header').hide()
    $('#verification-success-body').hide()
    $('#modbody').hide()
    $('#modheader').hide()
    $('#modfooter').hide()
    $('#activate-later-header').show()
    $('#activate-later-body').show()
});

$('#verify-yes').click(function(e) {
    e.preventDefault();
    $('#verify-form').hide();
    $('#phone-validation').hide();
    $('#phone-format').hide();
    $('#code-format').hide();
    $('#verification-success-header').hide()
    $('#verification-success-body').hide()
    $('#modbody').show()
    $('#modheader').show()
    $('#modfooter').show()
    $('#activate-later-header').hide()
    $('#activate-later-body').hide()
});

function show_dev_account_modal()
{
    $('#verify-form').hide();
    $('#phone-validation').hide();
    $('#phone-format').hide();
    $('#code-format').hide();
    $('#verification-success-header').hide()
    $('#verification-success-body').hide()
    $('#modbody').show()
    $('#modheader').show()
    $('#modfooter').show()
    $('#activate-later-header').hide()
    $('#activate-later-body').hide()
    $('#verification-modal').modal('toggle')
}

$('#verify-no').click(function(e) {
    e.preventDefault();
    $('#verification-modal').modal('toggle')
});

$('#call-again-sub').click(function(e) {
    e.preventDefault();
    $('#verify-form').hide();
    $('#phone-validation').hide();
    $('#phone-format').hide();
    $('#code-format').hide();
    $('#verification-success-header').hide()
    $('#verification-success-body').hide()
    $('#modbody').show()
    $('#modheader').show()
    $('#modfooter').show()
    $('#activate-later-header').hide()
    $('#activate-later-body').hide()
    $('#call-form').show()
});


$('#conference-not-verify-sub').click(function(e) {
    e.preventDefault();
    var $form = $('#conference-form');
    $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
        $('#conference-not-verified-message').fadeIn();
    });
});


$('#text-message-not-verify-sub').click(function(e) {
    e.preventDefault();
    var $form = $('#text-message-form');
    $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
        $('#text-message-not-verified-message').fadeIn();
    });
});


$('#tts-not-verify-sub').click(function(e) {
    e.preventDefault();
    var $form = $('#tts-form');
    $form.css({ 'height' : $form.height() }).fadeOut('fast', function() {
        $('#tts-not-verified-message').fadeIn();
    });
});


$('#free-number').click(function(e) {
    e.preventDefault();
    $.ajax({
        type : 'GET',
        url  : '/number/claim/',
        success: function(response) {
            $('#free-number-modal').modal('toggle')
        },
        error: function(response) {
            $('#free-number-error').modal('toggle')
        }
    });
});


function validateNumber(number){
    var number_reg = /^\+\d+$/;
    if (!number){
        return false
    }
    return number_reg.test(number)
}

function validateCode(number){
    var code_reg = /^[0-9]+$/;
    if (!number){
        return false
    }
    if (number.length != 4) {
        return false
    }
    return code_reg.test(number)
}

