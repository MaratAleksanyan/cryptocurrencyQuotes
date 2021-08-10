import { Component, OnInit } from '@angular/core';
import { HttpconfigService } from '../../config/httpconfig.service';
import { MatTableDataSource } from '@angular/material/table';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	public coinsInfo: any = new MatTableDataSource<any[]>();
	private getConfigUrl: string = '/web/v1/cryptocurrency/listings/latest?start=1&limit=30';
	public displayedColumns: string[] = ['name', 'symbol', 'slug', 'price', 'percent_change_1h', 'percent_change_24h', 'market_cap', 'last_updated'];

	constructor(private config: HttpconfigService) 
	{ 
		this.getDevicesInfo();
	}

	ngOnInit(): void
	{

	}

  // Getting info from server
	public getDevicesInfo(): void
	{
		this.config.getConfig(this.getConfigUrl)
			.subscribe(response => {
				response && response.data ? this.coinsInfo.data = response.data : this.coinsInfo.data = <any>[];
			});
	}

	// Filter table
	public applyFilter(event: Event): void
	{
		const filterValue = (event.target as HTMLInputElement).value;
		this.coinsInfo.filter = filterValue.trim().toLowerCase();
	}

	// Sorting table headers (the direction to sort (asc or desc)).
	public sortData(sort: MatSort): void
	{
		const data = this.coinsInfo.data.slice();
		if (!sort.active || sort.direction === '') {
			this.coinsInfo.data = data;
			return;
		}

		this.coinsInfo.data = data.sort((a, b) => {
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'name': return this.compare(a.name, b.name, isAsc);
				case 'symbol': return this.compare(a.symbol, b.symbol, isAsc);
				case 'slug': return this.compare(a.slug, b.slug, isAsc);
				case 'price': return this.compare(a.quote.USD.price, b.quote.USD.price, isAsc);
				case 'percent_change_1h': return this.compare(a.quote.USD.percent_change_1h, b.quote.USD.percent_change_1h, isAsc);
				case 'percent_change_24h': return this.compare(a.quote.USD.percent_change_24h, b.quote.USD.percent_change_24h, isAsc);
				case 'market_cap': return this.compare(a.quote.USD.market_cap, b.quote.USD.market_cap, isAsc);
				case 'last_updated': return this.compare(a.last_updated, b.last_updated, isAsc);
				default: return 0;
			}
		});
	}

	private compare(a: number | string, b: number | string, isAsc: boolean): number
	{
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	}

}
