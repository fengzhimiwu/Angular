import { ActivatedRoute } from '@node_modules/@angular/router';
import {Component, ViewContainerRef, OnInit, Injector} from '@angular/core';
import {LoginService} from './login/login.service';
import {AppComponentBase} from '@shared/components/app-component-base';
import 'particles.js';
import {AccountServiceProxy, IsTenantAvailableInput} from '@shared/service-proxies/service-proxies';
import {AppTenantAvailabilityState} from '@shared/AppEnums';
import {ActivateRoutes} from '@node_modules/@angular/router/src/operators/activate_routes';
import {AbpSessionService} from '@abp/session/abp-session.service';
import { AbpEventNames } from '@shared/AppConsts';

declare var particlesJS;

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.less'],
  // encapsulation: ViewEncapsulation.None
})
export class AccountComponent extends AppComponentBase implements OnInit {
  versionText: string;
  currentYear: number;

  private viewContainerRef: ViewContainerRef;

  public constructor(
    injector: Injector,
    private _loginService: LoginService,
    private _accountService: AccountServiceProxy,
    private _sessionService: AbpSessionService,
    private route: ActivatedRoute,
  ) {
    super(injector);

    this.currentYear = new Date().getFullYear();
    this.versionText = this.appSession.application.version + ' [' + this.appSession.application.releaseDate.format('YYYYMMDD') + ']';
  }

  showTenantChange(): boolean {
    return abp.multiTenancy.isEnabled;
  }

  ngOnInit(): void {
    let tenancyName = null;

    this.route.params.subscribe((params) => {
        console.log('213');
        tenancyName = params.tenancyName;
      }
    );

    // const tenancyName = this.route.snapshot.paramMap.get('tenancyName');
    const current = this.appSession.tenant;
    // url无tenancyName则跳过，当前和url的tenancyName相同也跳过
    console.log(tenancyName);
    if (tenancyName == null) {
    } else if (tenancyName === (current ? current.tenancyName : '')) {
    } else if (tenancyName === '') {
      // 当url的tenancyName为Host时
      abp.multiTenancy.setTenantIdCookie(undefined);
      // 触发tenant信息更新
      abp.event.trigger(AbpEventNames.sessionInit);
      return;
    } else if (tenancyName != null) {
      // 当url的tenancyName为其他时，并判断租户是否可用，然后切换租户
      const input = new IsTenantAvailableInput({tenancyName: tenancyName});
      this._accountService.isTenantAvailable(input).subscribe(result => {
        switch (result.state) {
          case AppTenantAvailabilityState.Available:
            // 如果可用
            abp.multiTenancy.setTenantIdCookie(result.tenantId);
            // 触发tenant信息更新
            abp.event.trigger(AbpEventNames.sessionInit);
            return;
          case AppTenantAvailabilityState.InActive:
            // 如果未激活
            this.message.warn(this.l('TenantIsNotActive', tenancyName));
            break;
          case AppTenantAvailabilityState.NotFound: // NotFound
            // 如果不存在
            this.message.warn(this.l('ThereIsNoTenantDefinedWithName{0}', tenancyName));
            break;
        }
      });
    }

    /**设置粒子背景*/
    particlesJS('particles-js', {
      'particles': {
        'number': {
          'value': 160,
          'density': {
            'enable': true,
            'value_area': 800
          }
        },
        'color': {
          'value': '#999999'
        },
        'shape': {
          'type': 'circle',
          'stroke': {
            'width': 0,
            'color': '#000000'
          },
          'polygon': {
            'nb_sides': 5
          },
          'image': {
            'src': 'img/github.svg',
            'width': 100,
            'height': 100
          }
        },
        'opacity': {
          'value': 0.5,
          'random': false,
          'anim': {
            'enable': false,
            'speed': 1,
            'opacity_min': 0.1,
            'sync': false
          }
        },
        'size': {
          'value': 3,
          'random': true,
          'anim': {
            'enable': false,
            'speed': 40,
            'size_min': 0.1,
            'sync': false
          }
        },
        'line_linked': {
          'enable': true,
          'distance': 150,
          'color': '#dddddd',
          'opacity': 0.4,
          'width': 2
        },
        'move': {
          'enable': true,
          'speed': 2,
          'direction': 'none',
          'random': false,
          'straight': false,
          'out_mode': 'out',
          'bounce': false,
          'attract': {
            'enable': false,
            'rotateX': 600,
            'rotateY': 1200
          }
        }
      },
      'interactivity': {
        'detect_on': 'canvas',
        'events': {
          'onhover': {
            'enable': true,
            'mode': 'grab'
          },
          'onclick': {
            'enable': true,
            'mode': 'push'
          },
          'resize': true
        },
        'modes': {
          'grab': {
            'distance': 140,
            'line_linked': {
              'opacity': 1
            }
          },
          'bubble': {
            'distance': 400,
            'size': 40,
            'duration': 2,
            'opacity': 8,
            'speed': 3
          },
          'repulse': {
            'distance': 200,
            'duration': 0.4
          },
          'push': {
            'particles_nb': 4
          },
          'remove': {
            'particles_nb': 2
          }
        }
      },
      'retina_detect': true
    });
  }
}
