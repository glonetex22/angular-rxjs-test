import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { concatMap, filter, map, tap } from 'rxjs/operators';
import { LoadingSpinnerOverlayService } from '../services/loading-spinner-overlay.service';

@Injectable({
  providedIn: 'root'
})
export class CustomRouteDataResolver2 implements Resolve<string> {
  completionNotifier$ = new BehaviorSubject<boolean>(true);
  constructor(
    private loadingSpinner: LoadingSpinnerOverlayService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<string> {
    return of([route.params, route.queryParams])
      .pipe(
        tap(() => this.loadingSpinner.show()
        ),
        concatMap(([{ id }, { j }]) => forkJoin([
          of(this.completionNotifier$.getValue())
            .pipe(filter(v => v === true)),
          of(`${id}-${j}`)
        ])),
        tap(() => {
          setTimeout(() => { this.loadingSpinner.hide() }, 2000)
          }),
        map(([a, x]) => x)
      );
  }
}
