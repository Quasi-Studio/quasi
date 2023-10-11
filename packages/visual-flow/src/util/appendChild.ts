function appendChild(
  par:
    | HTMLElement
    | SVGElement
    | {
        el: HTMLElement | SVGElement;
      },
  son:
    | HTMLElement
    | SVGElement
    | {
        el: HTMLElement | SVGElement;
      },
) {
  (par instanceof HTMLElement || par instanceof SVGElement
    ? par
    : par.el
  ).appendChild(
    son instanceof HTMLElement || son instanceof SVGElement ? son : son.el,
  );
}

export { appendChild };
