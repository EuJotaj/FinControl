import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  standalone: false
})
export class BillingComponent implements OnInit {

  private apiUrl = 'http://localhost:8080/api';

  plans = [
    {
      name: 'FREE',
      price: 'R$ 0,00',
      features: ['Acesso Básico', 'Até 2 membros'],
      active: true, // we can derive this from API
    },
    {
      name: 'PRO',
      price: 'R$ 49,90 / mês',
      features: ['Acesso Completo', 'Membros Ilimitados', 'Suporte Prioritário'],
      active: false,
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  subscribe(planName: string) {
    if (planName === 'FREE') return;
    
    // Call generic billing checkout
    this.http.post<{ initPoint: string }>(`${this.apiUrl}/billing/checkout`, { planType: planName })
      .subscribe({
        next: (res) => {
          if (res && res.initPoint) {
            window.location.href = res.initPoint; // Redirect to MP Checkout
          }
        },
        error: (err) => {
          console.error('Error initiating checkout', err);
          alert('Erro ao iniciar assinatura. Tente novamente.');
        }
      });
  }
}
