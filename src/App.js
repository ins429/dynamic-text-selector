import React, { useState } from "react";
import "./App.css";

const tokenize = (
  text,
  level,
  handleMouseDown,
  handleMouseUp,
  handleMouseOver,
  start,
  end
) =>
  text.split(" ").map((token, i) => {
    const key = Math.ceil(level * 1000000 + i);

    return (
      <span
        key={key}
        className={
          key === start
            ? "start"
            : key === end
              ? "end"
              : start && start <= key && end >= key
                ? "active"
                : ""
        }
        onMouseDown={() => handleMouseDown(key)}
        onMouseUp={() => handleMouseUp(key)}
        onMouseOver={() => handleMouseOver(key)}
      >
        {token}{" "}
      </span>
    );
  });

const rebuildChildren = (
  children,
  handleMouseDown,
  handleMouseUp,
  handleMouseOver,
  start,
  end
) => {
  console.log("hi");
};

const childrenToData = (
  children,
  level,
  handleMouseDown,
  handleMouseUp,
  handleMouseOver,
  start,
  end
) =>
  React.Children.toArray(children).map(
    (child, levelIdx) =>
      child.props && child.props.skip
        ? null
        : typeof child.type === "function"
          ? child
          : typeof child.type === "string"
            ? React.cloneElement(
                child,
                {},
                childrenToData(
                  child.props.children,
                  level + 1 + 0.01 * levelIdx,
                  handleMouseDown,
                  handleMouseUp,
                  handleMouseOver,
                  start,
                  end
                )
              )
            : typeof child === "string"
              ? tokenize(
                  child,
                  level,
                  handleMouseDown,
                  handleMouseUp,
                  handleMouseOver,
                  start,
                  end
                )
              : null
  );

// React.createElement('div', null, `Hello ${this.props.toWhat}`)

const Foo = () => <div>Foo</div>;

const DynamicTextSelector = ({ children, ...rest }) => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [mouseDownCursor, setMouseDownCursor] = useState(null);
  const [mouseDownKey, setMouseDownKey] = useState(null);
  const handleMouseDown = key => {
    if (!start || key === start) {
      setMouseDownCursor("start");
      setStart(key);
    }
    if (!end || key === end) {
      setMouseDownCursor("end");
      setEnd(key);
    }
    setMouseDownKey(key);
  };

  const handleMouseUp = key => {
    if (!end || mouseDownKey === end) {
      setEnd(key);
    }
    if (mouseDownKey === start && start !== key && key < end) {
      setStart(key);
    }
    setMouseDownKey(null);
    setMouseDownCursor(null);
  };

  const handleMouseOver = key => {
    if (start && mouseDownCursor === "start" && start !== key && key < end) {
      setStart(key);
    }
    if (end && mouseDownCursor === "end" && end !== key && key > start) {
      setEnd(key);
    }
  };

  console.log("start", start, "end", end, "mouseDown", mouseDownKey);
  const _children = childrenToData(
    children,
    1,
    handleMouseDown,
    handleMouseUp,
    handleMouseOver,
    start,
    end
  );

  return (
    <div className={mouseDownKey ? "grabbing" : ""}>
      {children}
      {_children}
      <button
        onClick={() => {
          setStart(null);
          setEnd(null);
        }}
      >
        cancel
      </button>
    </div>
  );
};

const App = () => {
  return (
    <DynamicTextSelector>
      <h1>title</h1>
      <p>
        first paragraph{" "}
        <span>
          nested span <b>and nested bold</b>
        </span>
      </p>
      <h3>subtitle</h3>
      <div>
        Ipsum et sequi voluptatum iste veritatis? Fugiat nobis laudantium
        officia natus soluta accusantium earum Eum corrupti officia ab
        exercitationem libero Doloribus quia esse neque aut autem Praesentium
        distinctio eaque reiciendis
      </div>
      no wrap
      <Foo />
    </DynamicTextSelector>
  );
};

export default App;
