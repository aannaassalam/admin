import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { createRef, useEffect, useState } from "react";
import "./sliderSettings.css";

export default function SliderSettings({
  slider,
  categories,
  subcategory,
  updateFunc,
  err,
}) {
  const [select, setSelect] = useState("");
  const [select2, setSelect2] = useState("");

  const nameRef = createRef();

  useEffect(() => {
    if (slider) {
      setSelect(slider.category);
      setSelect2(slider.subcategory);
    }
  }, [slider]);

  return (
    <div className={err ? "sliderSettings err" : "sliderSettings"}>
      <div className="sliderSettingsInner">
        <h3 contentEditable ref={nameRef}>
          {slider?.name}
        </h3>
        <div className="select">
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">
              Select Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={select}
              label="Select Category"
              onChange={(e) => setSelect(e.target.value)}
            >
              {categories?.map((category) => (
                <MenuItem value={category.name}>
                  <span style={{ textTransform: "capitalize" }}>
                    {category.name}
                  </span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {subcategory && (
          <div className="select">
            <FormControl fullWidth size="small" disabled={!select}>
              <InputLabel id="demo-simple-select-label">
                Select Subcategory
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={select2}
                label="Select Subcategory"
                onChange={(e) => setSelect2(e.target.value)}
              >
                {categories
                  ?.filter((category) => category.name === select)[0]
                  ?.subcategories?.map((sub) => (
                    <MenuItem value={sub.name}>
                      <span style={{ textTransform: "capitalize" }}>
                        {sub.name}
                      </span>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        )}
        <button
          type="button"
          className="edit-button"
          onClick={() => updateFunc(nameRef.current.innerText, select, select2)}
        >
          Save
        </button>
      </div>
      {err && <p className="err-text">{err.msg}</p>}
    </div>
  );
}
