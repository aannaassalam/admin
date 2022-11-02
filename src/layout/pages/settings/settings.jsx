import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Banner from "./banner/banner";
import "./settings.css";
import SliderSettings from "./sliderSettings/sliderSettings";

export default function Settings() {
  const [settings, setSettings] = useState({});
  const [errMsg, setErrMsg] = useState({ slider: "", msg: "" });

  useEffect(() => {
    onSnapshot(
      doc(getFirestore(), "settings", "dMsgyXwanQY5tnH075J0"),
      (doc) => {
        setSettings(doc.data());
      },
      (err) => console.log(err)
    );
  }, []);

  useEffect(() => {
    if (errMsg.msg) {
      setTimeout(() => {
        setErrMsg({
          slider: "",
          msg: "",
        });
      }, 3000);
    }
  }, [errMsg]);

  const updateCategorySlider = (name, category) => {
    if (name.trim() !== "" && category !== "") {
      updateDoc(doc(getFirestore(), "settings", "dMsgyXwanQY5tnH075J0"), {
        slider1: {
          name,
          category,
        },
      })
        .then(() => {
          console.log("Added1");
        })
        .catch((err) => console.log(err));
    } else {
      setErrMsg({ slider: "slider1", msg: "Please fill in all the fields." });
    }
  };

  const updateCategorySlider2 = (name, category) => {
    if (name.trim() !== "" && category !== "") {
      updateDoc(doc(getFirestore(), "settings", "dMsgyXwanQY5tnH075J0"), {
        slider2: {
          name,
          category,
        },
      })
        .then(() => {
          console.log("Added2");
        })
        .catch((err) => console.log(err));
    } else {
      setErrMsg({ slider: "slider2", msg: "Please fill in all the fields." });
    }
  };

  const updateSubcategorySlider = (name, category, subcategory) => {
    if (name.trim() !== "" && category !== "" && subcategory !== "") {
      updateDoc(doc(getFirestore(), "settings", "dMsgyXwanQY5tnH075J0"), {
        slider3: {
          name,
          category,
          subcategory,
        },
      })
        .then(() => {
          console.log("Added3");
        })
        .catch((err) => console.log(err));
    } else {
      setErrMsg({ slider: "slider3", msg: "Please fill in all the fields." });
    }
  };
  const updateSubcategorySlider2 = (name, category, subcategory) => {
    if (name.trim() !== "" && category !== "" && subcategory !== "") {
      updateDoc(doc(getFirestore(), "settings", "dMsgyXwanQY5tnH075J0"), {
        slider4: {
          name,
          category,
          subcategory,
        },
      })
        .then(() => {
          console.log("Added4");
        })
        .catch((err) => console.log(err));
    } else {
      setErrMsg({ slider: "slider4", msg: "Please fill in all the fields." });
    }
  };

  return (
    <div className="settings">
      <Banner banner={settings.banner} />
      <SliderSettings
        slider={settings.slider1}
        categories={settings.categories}
        updateFunc={updateCategorySlider}
        err={errMsg.slider === "slider1" ? errMsg : null}
      />
      <SliderSettings
        slider={settings.slider2}
        categories={settings.categories}
        updateFunc={updateCategorySlider2}
        err={errMsg.slider === "slider2" ? errMsg : null}
      />
      <SliderSettings
        slider={settings.slider3}
        categories={settings.categories}
        subcategory={true}
        updateFunc={updateSubcategorySlider}
        err={errMsg.slider === "slider3" ? errMsg : null}
      />
      <SliderSettings
        slider={settings.slider4}
        categories={settings.categories}
        subcategory={true}
        updateFunc={updateSubcategorySlider2}
        err={errMsg.slider === "slider4" ? errMsg : null}
      />
    </div>
  );
}
