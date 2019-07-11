import { Component, OnInit, Input, SimpleChanges, OnChanges, Output } from '@angular/core';
import { Crossfilter, Dimension, Group } from 'crossfilter2';
import { Athletes, MyInterface } from 'src/share/interface/athletes.interface';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.css']
})
export class MyComponentComponent implements OnInit, OnChanges {
  @Input() ndx: Crossfilter<Athletes>;
  private dimension: Dimension<Athletes, string>;
  private group: Group<Athletes, string, MyInterface>;
  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ndx.firstChange) {
      return null;
    }
    this.dimension = this.ndx.dimension<string>(d => `${d.age}_${d.sex}`);
    this.group = this.dimension.group<string, MyInterface>()
      .reduce(
        // reduceAdd()
        (output, input) => {
          ++output.count;
          output.age = input.age;
          output.sex = input.sex;
          return output;
        },
        // reduceRemove()
        (output, input) => {
          --output.count;
          output.age = input.age;
          output.sex = input.sex;
          return output;
        },
        // reduceInitial()
        () => ({age: null, sex: null, count: 0})
      ).order(d => d.count);
    console.log(this.group.all());
    this.ndx.onChange(type => {
      console.log(type, this.dimension.top(Infinity));
    });
  }

}
