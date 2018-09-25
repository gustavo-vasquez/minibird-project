﻿$(document).ready(function () {
    //console.log($('#NewPostForm'));
    //var form = $('#NewReplyForm').removeData("validator").removeData("unobtrusiveValidation");  /* added by the jquery unobtrusive plugin*/
    $.validator.unobtrusive.parse($('#NewPostForm, #NewReplyForm'));
    //$(form).data('unobtrusiveValidation')
    $('#Comment').magicsize();
    $('body').on('click', '#newLinkBtn', addLinkToPost);
    $('body').on('keydown', '#Comment', calculateChars);
    eventsforUploadImages();    

    //$.validator.addMethod('miau', function (value, element, params) {
    //    return value.length == params.ancho;
    //});

    //$.validator.unobtrusive.adapters.add(
    //    'startswithprotocol', ['ancho'], function (options) {
    //        var params = {
    //            ancho: options.params.ancho
    //        };
    //        options.rules['miau'] = params;
    //        options.messages['miau'] = "errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr";
    //    });
});

function addLinkToPost() {
    if ($('#linkGroup').length <= 0) {
        $('#NewPostForm .modal-body, #NewReplyForm .modal-body').append('<div id="linkGroup" class="input-group"><div class="input-group-prepend"><span class="input-group-text"><i class="fas fa-link"></i></span></div><input type="text" class="form-control" id="linkText" placeholder="Ingresa una dirección web"><div class="input-group-append"><button id="addLinkBtn" class="btn btn-outline-primary btn-primary" type="button" title="Añadir"><i class="fas fa-plus"></i></button></div></div>');
        $('#linkText').focus();

        $('#addLinkBtn').on('click', function () {
            $Comment = $('#Comment');
            $LinkToAdd = $('#linkText').val();

            if ($LinkToAdd.startsWith("http://") || $LinkToAdd.startsWith("https://")) {
                //if ($Comment.val().length > 0)
                //    $Comment.val($Comment.val() + ' ' + $LinkToAdd);
                //else
                //    $Comment.val($Comment.val() + $LinkToAdd);                
                $Comment.val($Comment.val() + $LinkToAdd);
                $('#linkGroup').remove();
                $Comment.focus();
                calculateChars();
            }
        });
    }
}

function calculateChars() {
    var label = $('.available-chars');    
    label.text(280 - $('#Comment').val().length);

    if (label.text() < 0)
        label.addClass('text-danger');
    else
        label.removeClass('text-danger');
}

function eventsforUploadImages() {
    $('#newImageBtn').on('click', function () {
        $('#UploadImage').trigger('click');
    });

    //Check File API support
    if (window.File && window.FileList && window.FileReader) {        
        var filesInput = document.getElementById("UploadImage");
        var fi = $('#UploadImage');

        var $imgThumbnailsRow = $('#imgThumbnailsRow');

        filesInput.addEventListener("change", function (event) {            
            var files = event.target.files; //FileList object
            var output = document.getElementById("imgThumbnailsRow");

            if ($('input[name=ImagesUploaded]').length > 3 || files.length > 4) {
                if($('.max-length-msg').length <= 0)
                    $('.modal-body').append('<div class="form-group text-center"><small class="text-danger max-length-msg">Máximo 4 imágenes</small></div>');
                return false;
            }

            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                //Only pics
                if (!file.type.match('image'))
                    continue;

                var picReader = new FileReader();
                picReader.fileName = file.name;

                picReader.addEventListener("load", function (event) {                    
                    var picFile = event.target;

                    var div = document.createElement("div");
                    div.classList.add("col");
                    div.classList.add("col-md-3");
                    var figure = document.createElement("figure");

                    figure.innerHTML = "<input type='hidden' name='ImagesUploaded' value='" + picFile.result + "' /><img class='img-upload-newPost' src='" + picFile.result + "'" +
                            "title='" + picFile.fileName + "'/><button class='img-remove-newPost' type='button' title='Eliminar'>&times;</button>";

                    div.insertBefore(figure, null);
                    output.insertBefore(div, null);

                    $('.img-remove-newPost').on('click', function () {
                        $(this).parent("figure").parent("div").remove();

                        if ($imgThumbnailsRow.is(':empty'))
                            $imgThumbnailsRow.parent("div").addClass('d-none');                        
                    });
                });

                //Read the image
                picReader.readAsDataURL(file);
            }

            if ($imgThumbnailsRow.parent("div").hasClass('d-none')) {
                $imgThumbnailsRow.parent("div").removeClass('d-none');
            }
        });
    }
    else {
        console.log("Tu navegador no soporta File API");
    }
}

(function ($) {
    $.fn.magicsize = function () {
        this.filter('textarea').each(function () {

            var observe;
            if (window.attachEvent) {
                observe = function (element, event, handler) {
                    element.attachEvent('on' + event, handler);
                };
            }
            else {
                observe = function (element, event, handler) {
                    element.addEventListener(event, handler, false);
                };
            }

            var text = document.getElementById('Comment');
            function resize() {
                text.style.height = 'auto';
                if (text.scrollHeight > 0)
                    text.style.height = (text.scrollHeight + 2) + 'px';
            }
            /* 0-timeout to get the already changed text */
            function delayedResize() {
                window.setTimeout(resize, 0);
            }
            observe(text, 'change', resize);
            observe(text, 'cut', delayedResize);
            observe(text, 'paste', delayedResize);
            observe(text, 'drop', delayedResize);
            observe(text, 'keydown', delayedResize);

            text.focus();
            //text.select();
            resize();
        });
    }
}(jQuery));