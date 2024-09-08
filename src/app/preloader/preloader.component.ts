import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../services/loading-service/loading.service';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.css']
})
export class PreloaderComponent implements OnInit {
  isLoading: boolean = false;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.loading$.subscribe((loading: boolean) => {
      this.isLoading = loading;
      console.log('Loading state:', loading);

    });
  }
}
