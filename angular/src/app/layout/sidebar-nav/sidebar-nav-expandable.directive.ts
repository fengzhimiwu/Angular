import {Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appSidebarNavExpandable]'
})
export class SidebarNavExpandableDirective implements OnInit, OnChanges {
  @Input('appSidebarNavExpandable') isLinkRouterActivate: boolean;

  constructor(
    private el: ElementRef,
    private render: Renderer2,
  ) { }

  ngOnInit() {
    this.render.addClass(this.el.nativeElement, 'expandable-menu-toggle');
    this.render.listen(this.el.nativeElement, 'click', (e) => {
      const $this = $(this.el.nativeElement);
      const $content = $this.next();
      if ($($this.parents('ul')[0]).hasClass('list')) {
        const $not = $(e.target).hasClass('expandable-menu-toggle') ? e.target : $(e.target).parents('.expandable-menu-toggle');
        $.each($('.menu-toggle.toggled').not($not).next(), function (i, val) {
          if ($(val).is(':visible')) {
            $(val).prev().toggleClass('toggled');
            $(val).slideUp();
          }
        });
      }
      $this.toggleClass('toggled');
      $content.slideToggle(320);
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isLinkRouterActivate && !$(this.el.nativeElement).hasClass('toggled')) {
      this.el.nativeElement.click();
    }
  }
}
