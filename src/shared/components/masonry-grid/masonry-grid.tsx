import React, { ReactNode, useEffect, useRef, useState } from "react";
import "./masonry-grid.css";

interface MasonryGridAttributes {
  children: React.ReactNode;
  breakpoints: number[];
}

export default function MasonryGrid({ children, breakpoints }: MasonryGridAttributes) {
  const [columns, setColumns] = useState(1);
  const masonryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial column count on mount
    onResize();
    // Add resize event listener
    window.addEventListener("resize", onResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const getColumns = (width: number) => {
    // Get number of columns based on window width and breakpoints
    console.log(width);
    return (
      breakpoints.reduceRight((p, c, i) => {
        return c < width ? p : i;
      }, breakpoints.length) + 1
    );
  };

  const onResize = () => {
    // Get current number of columns based on Masonry container width
    if (masonryRef.current) {
      const newColumns = getColumns(masonryRef.current.offsetWidth);
      setColumns(newColumns);
    }
  };

  const mapChildren = (): ReactNode[][] => {
    // Teile die Kind-Elemente in Spalten auf
    let col: ReactNode[][] = [];
    for (let i = 0; i < columns; i++) {
      col.push([]);
    }
    return (children as ReactNode[]).reduce((p: ReactNode[][], c: ReactNode, i: number) => {
      p[i % columns].push(c);
      return p;
    }, col);
  };

  return (
    <div className="masonry" ref={masonryRef}>
      {mapChildren().map((col: ReactNode[], ci: number) => (
        <div className="column" key={ci}>
          {col.map((child: ReactNode, i: number) => (
            <div key={i}>{child}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
