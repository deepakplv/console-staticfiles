$.fn.ajaxChosen = function( options ) {
  var xhr;
  return this.each(function() {
    var $selectItem = $(this);
    var $container = $selectItem.parent();
    var selected = $selectItem.val();
    var defaultOptions = [];
    var valueAttribute = options.valueAttribute;
    var getParams = options.getParams || [];
    var searchType = options.searchType;
    var callbackHandler = options.callbackHandler
    $.each($selectItem.find("option"), function(index, option) {
      var $option = $(option);
      defaultOptions.push({ id: $option.attr('value'), name: $option.text() });
    });

    var searchText = "";
    var $this;
    $selectItem.chosen({max_selected_options: 5});

    $container.on("keyup", ".chosen-search input", function() {
      $this = $(this);
      searchText = $this.val();
      getData(searchText, $container, $selectItem, $this, selected, defaultOptions, valueAttribute, getParams, searchType, callbackHandler )
    });

    getData("", $container, $selectItem, $this, selected, defaultOptions, valueAttribute, getParams, searchType, callbackHandler )

  });

  function getData(searchText, $container, $selectItem, $this, selected, defaultOptions, valueAttribute, getParams, searchType, callbackHandler ) {
    var inUrlSearch = true;
    var getParamsString = ''
    var fullUrl = options.url;
    var totalGetParams = [];
    totalGetParams = totalGetParams.concat(getParams);
    if(typeof xhr !== "undefined") {
      xhr.abort();
    }
    $('.no-results', $container).html('Loading...');
    if (searchType != null && searchType != undefined && searchType.name != undefined && searchType.name != '' ) {
      inUrlSearch = false;
      if (searchText != '') {
        searchType.value = searchText;
        totalGetParams.push(searchType);
      }
    }
    if (totalGetParams != undefined) {
      getParamsString = jQuery.param(totalGetParams);
    }
    if (inUrlSearch) {
      fullUrl += searchText;
    }
    fullUrl += '?' + getParamsString;
    xhr = $.ajax({
      url: fullUrl,
      success: function(data) {
        $selectItem.html('');
        data = defaultOptions.concat(data);
        if (valueAttribute == undefined || valueAttribute == '') {
          valueAttribute = 'id';
        }
        $.each(data, function(index, row) {
          if(row[valueAttribute] == selected) {
            $selectItem.append($('<option />')
              .val(row[valueAttribute])
              .html(row.name)
              .attr("selected", "selected"));
          } else {
            $selectItem.append(
              $('<option />').val(row[valueAttribute])
              .html(row.name));
          }
        });
        $selectItem.trigger("chosen:updated");
        if (callbackHandler != undefined) {
          callbackHandler();
        }
        setTimeout(function() {
          if(typeof $this !== "undefined") {
            $this.val(searchText);
          }
        }, 1);
      }
    });
  }
}
