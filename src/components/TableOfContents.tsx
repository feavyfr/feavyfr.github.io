import * as React from "react"
import "../style/style.css";
import "./style.css";

interface TOC {
  title?: string;
  url?: string;
  items: TOC[];
}

function generateTOC(toc: TOC, prefix: string = "") {
  if(!toc.items) {
    return undefined;
  }
  return (
      <ol>
        {toc.items.map((item, i) => (
            <li key={item.title}>
              <a href={item.url}><span className="index">{prefix+(i+1)}</span> {item.title}</a>
              {generateTOC(item, prefix+(i+1)+".")}
            </li>
        ))}
      </ol>
  );
}

// markup
const TableOfContents: React.FC<{ data: { tableOfContents: any } }> = ({data: {tableOfContents}}) => {
  return (
      <div className="table-of-contents">
        <p>Table des matières</p>
        {generateTOC(tableOfContents)}
      </div>
  );
}

export default TableOfContents
