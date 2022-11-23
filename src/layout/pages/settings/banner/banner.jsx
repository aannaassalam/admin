import React, { useState } from "react";
import "./banner.css";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { FormHelperText } from "@mui/material";

export default function Banner({ banner }) {
  const [err, setErr] = useState("");

  const UpdateBanner = async (e) => {
    if (e.target.files[0].size <= 300000) {
      setErr("");
      const bannerRef = ref(
        getStorage(),
        `/settings/banner/${e.target.files[0].name}`
      );
      const snapshot = await uploadBytes(bannerRef, e.target.files[0]);
      const url = await getDownloadURL(snapshot.ref);
      updateDoc(doc(getFirestore(), "settings", "dMsgyXwanQY5tnH075J0"), {
        banner: url,
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    } else {
      setErr("Image size should not exceed 300KB");
    }
  };

  return (
    <div className="banner">
      <div className="banner-heading">
        <h3>Banner</h3>
        {/* <label> */}
        <button
          type="button"
          className="edit-button"
          onClick={() => document.getElementById("file-input").click()}
        >
          Edit
        </button>
        <input
          type="file"
          style={{ display: "none" }}
          onChange={UpdateBanner}
          id="file-input"
        />
        {/* </label> */}
      </div>
      <img src={banner} alt="" />
      <FormHelperText>{err && err}</FormHelperText>
    </div>
  );
}
