var graph_color = {
  'fill_1' : '#2bb031',
  'stroke_1' : '#2bb031',
  'fill_2' : '#00a0db',
  'stroke_2' : '#00a0db',
}
function fetch_chart_voice() {
    $.ajax({
        type: "GET",
        url: "voice_chart/",
        cache: false,
        success: function(data){
          var graph_data = {};
          graph_data.labels = new Array();
          for(i=0;i<data.time_slabs.length;i++) {
            if(i%3==0)
                graph_data.labels.push(data.time_slabs[i])
            else
                graph_data.labels.push("")
          }
          graph_data.datasets = [
            {
                label: "Voice Incoming",
                fillColor: graph_color.fill_1,
                strokeColor: graph_color.stroke_1,
                highlightFill: graph_color.fill_1,
                highlightStroke: graph_color.stroke_1,
                data: data.voice_incoming,
                totalCount:data.total_voice_incoming
            },
            {
                label: "Voice Outgoing",
                fillColor: graph_color.fill_2,
                strokeColor: graph_color.stroke_2,
                highlightFill: graph_color.fill_2,
                highlightStroke: graph_color.stroke_2,
                data: data.voice_outgoing,
                totalCount: data.total_voice_outgoing
            }
          ];
          var options = getOptions();
          var legendHtml = getLegend(graph_data);
          var voice_chart = new Chart(document.getElementById("voice-container").getContext("2d")).Bar(graph_data, options);
          $("#voice-container-legend").html(legendHtml);
        }
    });
}

function fetch_chart_sms() {
    $.ajax({
        type: "GET",
        url: "message_chart/",
        cache: false,
        success: function(data){
          var graph_data = {};
          graph_data.labels = new Array();
          for(i=0;i<data.time_slabs.length;i++) {
            if(i%3==0)
                graph_data.labels.push(data.time_slabs[i])
            else
                graph_data.labels.push("")
          }
          graph_data.datasets = [
            {
                label: "SMS Incoming",
                fillColor: "#2bb031",
                strokeColor: "#2bb031",
                highlightFill: "#2bb031",
                highlightStroke: "#2bb031",
                data: data.sms_incoming,
                totalCount: data.total_sms_incoming
            },
            {
                label: "SMS Outgoing",
                fillColor: "#00a0db",
                strokeColor: "#00a0db",
                highlightFill: "#00a0db",
                highlightStroke: "#00a0db",
                data: data.sms_outgoing,
                totalCount: data.total_sms_outgoing
            }
          ];
          var options = getOptions();
          var legendHtml = getLegend(graph_data);
          var sms_chart = new Chart(document.getElementById("sms-container").getContext("2d")).Bar(graph_data, options);
          $("#sms-container-legend").html(legendHtml);
        }
    });
}


function getLegend(graph_data) {
  var legendHtml = '';
  for (var i=0; i<graph_data.datasets.length; i++) {
    legendHtml += '<div class="legend-items">'
    legendHtml += '<span class="legend-marker" style="background:'+graph_data.datasets[i].strokeColor+';"></span>'
    legendHtml += '<span class="legend-name text-uppercase"> '+graph_data.datasets[i].label+' ('+graph_data.datasets[i].totalCount+') </span>'
    legendHtml += '</div>'
  }
  return legendHtml;
}

function getOptions() {
  return {
    scaleLineWidth: 2,
    scaleFontSize: 11,
    scaleShowGridLines : false,
    responsive : true,
    maintainAspectRatio : false
  };
}
