$(document).ready(function(){

  $('#confirm_delete_carrier, #view_ip, #add_incoming_carrier').on('show.bs.modal', function () {
    $('.error-container').addClass('hidden')
    $('.invalid-feedback').html('')
  })
  $('#confirm_delete_carrier, #view_ip, #add_incoming_carrier').on('hide.bs.modal', function () {
    $.each($(this).find('form'), function(key, form) {
      form.reset()
    })
    $('.error-container').addClass('hidden')
    $('.invalid-feedback').html('')
  })

  var deleteUrl = '', id = ''

  $('.delete-carrier').on('click', function(event) {
    event.preventDefault();
    $('#confirm_delete_carrier').modal('toggle');
    deleteUrl = $(this).data("href");
    var name = $(this).data("name");
    $('.carrier_name').html(name)
  });

  $('#delete_carrier_button').on('click', function(e) {
    $('.error-container')
      .addClass('hidden')
    e.preventDefault()
    Pace.restart()
    $.post({
      url: deleteUrl,
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

  $('.get_all_ips').on('click', function(event) {
    event.preventDefault();
    $('.ips').hide();
    var url = $(this).data("href");
    $.getJSON(url, process_response_func);
  });

  function process_response_func(response){
    //stop spinner
    /*
    $( '#spinner' ).fadeOut();
    $('#modal_header').html('<a href="#" class="close" data-dismiss="modal">×</a><h3>'+response.title+'</h3>')
    $('#result').html('<textarea readonly="" rows="14" id="textarea" name="textarea" class="xxlarge">');
     */
    $('#all_ips').val(response.ips_for_carrier)
    $('.ips').show();
    $('#view_ip').modal('toggle');
  }

  $('.edit_carrier_open_modal').on('click', function(e) {
    e.preventDefault()
    console.log($(this))
    id = $(this).data('id')
    $('#name').val($(this).data('name'))
    $('.add-carrier-title').html('EDIT')
    $('#edit_carrier_button').show()
    $('#add_carrier_button').hide()
    $.get({
      url: "/carrier/incomingcarrier/ips/" + id + "/",
      success: function(data) {
        $('#ips').html(data.ips_for_carrier)
        $('#add_incoming_carrier').modal('toggle')
      }
    })
  })

  $('#add_carrier_open_modal').on('click', function(e) {
    e.preventDefault()
    $('.add-carrier-title').html('ADD')
    $('#edit_carrier_button').hide()
    $('#add_carrier_button').show()
    $('#add_incoming_carrier').modal('toggle')
  })

  $('#add_carrier_button').on('click', function(e) {
    $('.error-container')
      .addClass('hidden')
    e.preventDefault()
    $('.invalid-feedback').html('')
    $.post({
      url: '/carrier/incomingcarrier/create/',
      data: $('#form_create_carrier').serialize(),
      success: function(data) {
        document.location.reload()
      },
      error: function(xhr) {
        try {
          var data = xhr.responseJSON.errors
          console.log(data, 'data')
          if(data.name) {
            $('.name-field').find('.invalid-feedback').html(data.name)
          }
          if(data.ip_set) {
            $('.ip-field').find('.invalid-feedback').html(data.ip_set)
          }
          if(data.misc) {
            $('.error-container')
              .removeClass('hidden')
              .find('.error-body')
              .html(data.misc)
          }
          console.log(arguments, 'error')
        } catch(e) {
          $('.error-container')
            .removeClass('hidden')
            .find('.error-body')
            .html('Something went wrong. Please try again.')
        }
      }
    })
  })

  $('#edit_carrier_button').on('click', function(e) {
    $('.error-container')
      .addClass('hidden')
    e.preventDefault()
    $.post({
      url: '/carrier/incomingcarrier/edit/' + id + '/',
      data: $('#form_create_carrier').serialize(),
      success: function(data) {
        document.location.reload()
      },
      error: function(xhr) {
        try {
          var data = xhr.responseJSON.errors
          console.log(data, 'data')
          if(data.name) {
            $('.name-field').find('.invalid-feedback').html(data.name)
          }
          if(data.ip_set) {
            $('.ip-field').find('.invalid-feedback').html(data.ip_set)
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

});
