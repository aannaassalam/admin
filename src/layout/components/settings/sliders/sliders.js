import React, { useEffect, useState } from "react";
import "./sliders.css";
import { Button, Modal, TextField } from "@material-ui/core";
import Select from "react-select";
import firebase from "firebase";
import ListCard from "../../listCard/listCard";
import toaster from "toasted-notes";
import Slider2 from "../../slider/slider";
import Loader from "../../loader/loader";

function Sliders({ uploading, setUploading }) {
  const [sliderName, setSliderName] = useState("");
  const [products, setProducts] = useState([]);
  const [editSlider, setEditSlider] = useState(false);
  const [editSliderProducts, setEditSliderProducts] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);
  const [offers, setOffers] = useState([]);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    firebase
      .firestore()
      .collection("settings")
      .get()
      .then((snap) =>
        snap.forEach((doc) => {
          setBestSeller(doc.data().bestsellerSlider);
          setOffers(doc.data().offersSlider);
          setId(doc.id);
          var products = [];
          firebase
            .firestore()
            .collection("products")
            .get()
            .then(
              (snap) => {
                snap.forEach((doc) => {
                  var product = {
                    label: <ListCard productID={doc.id} noCross />,
                    value: { id: doc.id, name: doc.data().title },
                  };
                  products.push(product);
                });
              },
              setProducts(products),
              setLoading(false)
            );
        })
      );
  };

  const filterOption = (option, searchTxt) => {
    const { label, value } = option;
    if (value.name.includes(searchTxt)) {
      return true;
    }
    return false;
  };

  const removeProduct = (index) => {
    var arr = editSliderProducts.filter((item) => item !== index);
    setEditSliderProducts(arr);
  };

  const updateSlider = () => {
    setUploading(true);
    if (editSliderProducts.length > 0) {
      if (sliderName === "bestsellerSlider") {
        let slider = bestSeller;
        slider.products = editSliderProducts;
        firebase
          .firestore()
          .collection("settings")
          .doc(id)
          .update({
            bestsellerSlider: slider,
          })
          .then(() => {
            init();
            setUploading(false);
            setEditSliderProducts([]);
            setEditSlider(false);
          })
          .catch((err) => {
            toaster.notify("Something went wrong");
            setUploading(false);
          });
      } else {
        let slider = offers;
        slider.products = editSliderProducts;
        firebase
          .firestore()
          .collection("settings")
          .doc(id)
          .update({
            offersSlider: slider,
          })
          .then(() => {
            init();
            setUploading(false);
            setEditSliderProducts([]);
            setEditSlider(false);
          })
          .catch((err) => {
            toaster.notify("Something went wrong");
            setUploading(false);
          });
      }
      toaster.notify("Slider Updated...");
    } else {
      toaster.notify("Please Select Products for slider");
      setUploading(false);
    }
  };
  return (
    <div className="sliders">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="heading">
            <h2>Sliders</h2>
          </div>
          <Slider2
            heading="Best Sellers"
            products={bestSeller.products}
            enableEdit={() => {
              setEditSlider(true);
              setEditSliderProducts(bestSeller.products);
              setSliderName("bestsellerSlider");
            }}
          />
          <Slider2
            heading="Offers"
            products={offers.products}
            enableEdit={() => {
              setEditSlider(true);
              setEditSliderProducts(offers.products);
              setSliderName("offersSlider");
            }}
          />
          <Modal open={editSlider} onClose={() => setEditSlider(false)}>
            <div className="sliderModal">
              <div className="head">
                <h4>Edit Slider</h4>
                <i
                  className="fas fa-times"
                  onClick={() => (uploading ? null : setEditSlider(false))}
                ></i>
              </div>
              <div className="body">
                {/* <TextField
                  variant="outlined"
                  size="small"
                  label="Title"
                  fullWidth
                  style={{ marginBottom: 15 }}
                /> */}

                <Select
                  options={products.filter(
                    (item) => !editSliderProducts.includes(item.value.id)
                  )}
                  value=""
                  onChange={(item) => {
                    if (!editSliderProducts.includes(item.value.id)) {
                      setEditSliderProducts([
                        ...editSliderProducts,
                        item.value.id,
                      ]);
                    }
                  }}
                  filterOption={filterOption}
                  placeholder="Search Products..."
                />

                <div className="selectedProducts">
                  {editSliderProducts.map((product) => (
                    <ListCard
                      productID={product}
                      removeItem={() => removeProduct(product)}
                      key={product}
                    />
                  ))}
                </div>
              </div>
              <div className="footer">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setEditSlider(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => updateSlider()}
                  disabled={uploading}
                >
                  Update
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}

export default Sliders;
