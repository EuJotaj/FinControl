import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subscriptions } from './subscriptions';

describe('Subscriptions', () => {
  let component: Subscriptions;
  let fixture: ComponentFixture<Subscriptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Subscriptions],
    }).compileComponents();

    fixture = TestBed.createComponent(Subscriptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
