import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { PokemonList } from 'src/app/interfaces/pokemon';
import { PokeapiService } from 'src/app/services/pokeapi.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  public pokemons: PokemonList = {} as PokemonList;
  public loading: boolean = true;
  private unsubscribe$ = new Subject<void>();
  @ViewChild('dt') dt: Table = {} as Table;

  constructor(
    private pokeapiService: PokeapiService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.getPokemons();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  private getPokemons(): void {
    this.pokeapiService.getPokemonsList(1281, 0)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (pokemons) => {

          pokemons.results.forEach(p => {
            const partesDaUrl = p.url.split('/');
            const numero = partesDaUrl[partesDaUrl.length - 2];
            p.id = numero;

            p.name = p.name.replace(/-/g, ' ');
          });
          this.pokemons = pokemons;

          this.loading = false;
        },
        error: (error) => { console.error(error) }
      })
  }

  public onSee(id: string): void {
    this.router.navigateByUrl(`pokemon/${id}`);
  }

  public clear(table: Table) {
    table.clear();
  }

  public search(event: any): void {
    this.dt.filterGlobal(event.target.value, 'contains');
  }
}
