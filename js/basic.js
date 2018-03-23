$(document).ready(function(){
  $("#navbarSupportedContent select").change(function(e){
    var $this = this;
    window.location = $this.value
  })

  var $table = $('.table-wrapper table')

  $table.floatThead({
    scrollContainer: function($table){
      return $table.closest('.table-wrapper');
    }
  });

  $('.modal').on('hidden.bs.modal', function () {
      $this = $(this);
      if ($this.find('form').length > 0) {
        $this.find('form')[0].reset();
        $this.find('invalid-feedback').html('');
      }
      $this.find('.error-text').parent().addClass('d-none');
      $this.find('.error-info').parent().addClass('d-none');
  });

  (function($) {
    $.fn.paginate = function() {
      var queryString = document.location.search;
      if(queryString) {
        queryString = queryString.substr(1).split('&')
        var params = []
        $.each(queryString, function(i, param) {
          if(param.indexOf("page=") === -1) {
            params.push(param)
          }
        })
        queryString = params.join('&')
      }
      this.each(function() {
        var self = $(this)
        var pages = 10
        var pageCount = self.data('page-count')
        if (pageCount == 1 ) return;
        var hasNext =  self.data('next-page')
        var hasPrev =  self.data('previous-page')
        var currentPage =  self.data('current-page')
        var html = '<div class="navigation-row"><div class="navigation">'
        var nextHref = 'javascript:void(0)';
        var prevHref = 'javascript:void(0)';
        var nextClass = 'next';
        var prevClass = 'prev';
        if (pageCount == -1) {

          if(hasNext) {
            nextHref = hasNext + "&" + queryString;
          }else {
            nextClass = 'no-next';
          }
          if(hasPrev && currentPage != 1) {
            prevHref = hasPrev + "&" + queryString;
          }else {
            prevClass = 'no-prev';
          }
          html += "<a href='"+prevHref+"' class='"+prevClass+" page-numbers'>&lt; Previous</a>"
          html += "<a href='"+nextHref+"' class='"+nextClass+" page-numbers'>Next &gt;</a>"

        } else {
          var half = Math.ceil(pages/2)
          var start = ((currentPage - half) <= 0) ? 1 : (currentPage - half)
          var end = start + pages
          if(hasNext) {
            nextHref = hasNext + "&" + queryString
          }
          if(hasPrev) {
            prevHref = hasPrev + "&" + queryString
          }
          var firstHref = "?page=1&"+queryString
          var lastHref = "?page="+pageCount+"&"+queryString
          if (currentPage == 1) {
            prevClass = 'no-prev';
            firstHref = '#';
            prevHref = '#';
          } else if (currentPage == pageCount) {
            nextClass = 'no-next';
            nextHref = '#';
            lastHref = '#'
          }
          html += "<a href='"+firstHref+"' class='"+prevClass+" page-numbers'>&lt;&lt; First</a>"
          html += "<a href='"+prevHref+"' class='"+prevClass+" page-numbers'>&lt; Previous</a>"

          var active=''
          for(var i = start; i < end; i++) {
            if( i <= pageCount) {
              active = (i == currentPage) ? ' active ' : ''
              html += "<a href='?page="+i+"&"+queryString+"' class='next page-numbers "+active+"'>"+i+"</a>"
            }
          }

          html += "<a href='"+nextHref+"' class='"+nextClass+" page-numbers'>Next &gt;</a>"
          html += "<a href='"+lastHref+"' class='"+nextClass+" page-numbers'>Last &gt;&gt;</a>"
        }
        html += '</div></div>'
        self.html(html)
      });
    }
  }(jQuery));
  $('[data-render]').paginate()

  $('.sidebar-collapse-btn').on("click", function() {
    $('main').toggleClass('collapsed-sidebar');
    $(this).toggleClass('collapsed-active');
    $(this).find('.collapse-btn-icon').toggleClass('icon-collapse-left');
    $(this).find('.collapse-btn-icon').toggleClass('icon-expand-right');
  });
});

function formatDate(date) {
  if (date == undefined) {
    date = new Date();
  }
  var dd = date.getDate();
  var mm = date.getMonth()+1;
  mm = mm < 10 ? '0'+mm : mm;
  var yyyy = date.getFullYear();
  var dateStr = mm+'/'+dd+'/'+yyyy;
  return dateStr;
}
