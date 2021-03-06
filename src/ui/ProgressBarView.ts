import { createElement } from './DomHelper'
import { IComponent } from './Component'

type SeekCallback = (percent: number) => void

export class ProgressBarView implements IComponent {
  public readonly element: HTMLElement

  private _progressElement: HTMLElement
  private _progressHover: HTMLElement

  private _onSeek: SeekCallback = () => { }

  private _progress: number = 0

  constructor() {
    const el = this.element = createElement('div', { class: 'progress-bar' },
      this._progressElement = createElement('div', { class: 'progress' }),
      this._progressHover = createElement('div', { class: 'progress-hover', attrs: { style: 'opacity: 0' } })
    )

    el.addEventListener('mousemove', this._updateProgressHover.bind(this))
    el.addEventListener('mouseenter', () => {
      this._progressHover.style.opacity = '1'
    })
    el.addEventListener('mouseleave', () => {
      this._progressHover.style.opacity = '0'
    })
    el.addEventListener('mousedown', (evt: MouseEvent) => {
      const percent = (evt.clientX - el.getBoundingClientRect().left) / el.clientWidth
      this._onSeek(percent)
    })
    this._updateProgress()
  }

  public get progress(): number {
    return this._progress
  }
  public set progress(value: number) {
    if (value !== this._progress) {
      this._progress = Math.max(0.0, Math.min(value, 1.0))
      this._updateProgress()
    }
  }
  public onSeek(cb: SeekCallback): void {
    this._onSeek = cb
  }

  private _updateProgress() {
    this._progressElement.style.width = (100 * this._progress) + '%'
  }
  private _updateProgressHover(evt: MouseEvent) {
    const percent = (evt.clientX - this.element.getBoundingClientRect().left) / this.element.clientWidth
    this._progressHover.style.width = (100 * percent) + '%'
  }
}
