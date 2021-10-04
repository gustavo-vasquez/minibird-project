$(document).ready(function () {
    $('#profileScreen-nav a').hover(function () {
        $(this).not('.selected').toggleClass('active');
    });

    var $profileScreenNav = $('#profileScreen-nav');
    switch ($profileScreenNav.data('tab')) {
        case "following": $profileScreenNav.children('li:nth-child(2)').children('a').addClass('active selected');
            break;
        case "followers": $profileScreenNav.children('li:nth-child(3)').children('a').addClass('active selected');
            break;
        case "likes": $profileScreenNav.children('li:nth-child(4)').children('a').addClass('active selected');
            break;
        case "lists": $profileScreenNav.children('li:last').children('a').addClass('active selected');
            break;
        default: $profileScreenNav.children('li:first').children('a').addClass('active selected');
            break;
    }    

    document.getElementById("headerFile").onchange = function () {
        var data = new FormData();
        var files = $("#headerFile").get(0).files;
        if (files.length > 0) {
            data.append("ImageFile", files[0]);

            $.ajax({
                url: "/Account/ChangeHeader",
                type: "POST",
                processData: false,
                contentType: false,
                data: data,
                success: function (response) {
                    //code after success
                    $('.profile_screen-header').attr('src', response);
                },
                error: function (response) {
                    console.log("Ocurrió un error.");
                }
            });
        }
    };

    document.getElementById("avatarFile").onchange = function () {
        var data = new FormData();
        var files = $("#avatarFile").get(0).files;
        if (files.length > 0) {
            data.append("ImageFile", files[0]);

            $.ajax({
                url: "/Account/ChangeAvatar",
                type: "POST",
                processData: false,
                contentType: false,
                data: data,
                success: function (response) {
                    //code after success
                    $('.profile_screen-avatar').attr('src', response);
                },
                error: function (response) {
                    console.log("Ocurrió un error.");
                }
            });
        }
    };

    $('#editDetails').on('click', function () {
        $.ajax({
            url: "/Account/EditDetailsForm",
            method: "GET",
            success: function (partialView) {
                $('#profileDetails').children().hide();
                $('#profileDetails').append(partialView);
                $.validator.unobtrusive.parse($('#editDetailsForm'));                                
            },
            error: function (response) {
                console.log("Ocurrió un error.");
            }
        });
    });    

    // Valida que el valor tenga como inicio el protocolo http o https
    $.validator.addMethod('startswithprotocol', function (value, element, params) {
        return value.startsWith("http://") || value.startsWith("https://");
    });

    $.validator.unobtrusive.adapters.add(
        'startswithprotocol', {}, function (options) {
            options.rules['startswithprotocol'] = true;
            options.messages['startswithprotocol'] = options.message;
        });

    // Valida que el valor cumpla el rango de fechas
    $.validator.addMethod('rangebirthyear', function (value, element, params) {        
        return parseInt(value) >= params.minYear && parseInt(value) <= params.maxYear;
    });

    $.validator.unobtrusive.adapters.add(
        'rangebirthyear', ['minyear', 'maxyear'], function (options) {
            var params = {
                minYear: options.params.minyear,
                maxYear: options.params.maxyear
            };

            options.rules['rangebirthyear'] = params;
            options.messages['rangebirthyear'] = options.message;
        });


    // Valida que el valor cumpla el rango de meses
    $.validator.addMethod('rangebirthmonth', function (value, element, params) {
        return parseInt(value) >= params.minMonth && parseInt(value) <= params.maxMonth;
    });

    $.validator.unobtrusive.adapters.add(
        'rangebirthmonth', ['minmonth', 'maxmonth'], function (options) {
            var params = {
                minMonth: options.params.minmonth,
                maxMonth: options.params.maxmonth
            };

            options.rules['rangebirthmonth'] = params;
            options.messages['rangebirthmonth'] = options.message;
        });

    $('body').on('keyup', '#Day, #Month, #Year', isValidDate);

    $('.follow-btn').on('click', function () {
        var $this = $(this);

        $.ajax({
            url: "/Account/FollowUser",
            method: "GET",
            data: "follow=" + $this.data('follow'),
            success: function (data) {
                $this.text(data.buttonText);

                if ($this.hasClass('btn-success'))
                    $this.removeClass('btn-success');
                else
                    $this.removeClass('btn-danger');

                $this.addClass(data.className);
            },
            error: function () {
                alert("Hubo un fallo al intentar seguir/dejar de seguir usuario");
            }
        });
    });

    $('#manageUserInList').on('click', function () {
        var $this = $(this);
        var $arrow = $this.children('i');

        if ($this.data('isopen')) {
            $this.data('isopen', false);
            $this.removeClass('btn-info').addClass('btn-outline-info');
            $arrow.removeClass('fa-caret-down').addClass('fa-caret-up');
            $this.next().remove();
        }
        else {
            $this.data('isopen', true);
            $this.removeClass('btn-outline-info').addClass('btn-info');
            $arrow.removeClass('fa-caret-up').addClass('fa-caret-down');

            $.ajax({
                url: "/Account/CheckboxLists",
                method: "GET",
                data: "currentProfileID=" + $this.data('profileid'),
                success: function (data) {
                    $this.after(data);
                },
                error: function () {
                    alert("No se pudo desplegar la lista.");
                }
            });
        }        
    });
});



function changeDetails(data) {
    $('#personDescription span').text(data.personalDescription);
    $('#websiteUrl a').attr('href', data.websiteURL);
    $('#websiteUrl a').text(data.websiteURL);
    $('#birthday span').text(data.birthDate);
    $('#editDetailsForm').remove();
    $('#profileDetails').children().show();
}

function isValidDate() {
    var day = $('#Day').val();
    var month = $('#Month').val();
    var year = $('#Year').val();

    if (day == "" && month == "" && year == "") {
        $('#dateInvalid').addClass('d-none');
        $('#editDetailsForm button[type="submit"]').prop('disabled', false);
        return;
    }
    
    day = Number(day);
    month = Number(month) - 1; // month - 1 since the month index is 0-based (0 = January)
    year = Number(year);
    var minYear = new Date().getFullYear() - 100;
    var maxYear = new Date().getFullYear();

    if (year >= minYear && year <= maxYear) {
        var date = new Date();
        date.setFullYear(year, month, day);

        if ((date.getFullYear() == year) && (date.getMonth() == month) && (date.getDate() == day)) {
            $('#dateInvalid').addClass('d-none');
            $('#editDetailsForm button[type="submit"]').prop('disabled', false);
            return;
        }
    }

    $('#dateInvalid').removeClass('d-none');
    $('#editDetailsForm button[type="submit"]').prop('disabled', true);    
    return;
}