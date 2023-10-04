import { Injectable } from '@nestjs/common';





@Injectable()
export class AppService {
  welcome(token: string) {
    if (token) {
      const redirect: string = process.env.API_URL+ "/swagger";
      return `<!DOCTYPE html>
      <html>
      <head>
          <title>Welcome</title>
      </head>
      <body>
          <div>Hello, you've reached API default page, append <strong>/swagger</strong> for API documentation</div>
          <br/>
          <span>Your token here</span>
          <input type="text" value="${token}" id="myInput" readonly>
          <button onclick="myFunction()">Copy to clipboard</button>

          <script>
              function myFunction() {
                  /* Obtén el elemento de entrada de texto */
                  var copyText = document.getElementById("myInput");

                  /* Selecciona el texto del campo de entrada de texto */
                  copyText.select();
                  copyText.setSelectionRange(0, 99999); /* Para dispositivos móviles */

                  /* Copia el texto al portapapeles */
                  document.execCommand("copy");

                  /* Alerta al usuario que el texto ha sido copiado */
                  alert("Your token has been copied to clipboard: " + copyText.value.substring(0,10) + "... Redirecting to /swagger");
                  window.location.replace("${redirect}");
              }
          </script>
      </body>
      </html>`;
    }
    return "Hello, you've reached API default page, append <strong>/swagger</strong> for API documentation";
  }
}
