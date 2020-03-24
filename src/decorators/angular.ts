import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import addons from '@storybook/addons';


import { CHANGE } from '../constants';
import { Theme, ThemeConfig } from '../models';
import { getSelectedTheme, getSelectedThemeName } from '../shared';

import { getHtmlClasses } from './shared';

const channel = addons.getChannel();

@Component({
  selector: 'theme-decorator',
  template: `
<div [class]="themeClasses">
  <div>themeName : {{ themeName }}</div>
  <div>themeClasses: {{ themeClasses }}</div>
  <ng-content></ng-content>
</div>
`,
})
export class ThemeDecorator implements OnDestroy, OnInit {

  @Input() config: ThemeConfig;

  
  // $change = new EventEmitter<string>();
  theme: Theme;
  themeClasses: string = '';
  themeName: string = 'none';

  changeTheme = (themeName: string) => {
    this.setTheme(themeName);
    this._changeDetectorRef.markForCheck();
  }

  setTheme = (themeName: string) => {
    this.themeName = themeName;
    this.theme = getSelectedTheme(this.config.list, this.themeName);
    this.themeClasses = getHtmlClasses(this.theme);
  };

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnDestroy() {
    channel.removeListener(CHANGE, this.changeTheme);
  }

  ngOnInit() {
    const lastValue = channel.last(CHANGE);
    this.setTheme((lastValue && lastValue[0]) || getSelectedThemeName(this.config.list));
    channel.on(CHANGE, this.changeTheme);
  }

}
