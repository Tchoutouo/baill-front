import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  @Input() current : number = 1
  @Input() allcount : number = 5
  @Input() paginateLength : number = 7
  @Input() pageLimit : number = 5
  @Input() previous :  number = 0
  @Input() next : number = 2;

  min : number = 1
  max : number = 1
  items : Array<number | any> = [] ;

  @Output() pageSelected = new EventEmitter<number>();

  constructor(){}

  ngOnInit(){
    this.initPagination() ;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initPagination() ;
  }

  initPagination(){
    this.min = 1;
    this.max = Math.ceil(this.allcount / this.pageLimit) ;
    console.log(this.previous, this.pageLimit);
    if (this.current == 1) {
      this.items = [this.min];
    }else if((this.current > 1) && (this.current >= (this.allcount/this.pageLimit))){
      this.items = [this.previous, this.current];
    }else{
      this.items = [this.previous, this.current, this.next];
    }
    let index = 0;
    let maxElement = this.paginateLength - this.items.length;

    // if(this.paginateLength > this.max){
    //   this.items = [];
    //   for (let index = this.min; index <= this.max; index++) {
    //     this.items.push(index)
    //   }
    // }else{
    //   while(index < maxElement){
    //     let value : any ;
    //     if ((this.current > this.min) && (this.current < this.max)) {
    //       value = this.current + index - 1
    //     }
    //     if ((this.current === this.min)) {
    //       value = this.current + index + 1
    //     }
    //     if (this.current === this.max) {
    //       value = this.current + index - maxElement
    //     }
    //     this.items.splice(2+index, 0, value)
    //     index ++ ;
    //   }
    // }
    
  }

  handleSetPage(page: any){
    
    let newPage : number = page
    if (page === ">>") {
      newPage = this.current + 1 ;
    }

    if (page === "<<") {
      newPage = this.current - 1 ;
    }

    if (newPage >= this.min && newPage <= this.max) {
      this.pageSelected.emit(newPage)
    }

  }
}
