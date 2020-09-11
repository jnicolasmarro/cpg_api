function solicitudContrasena() {
    let email = document.getElementById('email');

    if (email.value.length == 0) {
        document.getElementById("titulo_modal").innerHTML = "Error";
        let html = '<div class="alert alert-danger">' + 'No ha ingresado el correo' + '</div>';
        $('#respuesta_modal').html(html);
        $('#resultado_modal').modal('show');
    } else {
        let url = `http://192.168.1.100:3000/api/auth/remember/${email.value}`;
        fetch(url, {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            if (response.success) {
                document.getElementById("titulo_modal").innerHTML = "Finalizado";
                let html = '<div class="alert alert-success">' + response.success + '</div>';
                $('#respuesta_modal').html(html);
                $('#resultado_modal').modal('show');
            }
            if (response.error) {
                document.getElementById("titulo_modal").innerHTML = "Finalizado";
                let html = '<div class="alert alert-danger">' + response.error + '</div>';
                $('#respuesta_modal').html(html);
                $('#resultado_modal').modal('show');
            }
        });
    }
}