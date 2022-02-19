/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "./ImageTag.css";

let updatedTags = [];

const ImageTag = ({
  imgUrl,
  imgAlt,
  cssClass,
  tagClass,
  removeBtnClass,
  tagInputClass,
  tags,
  onTagAdded,
  onTagRemoved,
}) => {
  useEffect(() => {
    window.removeEventListener("resize", updateWidthAndHeight);
    window.addEventListener("resize", updateWidthAndHeight);
    updatedTags = tags.map((tag) => ({ ...tag }));
    return () => window.removeEventListener("resize", updateWidthAndHeight);
  }, [tags]);

  const inputRef = useRef();
  const containerRef = useRef();

  const [showInput, setShowInput] = useState(false);
  const [nearestTags, setNearestTags] = useState([]);

  const placeInput = (input, x_pos, y_pos) => {
    input.style.position = "absolute";
    input.style.left = x_pos + "px";
    input.style.top = y_pos + "px";
  };

  const addTagInput = (e) => {
    const dx = e.clientX;
    const dy = e.clientY;
    setShowInput(true);
    setTimeout(() => {
      placeInput(inputRef.current, dx, dy);
    }, 0);
  };

  const removeTagInput = (e) => {
    setShowInput(false);
  };

  const updateWidthAndHeight = () => {
    updatedTags = tags.map((tag) => ({ ...tag }));
    updatedTags.forEach((tag) => {
      updateTagCoordinates(tag);
    });
  };

  const updateTagCoordinates = (tag) => {
    const docHeight = containerRef.current.clientHeight;
    const docWidth = containerRef.current.clientWidth;
    tag.x = tag.x * (docWidth / tag.docWidth);
    tag.y = tag.y * (docHeight / tag.docHeight);
  };

  const updateNearestTags = (e) => {
    const dx = e.clientX;
    const dy = e.clientY;
    const margin = 100;
    const nearByTags = updatedTags.filter((tag) => {
      return (
        tag.x - margin < dx &&
        dx < tag.x + margin &&
        tag.y - margin < dy &&
        dy < tag.y + margin
      );
    });
    setNearestTags(nearByTags);
  };

  const onTagTextUpdated = (e) => {
    if (e.key === "Enter") {
      const input = inputRef.current;
      const inputCoordinates = input.getBoundingClientRect();

      const docHeight = containerRef.current.clientHeight;
      const docWidth = containerRef.current.clientWidth;

      const tag = {
        x: inputCoordinates.x,
        y: inputCoordinates.y,
        docWidth,
        docHeight,
        text: input.value,
      };

      imageTagAdded(tag);
    }
  };

  const imageTagAdded = (tag) => {
    onTagAdded(tag);
    setNearestTags([tag]);
    setShowInput(false);
  };

  const imageTagRemoved = (tag) => {
    onTagRemoved(tag);
    setNearestTags([]);
    setShowInput(false);
  };

  return (
    <div className="img__tag__main" ref={containerRef}>
      <img
        src={imgUrl}
        alt={imgAlt ? imgAlt : "Image Unavailable"}
        className={cssClass ? cssClass : "img__image"}
        onDoubleClick={addTagInput}
        onClick={removeTagInput}
        onMouseMove={updateNearestTags}
      />
      {showInput && (
        <input
          className={tagInputClass ? tagInputClass : "img__tag__input"}
          ref={inputRef}
          autoFocus
          onKeyUp={onTagTextUpdated}
        ></input>
      )}
      {nearestTags.map((tag, i) => (
        <div
          style={{ position: "absolute", left: tag.x, top: tag.y, zIndex: 100 }}
          key={i}
        >
          <span className={tagClass ? tagClass : "img__tag"}>
            {tag.text}
            <button
              className={removeBtnClass ? removeBtnClass : "img__tag__btn"}
              onClick={() => {
                imageTagRemoved(tag);
              }}
            >
              x
            </button>
          </span>
        </div>
      ))}
    </div>
  );
};

export default ImageTag;
