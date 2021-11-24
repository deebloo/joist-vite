import { styled } from '@joist/component/styled';
import {
  observable,
  observe,
  OnChange,
  PropChanges,
} from '@joist/component/observable';
import { inject } from '@joist/di';
import { injectable } from '@joist/di-dom';

import { MathService } from './math.service';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
  <button data-action="dec">-</button>
  <span id="count">0</span>
  <button data-action="inc">+</button>
`;

@injectable()
@observable()
@styled([
  /* css */ `
  * {
      font-size: 200%;
    }

    span {
      width: 4rem;
      display: inline-block;
      text-align: center;
    }

    button {
      width: 4rem;
      height: 4rem;
      border: none;
      border-radius: 10px;
      background-color: seagreen;
      color: white;
    }
  `,
])
export class CounterEement extends HTMLElement implements OnChange {
  @observe() count = 0;

  constructor(@inject(MathService) private math: MathService) {
    super();

    this.attachShadow({ mode: 'open' });

    console.log(this.math);
  }

  connectedCallback() {
    const root = this.shadowRoot!;

    root.appendChild(template.content.cloneNode(true));

    this.addListeners();
  }

  onChange(c: PropChanges) {
    console.log(c);

    this.update();
  }

  private addListeners() {
    this.shadowRoot!.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      switch (target.dataset.action) {
        case 'inc':
          this.count = this.math.increment(this.count);
          break;

        case 'dec':
          this.count = this.math.decrement(this.count);
          break;
      }
    });
  }

  private update() {
    const root = this.shadowRoot!;

    root.getElementById('count')!.innerHTML = this.count.toString();
  }
}

customElements.define('app-counter', CounterEement);
