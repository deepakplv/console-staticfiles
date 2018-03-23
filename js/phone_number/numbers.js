var search_params = {};

$('input').on("keypress", function(e) {
    /* ENTER PRESSED*/
    if (e.keyCode == 13) {
        $("#number-search").trigger("click");
    }
});

$('#select-pattern-type').change(function() {
    hideCountryIndicator();
    if (this.value == "location")
        $("#pattern-value").attr("placeholder", "City and State.");
    if (this.value == "number")
        showCountryIndicator();
    if (this.value == "rate_center")
        $("#pattern-value").attr("placeholder", "Enter a Rate Center.");
    if (this.value == "lata")
        $("#pattern-value").attr("placeholder", "Enter a LATA code.");
    $("#prependedDropdownButton").val("");
});


function showCountryIndicator(){
  $("#pattern-value").attr("placeholder", "Enter a prefix or a number.");
  $("#pattern-value").addClass('pl-5');
  var valInternationalCode = $('#country option:selected').data('num-code')
  $(".country-indicator").html(valInternationalCode).removeClass('d-none');
}

function hideCountryIndicator(){
  $("#pattern-value").removeClass('pl-5');
  $(".country-indicator").addClass('d-none');
}

function rateUtil(val, fixedTo) {
	if (val == null || val == 'N/A') {
		return 'N/A';
	} else if (val == 0) {
		return 'FREE';
	} else {
		return '$ ' + parseFloat(val).toFixed(fixedTo);
	}
}
function cleanPhoneNumber(number) {
	number = cleanPhone(number);
	if (number.indexOf('+') == 0) {
			number = number.split('+');
			number = number[1];
	}
	return number
}
function toTitleCase(str) {
	if (typeof str === 'string' || str instanceof String) {
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
	else {
			return str
	}

}
function make_search_request(search_params) {

  var _loading_results = _.template($('#_loading_results').html());
  $(".number-search-results").html(_loading_results());
	$.getJSON(
		"/phone-numbers/search/",
		search_params,
		function(data) {
		}).error(function(xhr, status, error) {
      var _query_error = _.template($('#_query_error').html());
			var error = jQuery.parseJSON(xhr.responseText) || {};
      console.log(error.error);
      var error = ''
      if (error.error == 'Country ISO should be two characters. Ex: US')
        error = 'Please select a valid country';
      var show_error = error == ''? 'd-none':'';
      $(".number-search-results").html(_query_error({'error_message':error,'show':show_error}));
			// set error message
		}).success(function(data) {
      if (data["meta"]["total_count"] > 0) {
					// process the results
					var result_rows = "";
					var result_row_template = _.template(
						$('#_number_result_row_template').html()
					);
					$.each(data["objects"], function(key, val) {
							var restriction = val['restriction'];
							var true_sms_rate = 'N/A'
							var true_voice_rate = 'N/A'
							if (val['sms_enabled'] == true) {
									true_sms_rate = val['sms_rate']
									var sms_rate = rateUtil(val['sms_rate'],4)
							} else {
									var sms_rate = 'N/A'
							}

							if (val['voice_enabled'] == true) {
									true_voice_rate = val['voice_rate']
									var voice_rate = rateUtil(val['voice_rate'],4)
							} else {
									var voice_rate = 'N/A'
							}
							var number_type = val['type']
							var monthly_rental_rate =  rateUtil(val['monthly_rental_rate'],2)
							var setup_rate =  rateUtil(val['setup_rate'],2)
							var formatted_number = formatInternational(search_params['country_iso'], '+' + val['number']);
							result_rows += result_row_template({
									'number': formatted_number,
									'region': toTitleCase(val['region']),
									'voice_rate': voice_rate,
									'sms_rate': sms_rate,
									'monthly_fee': monthly_rental_rate,
									'setup_fee': setup_rate,
									'number_type': number_type,
									'number_result_action': 'number="' + val['number'] + '" rental="' + val['monthly_rental_rate'] + '" voice_rate="' + true_voice_rate + '" sms_rate="' + true_sms_rate + '" formatted_number="' + formatted_number +'" region="' + toTitleCase(val['region']) + '" country_iso="' + search_params['country_iso'] + '" restriction="' + restriction + '" number_type="' + toTitleCase(val['type']) + '"',
									'clean_number': cleanPhoneNumber(val['number'])
							})
					});
					// <button class="btn btn-success buy-btn" number="' + val['number'] + '" rental="' + val['monthly_rental_rate'] + '" voice_rate="' + true_voice_rate + '" sms_rate="' + true_sms_rate + '" formatted_number="' + formatted_number +'" region="' + toTitleCase(val['region']) + '" country_iso="' + search_params['country_iso'] + '" restriction="' + restriction + '" number_type="' + toTitleCase(val['type']) + '">Buy</button>
					var results_template = _.template($('#_number_result_template').html());
          var totalPages =  Math.ceil(data['meta']['total_count']/data['meta']['limit']);
					var results = results_template({
							'results': result_rows,
              'results_length': data["meta"]["total_count"],
              'perPage' : data['meta']['limit'],
              'tatalPages' : totalPages,
              'nextPage' : data['meta']['next'],
              'prevPage' : data['meta']['previous'],
              'currentPage' : (data['meta']['offset']/data['meta']['limit']) + 1
					});
					$(".number-search-results").html(results);
          $('[data-render]').paginate();
			} else {
          var no_results = _.template($('#_no_results_message').html());
          $(".number-search-results").html(
            no_results()
          );
			}
			var features = 'voice';
			if(search_params.voice_enabled && search_params.sms_enabled) {
				features = 'both';
			} else if(search_params.sms_enabled) {
				features = 'sms';
			}
			var filter = '', searchText = '';
			if(search_params.region) {
				filter = 'Region';
				searchText = search_params.region;
			} else if(search_params.rate_center) {
				filter = 'Rate Center';
				searchText = search_params.rate_center;
			} else if(search_params.lata) {
				filter = 'Lata';
				searchText = search_params.lata;
			} else {
				filter = 'Number';
				searchText = search_params.number;
			}
	});
}

function showFilters() {
	$("#toggler-filters-container").html("HIDE FILTERS");
	$(".filters-container").data('toggle-hidden', false).removeClass('d-none');
}

function hideFilters() {
	$("#toggler-filters-container").html("SHOW FILTERS");
	$(".filters-container").data('toggle-hidden', true).addClass('d-none');
}

$("#toggler-filters-container").click(function() {
  if ($(".filters-container").data('toggle-hidden')) {
    showFilters()
  } else {
    hideFilters()
  }
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$('.number-search-results').on('click','.page-numbers',function(e){
  var getParam = $(this).attr('href');
  var newPage = getParameterByName('page',getParam);
  search_params['page'] = newPage;
  make_search_request(search_params);
  e.preventDefault();
});


$("#number-search").click(function() {
    search_params = {}
		search_params['page'] = 1
		search_params["country_iso"] = $('#country').val();
		var pattern_type = $('#select-pattern-type').val();
		var pattern_value = $('#pattern-value').val();
		if (pattern_type == "location") {
				// city, state
				search_params["region"] = pattern_value;
				// remove other params
				delete(search_params.number);
				delete(search_params.rate_center);
				delete(search_params.lata);
		} else if (pattern_type == "number") {
				// number pattern
				search_params["number"] = cleanPhoneNumber(pattern_value);
				// remove other params
				delete(search_params.region);
				delete(search_params.rate_center);
				delete(search_params.lata);
		} else if (pattern_type == "rate_center") {
				search_params["rate_center"] = pattern_value;
				// remove other params
				delete(search_params.number);
				delete(search_params.region);
				delete(search_params.lata);
		} else if (pattern_type == "lata") {
				search_params["lata"] = pattern_value;
				// remove other params
				delete(search_params.number);
				delete(search_params.rate_center);
				delete(search_params.region);
		}

		search_params["number_type"] = $('[name=number_type_radio]:checked').attr('checked', true).val();
		var number_features = []
    $('[name=number_feature_radio]:checked').each(function(e,f){
      number_features.push($(f).val())
    })
    console.log(number_features);
    if (number_features.indexOf('voice') != -1 || number_features.indexOf('sms') != -1) {
      search_params["voice_enabled"] = false;
      search_params["sms_enabled"] = false;
    }
    if (number_features.indexOf('voice') != -1) {
      search_params["voice_enabled"] = true;
    }
    if (number_features.indexOf('sms') != -1) {
      search_params["sms_enabled"] = true;
    }
    if (search_params["country_iso"].length == 2 ) {
      make_search_request(search_params);
    } else {
      var error = 'Please select a valid country';
      _query_error = _.template($('#_query_error').html());
      $(".number-search-results").html(_query_error({'error_message':error,'show':''}));
    }
		return false;
});

$(".number-search-results").on("click", ".buy-btn", function(e){
		e.preventDefault();
    var number = $(this).attr("formatted_number");
    var country_iso = $(this).attr("country_iso");
    var rental = rateUtil($(this).attr("rental"),2);
    var voice_rate = $(this).attr("voice_rate");
    var region = $(this).attr("region");
    var sms_rate = rateUtil($(this).attr("sms_rate"),4);
    var country_name = getCountryName(country_iso)
    var country_name_flag = country_name.replace(' ', '-');
    var number_type = $(this).attr("number_type");
    var restriction = $(this).attr("restriction");
    var results = {
        number: number,
        monthly_rent: rental,
        voice_rate: voice_rate,
        region: region,
        sms_rate: sms_rate,
        country_name_flag: country_name_flag,
        number_type: number_type,
        country_name: country_name,
        rental: rental,
        restriction: restriction
    }
    _modal_buy_content = _.template($('#_buy_modal_content').html());
    $("#modal-buy-number").html(_modal_buy_content(results));
    $('#modal-buy-number .conditional-terms').hide();
    $("#modal-buy-number #"+restriction+"-verification").show();
    $("#modal-buy-number-success").modal('hide');
    $("#modal-buy-number-failure").modal('hide');
    $("#modal-buy-number").modal('toggle');
    if (restriction === "terms-and-conditions") {
        $('#buy-number-modal .buy-number-now').addClass("disabled");
    }
});

$('#modal-buy-number').on("click", "#agree-terms-and-conditions", function(e) {
    if($(this).is(":checked")) {
        $('#buy-number-modal .buy-number-now').removeClass("disabled");
    }else {
        $('#buy-number-modal .buy-number-now').addClass("disabled");
    }
});

$('#modal-buy-number').on("click", ".buy-number-now", function(e) {
    var number = $(this).attr('data-number');
    number = cleanPhoneNumber(number);
    make_buy_request(number);
});

$('#modal-buy-number-success').on("click", ".setup-number", function(e) {
    e.preventDefault();
    var number = $(this).data("number");
    window.location.href = '/phone-numbers/' + number + '/';
});

$('#modal-buy-number-failure').on("click", ".upload-documents", function(e) {
    window.location.href = '/phone-numbers/verification/';
});

function make_buy_request(number) {
    var buy_number_data = { number: number}
    $.ajax("/number/buy/", {
        type: "POST",
        data: buy_number_data,
        statusCode: {
            201: function(response) {
                buy_response_parser(response);
            },
            204: function(response) {
                console.log('204');
            }
        },
        sucess: function() {
            console.log('Success');
        },
        error: function(response) {
            buy_error_parser(number, response);
        },
    });
}

function buy_response_parser(response) {
    console.log(response);
    var number_status = response["numbers"][0]['status'];
    var number = response["numbers"][0]["number"];
    var country_iso = search_params['country_iso'];
    var country_name = getCountryName(country_iso);
    formatted_number = formatInternational(country_iso, '+' + number);
    results = {
        formatted_number: formatted_number,
        number: number,
        address_needed: false,
        country_name: country_name
    }
    var _success_buy_modal_content = _.template($('#_success_buy_modal_content').html());
    results["message"] = "This Number has been added to your Account. As a next step, you may proceed to set up incoming call routing on this number."
    if (number_status == "pending") {
        results["message"] = "Please upload the required documents, you can skip this if you already have a verified address on file. You will shortly receive an email notifying you of the activation status of this number."
        results["address_needed"] = true
    }
    $(".success-message").html(_success_buy_modal_content(results));
    $(".modal").modal('hide');
    var closeText = 'Cancel';
    var proceedText = 'Setup Number';
    var proceedClass = 'setup-number';
    if (results["address_needed"]) {
      closeText = 'SKIP';
      proceedText = 'Upload Documents';
      proceedClass = 'upload-documents';
    }
    $("#modal-buy-number-success .modal-footer .close-button").html(closeText);
    $("#modal-buy-number-success .modal-footer .proceed-button").addClass(proceedClass);
    $("#modal-buy-number-success .modal-footer .proceed-button").html(proceedText);
    $("#modal-buy-number-success .modal-footer .proceed-button").data('number',number);
    $("#modal-buy-number-success").modal('show');
    var clean_number = cleanPhoneNumber(number);
    var boughtRow = $("tr#"+clean_number);
    var buyButton = boughtRow.find('.buy-btn').first();
    boughtRow.remove();
}

function buy_error_parser(number, response) {
    console.log(response);
    var country_iso = search_params['country_iso'];
    var country_name = getCountryName(country_iso);
    formatted_number = formatInternational(country_iso, '+' + number);
    results = {
        formatted_number: formatted_number,
        number: number,
        country_name: getCountryName(country_iso)
    }
    var response_text = JSON.parse(response["responseText"]);
    results["message"] = response_text["error"];
    var _failure_buy_modal_content = _.template($('#_failure_buy_modal_content').html());
    $(".failure-message").html(_failure_buy_modal_content(results));
    $(".modal").modal('hide');
    $("#modal-buy-number-failure").modal('show');
    var clean_number = cleanPhoneNumber(number);
    $("tr#"+clean_number).remove();
}

var isoCountries = {
    'AF' : 'Afghanistan',
    'AX' : 'Aland Islands',
    'AL' : 'Albania',
    'DZ' : 'Algeria',
    'AS' : 'American Samoa',
    'AD' : 'Andorra',
    'AO' : 'Angola',
    'AI' : 'Anguilla',
    'AQ' : 'Antarctica',
    'AG' : 'Antigua And Barbuda',
    'AR' : 'Argentina',
    'AM' : 'Armenia',
    'AW' : 'Aruba',
    'AU' : 'Australia',
    'AT' : 'Austria',
    'AZ' : 'Azerbaijan',
    'BS' : 'Bahamas',
    'BH' : 'Bahrain',
    'BD' : 'Bangladesh',
    'BB' : 'Barbados',
    'BY' : 'Belarus',
    'BE' : 'Belgium',
    'BZ' : 'Belize',
    'BJ' : 'Benin',
    'BM' : 'Bermuda',
    'BT' : 'Bhutan',
    'BO' : 'Bolivia',
    'BA' : 'Bosnia And Herzegovina',
    'BW' : 'Botswana',
    'BV' : 'Bouvet Island',
    'BR' : 'Brazil',
    'IO' : 'British Indian Ocean Territory',
    'BN' : 'Brunei Darussalam',
    'BG' : 'Bulgaria',
    'BF' : 'Burkina Faso',
    'BI' : 'Burundi',
    'KH' : 'Cambodia',
    'CM' : 'Cameroon',
    'CA' : 'Canada',
    'CV' : 'Cape Verde',
    'KY' : 'Cayman Islands',
    'CF' : 'Central African Republic',
    'TD' : 'Chad',
    'CL' : 'Chile',
    'CN' : 'China',
    'CX' : 'Christmas Island',
    'CC' : 'Cocos (Keeling) Islands',
    'CO' : 'Colombia',
    'KM' : 'Comoros',
    'CG' : 'Congo',
    'CD' : 'Congo, Democratic Republic',
    'CK' : 'Cook Islands',
    'CR' : 'Costa Rica',
    'CI' : 'Cote D\'Ivoire',
    'HR' : 'Croatia',
    'CU' : 'Cuba',
    'CY' : 'Cyprus',
    'CZ' : 'Czech Republic',
    'DK' : 'Denmark',
    'DJ' : 'Djibouti',
    'DM' : 'Dominica',
    'DO' : 'Dominican Republic',
    'EC' : 'Ecuador',
    'EG' : 'Egypt',
    'SV' : 'El Salvador',
    'GQ' : 'Equatorial Guinea',
    'ER' : 'Eritrea',
    'EE' : 'Estonia',
    'ET' : 'Ethiopia',
    'FK' : 'Falkland Islands (Malvinas)',
    'FO' : 'Faroe Islands',
    'FJ' : 'Fiji',
    'FI' : 'Finland',
    'FR' : 'France',
    'GF' : 'French Guiana',
    'PF' : 'French Polynesia',
    'TF' : 'French Southern Territories',
    'GA' : 'Gabon',
    'GM' : 'Gambia',
    'GE' : 'Georgia',
    'DE' : 'Germany',
    'GH' : 'Ghana',
    'GI' : 'Gibraltar',
    'GR' : 'Greece',
    'GL' : 'Greenland',
    'GD' : 'Grenada',
    'GP' : 'Guadeloupe',
    'GU' : 'Guam',
    'GT' : 'Guatemala',
    'GG' : 'Guernsey',
    'GN' : 'Guinea',
    'GW' : 'Guinea-Bissau',
    'GY' : 'Guyana',
    'HT' : 'Haiti',
    'HM' : 'Heard Island & Mcdonald Islands',
    'VA' : 'Holy See (Vatican City State)',
    'HN' : 'Honduras',
    'HK' : 'Hong Kong',
    'HU' : 'Hungary',
    'IS' : 'Iceland',
    'IN' : 'India',
    'ID' : 'Indonesia',
    'IR' : 'Iran, Islamic Republic Of',
    'IQ' : 'Iraq',
    'IE' : 'Ireland',
    'IM' : 'Isle Of Man',
    'IL' : 'Israel',
    'IT' : 'Italy',
    'JM' : 'Jamaica',
    'JP' : 'Japan',
    'JE' : 'Jersey',
    'JO' : 'Jordan',
    'KZ' : 'Kazakhstan',
    'KE' : 'Kenya',
    'KI' : 'Kiribati',
    'KR' : 'Korea',
    'KW' : 'Kuwait',
    'KG' : 'Kyrgyzstan',
    'LA' : 'Lao People\'s Democratic Republic',
    'LV' : 'Latvia',
    'LB' : 'Lebanon',
    'LS' : 'Lesotho',
    'LR' : 'Liberia',
    'LY' : 'Libyan Arab Jamahiriya',
    'LI' : 'Liechtenstein',
    'LT' : 'Lithuania',
    'LU' : 'Luxembourg',
    'MO' : 'Macao',
    'MK' : 'Macedonia',
    'MG' : 'Madagascar',
    'MW' : 'Malawi',
    'MY' : 'Malaysia',
    'MV' : 'Maldives',
    'ML' : 'Mali',
    'MT' : 'Malta',
    'MH' : 'Marshall Islands',
    'MQ' : 'Martinique',
    'MR' : 'Mauritania',
    'MU' : 'Mauritius',
    'YT' : 'Mayotte',
    'MX' : 'Mexico',
    'FM' : 'Micronesia, Federated States Of',
    'MD' : 'Moldova',
    'MC' : 'Monaco',
    'MN' : 'Mongolia',
    'ME' : 'Montenegro',
    'MS' : 'Montserrat',
    'MA' : 'Morocco',
    'MZ' : 'Mozambique',
    'MM' : 'Myanmar',
    'NA' : 'Namibia',
    'NR' : 'Nauru',
    'NP' : 'Nepal',
    'NL' : 'Netherlands',
    'AN' : 'Netherlands Antilles',
    'NC' : 'New Caledonia',
    'NZ' : 'New Zealand',
    'NI' : 'Nicaragua',
    'NE' : 'Niger',
    'NG' : 'Nigeria',
    'NU' : 'Niue',
    'NF' : 'Norfolk Island',
    'MP' : 'Northern Mariana Islands',
    'NO' : 'Norway',
    'OM' : 'Oman',
    'PK' : 'Pakistan',
    'PW' : 'Palau',
    'PS' : 'Palestinian Territory, Occupied',
    'PA' : 'Panama',
    'PG' : 'Papua New Guinea',
    'PY' : 'Paraguay',
    'PE' : 'Peru',
    'PH' : 'Philippines',
    'PN' : 'Pitcairn',
    'PL' : 'Poland',
    'PT' : 'Portugal',
    'PR' : 'Puerto Rico',
    'QA' : 'Qatar',
    'RE' : 'Reunion',
    'RO' : 'Romania',
    'RU' : 'Russian Federation',
    'RW' : 'Rwanda',
    'BL' : 'Saint Barthelemy',
    'SH' : 'Saint Helena',
    'KN' : 'Saint Kitts And Nevis',
    'LC' : 'Saint Lucia',
    'MF' : 'Saint Martin',
    'PM' : 'Saint Pierre And Miquelon',
    'VC' : 'Saint Vincent And Grenadines',
    'WS' : 'Samoa',
    'SM' : 'San Marino',
    'ST' : 'Sao Tome And Principe',
    'SA' : 'Saudi Arabia',
    'SN' : 'Senegal',
    'RS' : 'Serbia',
    'SC' : 'Seychelles',
    'SL' : 'Sierra Leone',
    'SG' : 'Singapore',
    'SK' : 'Slovakia',
    'SI' : 'Slovenia',
    'SB' : 'Solomon Islands',
    'SO' : 'Somalia',
    'ZA' : 'South Africa',
    'GS' : 'South Georgia And Sandwich Isl.',
    'ES' : 'Spain',
    'LK' : 'Sri Lanka',
    'SD' : 'Sudan',
    'SR' : 'Suriname',
    'SJ' : 'Svalbard And Jan Mayen',
    'SZ' : 'Swaziland',
    'SE' : 'Sweden',
    'CH' : 'Switzerland',
    'SY' : 'Syrian Arab Republic',
    'TW' : 'Taiwan',
    'TJ' : 'Tajikistan',
    'TZ' : 'Tanzania',
    'TH' : 'Thailand',
    'TL' : 'Timor-Leste',
    'TG' : 'Togo',
    'TK' : 'Tokelau',
    'TO' : 'Tonga',
    'TT' : 'Trinidad And Tobago',
    'TN' : 'Tunisia',
    'TR' : 'Turkey',
    'TM' : 'Turkmenistan',
    'TC' : 'Turks And Caicos Islands',
    'TV' : 'Tuvalu',
    'UG' : 'Uganda',
    'UA' : 'Ukraine',
    'AE' : 'United Arab Emirates',
    'GB' : 'United Kingdom',
    'US' : 'United States',
    'UM' : 'United States Outlying Islands',
    'UY' : 'Uruguay',
    'UZ' : 'Uzbekistan',
    'VU' : 'Vanuatu',
    'VE' : 'Venezuela',
    'VN' : 'Viet Nam',
    'VG' : 'Virgin Islands, British',
    'VI' : 'Virgin Islands, U.S.',
    'WF' : 'Wallis And Futuna',
    'EH' : 'Western Sahara',
    'YE' : 'Yemen',
    'ZM' : 'Zambia',
    'ZW' : 'Zimbabwe'
};

function getCountryName (countryCode) {
    if (isoCountries.hasOwnProperty(countryCode)) {
        return isoCountries[countryCode];
    } else {
        return countryCode;
    }
}


$("#country").change(function() {
    var country = this.value.toUpperCase();
    // Add rate center filter only for US
    if (country == "US") {
      if($("#select-pattern-type option[value=rate_center]").length == 0 ) {
        $("#select-pattern-type").append("<option class='text-uppercase' value='rate_center'>Rate Center</option>");
      }
      if($("#select-pattern-type option[value=lata]").length == 0 ) {
        $("#select-pattern-type").append("<option class='text-uppercase' value='lata'>LATA</option>");
      }
    } else {
        $("#select-pattern-type option[value=rate_center]").remove();
        $("#select-pattern-type option[value=lata]").remove();
    }
    if ($('#select-pattern-type').val() == 'number') {
      showCountryIndicator();
    }
});
$("#country").trigger('change')
showCountryIndicator();

$('.number-search-box').bind('reset', function() {
  showCountryIndicator();
  $(".country-indicator").html('+1');
});
