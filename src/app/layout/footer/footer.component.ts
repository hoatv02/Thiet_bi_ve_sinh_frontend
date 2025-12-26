import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TypeService } from '../../services/type.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{

  public year = 2025;
  public types: any[] =[];

  constructor(
    private typeService: TypeService,
  ) {
  }

  ngOnInit(): void {
    this.typeService.getTypesList().subscribe({
      next: (res) => {
        this.types = res || [];
        console.log(this.types)
      },
      error: (err) => {
        console.error('Lỗi load dữ liệu filter:', err);
      }
    });
  }

  
}
