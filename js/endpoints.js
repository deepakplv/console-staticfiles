$(document).ready(function(){
  let endpointId = ''
  $('.modal').on('show.bs.modal', function () {
    $('.error-container').addClass('hidden')
    $('.invalid-feedback').html('')
  })
  $('.modal').on('hide.bs.modal', function () {
    $('.error-container').addClass('hidden')
    $('.invalid-feedback').html('')
  })

  $('.delete-link').on('click', function(event) {
    event.preventDefault();
    endpointId = $(this).data("id");
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
      url: '/endpoint/delete/'+ endpointId +'/',
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
  $('#edit_endpoint_button').on('click', function(e) {
    e.preventDefault()
    $('.invalid-feedback').html('')
    $.post({
      url: '/endpoint/edit/' + endpointId+ '/',
      data: $('#form_edit_endpoint').serialize(),
      success: function() {
        document.location.reload()
      },
      error: function(xhr) {
        try {
          var data = xhr.responseJSON.errors
          if(data.username) {
            $('.username-field').find('.invalid-feedback').html(data.username)
          }
          if(data.alias) {
            $('.alias-field').find('.invalid-feedback').html(data.alias)
          }
          if(data.password) {
            $('.password-field').find('.invalid-feedback').html(data.password)
          }
          if(data.misc) {
            $('.error-container')
              .removeClass('hidden')
              .find('.error-body')
              .html(data.misc)
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

  $('.edit_endpoint').on('click', function(e) {
    e.preventDefault()
    var self = $(this)

    var username = self.data('username'),
      alias      = self.data('alias'),
      appId      = self.data('app-id'),
      subName    = self.data('subaccount-name'),
      subId      = self.data('subaccount-id'),
      subaccount = '<select name = "sub_account" class = "jcf-ignore" id = "id_sub_account"> <option value = "-1" selected = "selected">-----------</option> </select>'

    endpointId = self.data('id'),

      $.get({
        url: '/app/getaccountapps/',
        success: function(data) {
          $('.username-field #username').val(username.slice(0,-12));
          $('.alias-field #alias').val(alias);
          $('.subaccount-wrapper').html(subaccount)

          var options = []
          $.each(data, function(key, val) {
            options.push("<option value="+val[0]+">"+val[1]+"</option>")
          })

          $('#id_app')
            .html(options.join(''))
            .val(appId)
            .trigger('change')

          if(subId) {
            $('#id_sub_account').append('<option selected="selected" value='+subId+'>'+subName+'</option>')
          }

          $('#id_sub_account').ajaxChosen({
            url: '/subaccount/search/'
          });

          // $('.username-field #').val()
          $('#edit').modal('toggle')
        },
        error: function(xhr) {
        }
      })
  })
});
