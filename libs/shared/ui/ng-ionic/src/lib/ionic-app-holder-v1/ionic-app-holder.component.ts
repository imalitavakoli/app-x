import { Component, Input } from '@angular/core';

import { RouterModule } from '@angular/router';
import { IonApp, IonRouterOutlet, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'x-ionic-app-holder-v1',
  standalone: true,
  imports: [RouterModule, IonApp, IonRouterOutlet],
  templateUrl: './ionic-app-holder.component.html',
  styleUrl: './ionic-app-holder.component.scss',
})
export class V1IonicAppHolderComponent {}
