export interface Props {
  component: SVGSVGElement;
  container: HTMLCanvasElement;
}

const drawImage = ({ component, container }: Props) => {
  const xdocument = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html');
  xdocument.documentElement.appendChild(component);

  const context = container.getContext('2d');
  const dataUrl = 'data:image/svg+xml,' + window.encodeURIComponent(component.outerHTML);
  const image = new Image();

  image.addEventListener('load', () => context?.drawImage(image, 0, 0));
  image.setAttribute('src', dataUrl);
};

export default drawImage;
