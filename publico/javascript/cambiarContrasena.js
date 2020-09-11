function cambioContrasena() {
    let email = document.getElementById('email');
    let password1 = document.getElementById('password1');
    let password2 = document.getElementById('password2');
    if (password1.value != password2.value) {
        document.getElementById("titulo_modal").innerHTML = "Error";
        let html = '<div class="alert alert-danger">' + 'Las contraseñas ingresadas no son iguales' + '</div>';
        $('#respuesta_modal').html(html);
        $('#resultado_modal').modal('show');
    } else {
        if (password1.value.length < 8) {
            document.getElementById("titulo_modal").innerHTML = "Error";
            let html = '<div class="alert alert-danger">' + 'La contraseña debe de contener mínimo 8 caracteres' + '</div>';
            $('#respuesta_modal').html(html);
            $('#resultado_modal').modal('show');
        } else {
            let url = 'http://192.168.1.100:3000/api/auth/cambio_contrasena/';
            let data = {
                email: email.value,
                password: password1.value
            };
            fetch(url, {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(data), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => {
                    if (response.success) {
                        document.getElementById("titulo_modal").innerHTML = "Finalizado";
                        let html = '<div class="alert alert-success">' + 'La contraseña se ha actualizado' + '</div>';
                        $('#respuesta_modal').html(html);
                        $('#resultado_modal').modal('show');
                    }
                });
        }

    }




}