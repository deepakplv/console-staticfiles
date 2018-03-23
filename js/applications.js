$(document).ready(function(){
  let rowId = ''
  $('.modal').on('show.bs.modal', function () {
    $('.error-container').addClass('hidden')
    $('.invalid-feedback').html('')
  })
  $('.modal').on('hide.bs.modal', function () {
    $.each($(this).find('form'), function(key, form) {
      form.reset()
    })
    $('.error-container').addClass('hidden')
    $('.invalid-feedback').html('')
  })


  $('.delete-link').on('click', function(event) {
    event.preventDefault();
    rowId = $(this).data("id");
    var name = $(this).data("name");
    $('.delete_name').html(name)
    $('#confirm_delete').modal('toggle');
  });

  $('#delete_button').on('click', function(e) {
    var csrf = $(this).data('csrf')
    $('.error-container')
      .addClass('hidden')
    e.preventDefault()
    $.post({
      url: '/app/delete/'+ rowId +'/',
      data: {
        csrfmiddlewaretoken: csrf
      },
      success: function(data) {
        document.location.reload()
      },
      error: function(xhr) {
        $('.error-container')
          .removeClass('hidden')
          .find('.error-body')
          .html('Something went wrong. Please try again.')
      }
    })
  })

  $('#edit_submit_button').on('click', function(e) {
    e.preventDefault()
    $('.invalid-feedback').html('')
    $.post({
      url: '/app/edit/' + rowId+ '/',
      data: $('#form_edit').serialize(),
      success: function() {
        document.location.reload()
      },
      error: function(xhr) {
        try {
          var data = xhr.responseJSON.errors

          if(data.app_name) {
            $('.app-name-field').find('.invalid-feedback').html(data.app_name)
          }
          if(data.message_url) {
            $('.message-url-field').find('.invalid-feedback').html(data.message_url)
          }
          if(data.message_method) {
            $('.message-method-field').find('.invalid-feedback').html(data.message_method)
          }
          if(data.answer_url ) {
            $('.answer-url-field').find('.invalid-feedback').html(data.answer_url)
          }
          if(data.answer_method) {
            $('.answer-method-field').find('.invalid-feedback').html(data.answer_method)

          }
          if(data.fallback_answer_url) {
            $('.fallback-url-field').find('.invalid-feedback').html(data.fallback_answer_url)
          }
          if(data.fallback_method) {
            $('.fallback-method-field').find('.invalid-feedback').html(data.fallback_method)
          }
          if(data.hangup_url) {
            $('.hangup-url-field').find('.invalid-feedback').html(data.hangup_url)
          }
          if(data.hangup_method) {
            $('.hangup-method-field').find('.invalid-feedback').html(data.hangup_method)
          }

          if(data.sms_phlos) {
            $('.app-smsphlos-field').find('.invalid-feedback').html(data.hangup_method)
          }

          if(data.voice_phlos) {
            $('.app-voicephlos-field').find('.invalid-feedback').html(data.hangup_method)
          }

          if(data.misc || data.__all__) {
            var breakline = '<br/>';
            if (data.misc == undefined ) {
                data.misc = '';
                breakline = '';
            }
            if (data.__all__ == undefined ) {
                data.__all__ = '';
                breakline = '';
            }
            var errorText = data.misc + breakline + data.__all__;
            $('.error-container')
              .removeClass('hidden')
              .find('.error-body')
              .html(errorText)
          }
        } catch(e) {
          $('.error-container')
            .removeClass('hidden')
            .find('.error-body')
            .html('Something went wrong. Please try again.')
        }
      }
    })
  })



  $('.view-numbers-endpoints').on('click', function(e) {
    var self = $(this)
    var action = self.data('action')
    var id = self.data('id')
    var url = "/app/" + action + "/" + id + "/"
    var title = action == 'numbers' ? 'Phone numbers' : 'Endpoints'
    var modal = $('#modal-numbers-endpoints')
    $('#number-endpoint-title').html(title)
    $.get({
      url: url,
      success: function(data) {
        modal.find('.modal-body').html(data.numbers_for_app)
        modal.modal('toggle')
      }
    })
  })

  $('.edit_row').on('click', function(e) {
    e.preventDefault()
    var self = $(this)

    var app_name          = self.data('app_name'),
      message_url         = self.data('message_url'),
      message_method      = self.data('message_method'),
      answer_url          = self.data('answer_url'),
      answer_method       = self.data('answer_method'),
      fallback_answer_url = self.data('fallback_answer_url'),
      fallback_method     = self.data('fallback_method'),
      hangup_url          = self.data('hangup_url'),
      hangup_method       = self.data('hangup_method'),
      subName             = self.data('sub_account_name'),
      subId               = self.data('sub_account_id'),
      default_app         = self.data('default_app'),
      direct_dial         = self.data('direct_dial'),
      public_uri          = self.data('public_uri'),
      app_type            = self.data('app_type')

    $('#app_name').val(app_name)
    $('#message_url').val(message_url)
    $('#message_method').val(message_method).trigger('change')
    $('#answer_url').val(answer_url)
    $('#answer_method').val(answer_method).trigger('change')
    $('#fallback_answer_url').val(fallback_answer_url)
    $('#fallback_method').val(fallback_method).trigger('change')
    $('#hangup_url').val(hangup_url)
    $('#hangup_method').val(hangup_method).trigger('change')

    if(default_app == 'True') {
      $('#default_app').prop('checked', true)
    }

    if(direct_dial == 'True') {
      $('#direct_dial').prop('checked', true)
    }

    if(public_uri == 'True') {
      $('#public_uri').prop('checked', true)
    }

    subaccount = '<select name = "sub_account" class = "jcf-ignore" id = "id_sub_account"> <option value = "-1">-----------</option> </select>'
    $('.subaccount-wrapper').html(subaccount)

    rowId = self.data('id')
    if(subId) {
      $('#id_sub_account').append('<option selected="selected" value='+subId+'>'+subName+'</option>')
    }

    $('#id_sub_account').ajaxChosen({
      url: '/subaccount/search/'
    });

    $('.togllable-field').hide();
    if (app_type == 'phlo') {
      $('#id_type_1').click().trigger('change');
      $('#phlo-fields').show();
    } else {
      $('#id_type_0').click().trigger('change');
      $('#xml-fields').show();

    }

    $('#id_sms_phlos').ajaxChosen({
      type: 'GET',
      url: '/proxy/v1/config/phlo/',
      dataType: 'json',
      valueAttribute: 'url',
      searchType: {name: "name", value: "" }, // if you want the search string to be query params, not in url
      getParams: [{ name: "type", value: "sms" }],
      callbackHandler: function() {
        if (app_type == 'phlo') {
          $('#id_sms_phlos').val(message_url).trigger('chosen:updated');
        }
      }
    });

    $('#id_voice_phlos').ajaxChosen({
      type: 'GET',
      url: '/proxy/v1/config/phlo/',
      dataType: 'json',
      valueAttribute: 'url',
      searchType: {name: "name", value: "" }, // if you want the search string to be query params, not in url
      getParams: [{ name: "type", value: "voice" }],
      callbackHandler: function() {
        if (app_type == 'phlo') {
          $('#id_voice_phlos').val(answer_url).trigger('chosen:updated');
        }
      }
    });

    $('#edit').modal('toggle')
  })
});

$(function(){
  $('input[name=type]').change(function(){
    var typeValue = $('input[name=type]:checked').val();
    $('.togllable-field').hide();
    if (typeValue == 'phlo') {
      $('#phlo-fields').show();
    }
    if (typeValue == 'xml') {
      $('#xml-fields').show();
    }
  });

  $('#id_voice_phlos').change(function(){
    var url = $(this).val();
    $('#answer_url').val(url);
    $('#hangup_url').val(url);
  })

  $('#id_sms_phlos').change(function(){
    var url = $(this).val();
    $('#message_url').val(url);
  })

  $('#form_edit').submit(function(){
    var typeValue = $('input[name=type]:checked').val();
    if (typeValue == 'phlo') {
      var voiceUrl = $('#id_voice_phlos').val();
      $('#answer_url').val(voiceUrl);
      $('#hangup_url').val(voiceUrl);
      var smsUrl = $('#id_sms_phlos').val();
      $('#message_url').val(smsUrl);
    }
    return true;
  })


});
