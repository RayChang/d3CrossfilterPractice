/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AgeSexComponent } from './age-sex.component';

describe('AgeSexComponent', () => {
  let component: AgeSexComponent;
  let fixture: ComponentFixture<AgeSexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgeSexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeSexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
