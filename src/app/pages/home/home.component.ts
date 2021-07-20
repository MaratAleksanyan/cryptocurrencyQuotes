import { Component, OnInit } from '@angular/core';
import { HttpconfigService } from '../../config/httpconfig.service';
import { MatTableDataSource } from '@angular/material/table';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	public coinsInfo = new MatTableDataSource<any[]>();
	private getConfigUrl: string = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=30';
	displayedColumns: string[] = ['name', 'symbol', 'slug', 'price', 'percent_change_1h', 'percent_change_24h', 'market_cap', 'last_updated'];


	constructor(private config: HttpconfigService) 
	{ 
		this.getDevicesInfo();
	}

	ngOnInit(): void {
	}

  // Getting info from server
	getDevicesInfo(){
		this.config.getConfig(this.getConfigUrl)
			.subscribe(response => {
				response ? this.coinsInfo.data = response.data.sort((a,b) => b.quote.USD.market_cap - a.quote.USD.market_cap) : this.coinsInfo.data = <any>[];
			});
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.coinsInfo.filter = filterValue.trim().toLowerCase();
	}

}
