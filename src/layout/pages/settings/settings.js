import React, { useState } from "react";
import "./settings.css";
import cog from "../../../assets/cogs.png";
import { Backdrop, CircularProgress } from "@material-ui/core";
import Advertisement from "../../components/settings/advertisement/advertisement";
import Sliders from "../../components/settings/sliders/sliders";

function Settings() {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="settings">
      <div className="title">
        <div className="left">
          <img src={cog} alt="" />
          <h4>Settings</h4>
        </div>
      </div>
      <Advertisement
        uploading={uploading}
        setUploading={(toggle) => setUploading(toggle)}
      />
      <Sliders
        uploading={uploading}
        setUploading={(toggle) => setUploading(toggle)}
      />

      <Backdrop className="backdrop" open={uploading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Settings;
