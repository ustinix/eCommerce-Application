export type BaseProps = {
  tagName: keyof HTMLElementTagNameMap;
  classNames: Array<string>;
  textContent: string;
  parentNode?: HTMLElement;
};

const DEFAULT_PROPERTIES: BaseProps = { tagName: 'div', classNames: [], textContent: '' };

export default class BaseComponent {
  protected node: HTMLElement;

  constructor({
    tagName = 'div',
    classNames = [],
    textContent = '',
    parentNode,
  }: Partial<BaseProps> = DEFAULT_PROPERTIES) {
    this.node = document.createElement(tagName);
    this.node.classList.add(...classNames);
    this.node.textContent = textContent;

    if (parentNode) {
      parentNode.append(this.node);
    }
  }

  public insertChild(child: BaseComponent): void {
    this.node.append(child.getNode());
  }

  public insertChildren(childs: BaseComponent[]): void {
    childs.forEach(element => {
      this.insertChild(element);
    });
  }

  public getNode<T extends HTMLElement = HTMLElement>(): T {
    return this.node as T;
  }

  public addClass(className: string): void {
    this.node.classList.add(className);
  }

  public setContent(content: string): void {
    this.node.textContent = content;
  }

  public setInnerHTML(html: string): void {
    this.node.innerHTML = html;
  }

  public setAttribute(attribute: string, value: string): void {
    this.node.setAttribute(attribute, value);
  }
  public clearContent(): void {
    while (this.node.firstChild) {
      this.node.firstChild.remove();
    }
    this.node.textContent = '';
  }
}
