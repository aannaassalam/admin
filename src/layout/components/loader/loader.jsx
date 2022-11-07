import React, { useEffect, useState } from "react";
import "./loader.css";

export default function Loader({ loading }) {
  const [loadingTime, setLoadingTime] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoadingTime(false), 2200);
  }, []);

  return (
    <div className={!loading && !loadingTime ? "loader fade" : "loader"}>
      <span>N</span>
      <span>u</span>
      <span>T</span>
      <span>u</span>
      <span>Y</span>
      <span>u</span>
      <span>7</span>
      <span>2</span>
    </div>
  );
}
