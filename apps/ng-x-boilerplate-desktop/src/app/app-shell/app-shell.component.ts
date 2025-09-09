import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'x-app-shell',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
})
export class AppShellComponent {}
