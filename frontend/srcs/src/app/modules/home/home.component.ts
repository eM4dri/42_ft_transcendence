import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor (private router:Router) {}


  public joinQueue(): void {
    // Aquí va a tener que ir la lógica de la cola.
    // Hasta que no haya otro usuario en cola se queda esperando a la respuesta
    // (Mostrar Loading por pantalla, cambiar el texto del botón a cancel)
    // Habria que poner la pantalla en loading + opcion de cancelar y salir de la cola
    // Cuando haya 2 jugadores en la cola y matcheen, redirigir al juego con el pong
    // Poner a cada uno en un lado aleatorio de la pantalla
    this.router.navigate(['/game']);
  }

}
