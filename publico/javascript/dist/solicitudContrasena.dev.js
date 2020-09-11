"use strict";

function solicitudContrasena() {
  var email = document.getElementById('email');

  if (email.nodeValue.length == 0) {
    document.getElementById("titulo_modal").innerHTML = "Error";
    var html = '<div class="alert alert-danger">' + 'No ha ingresado el correo' + '</div>';
    $('#respuesta_modal').html(html);
    $('#resultado_modal').modal('show');
  }
}