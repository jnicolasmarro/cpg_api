"use strict";

function solicitudContrasena() {
  var email = document.getElementById('email');

  if (email.value.length == 0) {
    document.getElementById("titulo_modal").innerHTML = "Error";
    var html = '<div class="alert alert-danger">' + 'No ha ingresado el correo' + '</div>';
    $('#respuesta_modal').html(html);
    $('#resultado_modal').modal('show');
  } else {
    var url = "http://192.168.1.100:3000/api/auth/remember/".concat(email.value);
    fetch(url, {
      method: 'GET',
      // or 'PUT'
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      return res.json();
    })["catch"](function (error) {
      return console.error('Error:', error);
    }).then(function (response) {
      if (response.success) {
        document.getElementById("titulo_modal").innerHTML = "Finalizado";

        var _html = '<div class="alert alert-success">' + response.success + '</div>';

        $('#respuesta_modal').html(_html);
        $('#resultado_modal').modal('show');
      }

      if (response.error) {
        document.getElementById("titulo_modal").innerHTML = "Finalizado";

        var _html2 = '<div class="alert alert-danger">' + response.error + '</div>';

        $('#respuesta_modal').html(_html2);
        $('#resultado_modal').modal('show');
      }
    });
  }
}