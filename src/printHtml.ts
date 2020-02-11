export const printHtml = (x: any): void => {
  document.getElementById("app").innerHTML = `
    <style>
    html, *{
      font-family: "Fira Code", "Fira Code Retina", "Droid Sans Mono", Mono, Monospace;
    }
    </style>

    <h1>Results</h1>
    <div>
      <pre>${JSON.stringify(x, null, 2)}</pre>
    </div>
`;
};
