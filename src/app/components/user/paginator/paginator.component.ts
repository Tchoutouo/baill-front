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

  @Input() currentPage : number = 1;
  @Input() total : number = 3;
  @Input() lastElement : number = 3;
  @Input() next : number | null = 1;
  @Input() previous : number | null = 1;
  @Input() pageL_limit : number = 1;

  @Output() setPage = new EventEmitter<number>();

  min : number = 1
  max : number = 1
  items : Array<any> = [] ;
  
  constructor(){ }

  ngOnInit(){
    this.initComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initComponent() ;
  }

  initComponent(){
    console.log(this.currentPage);
    
    if (this.currentPage == 1) {
      this.previous = null ;
    }

    console.log(this.lastElement, this.currentPage);
    
    if(this.currentPage == this.lastElement){
      this.next = null;
    }
    
    // this.items = [this.previous, this.currentPage, this.next];
  }

  SetCurrentPage(page : any){
    if (page) {
      this.setPage.emit(page)
    }
  }
}

