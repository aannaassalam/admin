import React, { Component } from "react";
import "./section.css";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import Table from "../../../components/table/table";
import Loader from "../../../components/loader/loader";
import box from "../../../../assets/box.svg";
import toaster from "toasted-notes";
import "toasted-notes/src/styles.css";
import firebase from "firebase";

export default class Section extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
      modal: false,
      editProduct: false,
      categories: [],
      product_name: "",
      product_id: "",
      product_description: "",
      product_cp: "",
      product_sp: "",
      product_category: "",
      product_subcategory: "",
      product_quantity: "",
      product_images: [],
      product_shipping: "",
      product_video: "",
      step: 1,
      imgErr: "",
      uploading: false,
      removedImages: [],
      editId: "",
      shortDesc: false,
      short1: "",
      short2: "",
      short3: "",
      short4: "",
      short5: "",
      short6: "",
      variations: false,
      variationsArray: [],
      deleteId: "",
      adder: false,
      adderInput: "",
      variationName: "",
      showcaseImage: "",
      youtubeImage: "",
      showcase: "",
      youtube: "",
      editRatings: [],
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection("settings")
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          this.setState(
            {
              categories: doc.data().categories,
            },
            () => this.init()
          );
        });
      });
  }

  init = () => {
    var products = [];
    firebase
      .firestore()
      .collection("products")
      .get()
      .then((snap2) => {
        snap2.forEach((doc2) => {
          if (doc2.data().category === this.props.categoryName) {
            var product = doc2.data();
            product.id = doc2.id;
            products.push(product);
          }
        });
        this.setState({
          products,
          loading: false,
          uploading: false,
          deleteId: "",
        });
      });
  };

  handleImageUpload = async (image, doc, index) => {
    var url = "";
    var storageRef = null;
    if (image.type.includes("video/")) {
      storageRef = firebase.storage().ref(`/products/${doc}/video`);
    } else {
      storageRef = firebase.storage().ref(`/products/${doc}/image${index}`);
    }
    await storageRef
      .put(image)
      .then(async (res) => (url = await res.ref.getDownloadURL()))
      .catch(() => {
        toaster.notify("Something went Wrong, Please try again!");
        this.setState({
          uploading: false,
        });
      });
    return url;
  };

  handleEditUpload = async (image, doc, decimal) => {
    var url = "";
    var storageRef = null;
    storageRef = firebase.storage().ref(`/products/${doc}/image${decimal}`);
    await storageRef
      .put(image)
      .then(async (res) => (url = await res.ref.getDownloadURL()))
      .catch(() => {
        toaster.notify("Something went Wrong, Please try again!");
        this.setState({
          uploading: false,
        });
      });
    return url;
  };

  addProduct = () => {
    this.setState({
      uploading: true,
    });
    if (
      this.state.product_category.length > 0 &&
      this.state.product_subcategory.length > 0 &&
      this.state.product_name.length > 0 &&
      this.state.product_id.length > 0 &&
      this.state.variationsArray.length > 0 &&
      this.state.product_shipping > 0 &&
      this.state.product_description.length > 0 &&
      this.state.product_images.length > 0
    ) {
      var shortDescription = [
        this.state.short1,
        this.state.short2,
        this.state.short3,
        this.state.short4,
        this.state.short5,
        this.state.short6,
      ];
      firebase
        .firestore()
        .collection("products")
        .add({
          title: this.state.product_name,
          category: this.state.product_category,
          subcategory: this.state.product_subcategory,
          productId: this.state.product_id,
          quantity: parseInt(this.state.product_quantity),
          description: this.state.product_description,
          date: new Date(),
          shipping: parseInt(this.state.product_shipping),
          ratings: [],
          shortDescription: this.state.shortDesc ? shortDescription : [],
          variations: this.state.variationsArray,
          variationName: this.state.variationName,
          images: [],
          sold: 0,
        })
        .then(async (res) => {
          var images = [];
          var video = "";
          for (var i = 0; i < this.state.product_images.length; i++) {
            var url = await this.handleImageUpload(
              this.state.product_images[i],
              res.id,
              Math.floor(Math.random() * 900)
            );
            var img = {
              image: url,
              index: i + 1,
            };
            images.push(img);
          }
          if (this.state.product_video.name) {
            video = await this.handleImageUpload(
              this.state.product_video,
              res.id
            );
          }
          var showcase = this.state.showcaseImage;
          var youtube = this.state.youtubeImage;

          if (this.state.showcase?.length > 0 && showcase.name) {
            showcase = await this.handleEditUpload(showcase, res.id, 0.1);
          }

          if (this.state.youtube?.length > 0 && youtube.name) {
            youtube = await this.handleEditUpload(youtube, res.id, 0.2);
          }

          firebase
            .firestore()
            .collection("products")
            .doc(res.id)
            .update({
              images: images,
              video: video,
              showcase:
                this.state.showcase?.length > 0
                  ? {
                      image: showcase,
                      link: this.state.showcase,
                    }
                  : {},
              youtube:
                this.state.youtube?.length > 0
                  ? {
                      image: youtube,
                      link: this.state.youtube,
                    }
                  : {},
            })
            .then(() => {
              this.init();
              toaster.notify(`${this.state.product_name} added successfully!`);
              this.setState({
                product_name: "",
                product_id: "",
                product_description: "",
                product_category: "",
                product_subcategory: "",
                product_shipping: "",
                product_quantity: "",
                product_images: [],
                product_video: "",
                step: 1,
                shortDesc: false,
                short1: "",
                short2: "",
                short3: "",
                short4: "",
                short5: "",
                short6: "",
                modal: false,
                variations: false,
                variationsArray: [],
                variationName: "",
                showcase: "",
                showcaseImage: "",
                youtube: "",
                youtubeImage: "",
              });
            })
            .catch(() => {
              toaster.notify("Something went Wrong, Please try again!");
              this.setState({
                uploading: false,
              });
            });
        })
        .catch(() => {
          toaster.notify("Something went Wrong, Please try again!");
          this.setState({
            uploading: false,
          });
        });
    } else {
      if (this.state.product_category.length === 0) {
        toaster.notify("Please select a Category!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 1,
        });
      } else if (this.state.product_subcategory.length === 0) {
        toaster.notify("Please select a Sub-Category!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 1,
        });
      } else if (this.state.product_name.length === 0) {
        toaster.notify("Please enter a Product Name!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 2,
        });
      } else if (this.state.product_id.length === 0) {
        toaster.notify("Please enter Product ID!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 2,
        });
      } else if (this.state.product_cp <= 0) {
        toaster.notify("Please enter Usual Price!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 2,
        });
      } else if (this.state.product_sp <= 0) {
        toaster.notify("Please enter Listing Price!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 2,
        });
      } else if (this.state.product_description.length === 0) {
        toaster.notify("Please enter a Description!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 2,
        });
      } else if (this.state.product_shipping.length === 0) {
        toaster.notify("Please enter a Shipping Charge!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 2,
        });
      } else if (this.state.variationsArray.length === 0) {
        toaster.notify("Please enter Variations!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 2,
        });
      } else {
        toaster.notify("Please select some Images!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 3,
        });
      }
    }
  };

  editProduct = () => {
    this.setState({
      uploading: true,
    });
    if (
      this.state.product_category.length > 0 &&
      this.state.product_subcategory.length > 0 &&
      this.state.product_name.length > 0 &&
      this.state.product_id.length > 0 &&
      this.state.variationsArray.length > 0 &&
      this.state.product_shipping > 0 &&
      this.state.product_description.length > 0 &&
      this.state.product_images.length > 0
    ) {
      var shortDescription = [
        this.state.short1,
        this.state.short2,
        this.state.short3,
        this.state.short4,
        this.state.short5,
        this.state.short6,
      ];
      firebase
        .firestore()
        .collection("products")
        .doc(this.state.editId)
        .update({
          title: this.state.product_name,
          category: this.state.product_category,
          subcategory: this.state.product_subcategory,
          productId: this.state.product_id,
          quantity: this.state.product_quantity,
          description: this.state.product_description,
          ratings: this.state.editRatings,
          shipping: parseInt(this.state.product_shipping),
          images: [],
          variations: this.state.variationsArray,
          variationName: this.state.variationName,
          shortDescription: this.state.shortDesc ? shortDescription : [],
        })
        .then(async () => {
          var images = [];
          var img;
          var video = this.state.product_video;
          for (var i = 0; i < this.state.product_images.length; i++) {
            if (!this.state.product_images[i].image) {
              var random = Math.floor(Math.random() * 900);
              var url = await this.handleImageUpload(
                this.state.product_images[i],
                this.state.editId,
                random
              );
              img = {
                image: url,
                index: random,
              };
            } else {
              img = this.state.product_images[i];
            }
            images.push(img);
          }
          if (this.state.product_video.name) {
            video = await this.handleImageUpload(
              this.state.product_video,
              this.state.editId
            );
          }
          var showcase = this.state.showcaseImage;
          var youtube = this.state.youtubeImage;

          if (this.state.showcase?.length > 0 && showcase.name) {
            showcase = await this.handleEditUpload(
              showcase,
              this.state.editId,
              0.1
            );
          }

          if (this.state.youtube?.length > 0 && youtube.name) {
            youtube = await this.handleEditUpload(
              youtube,
              this.state.editId,
              0.2
            );
          }

          firebase
            .firestore()
            .collection("products")
            .doc(this.state.editId)
            .update({
              images: images,
              video: video,
              showcase:
                this.state.showcase?.length > 0
                  ? {
                      image: showcase,
                      link: this.state.showcase,
                    }
                  : {},
              youtube:
                this.state.youtube?.length > 0
                  ? {
                      image: youtube,
                      link: this.state.youtube,
                    }
                  : {},
            })
            .then(() => {
              this.init();
              toaster.notify(
                `${this.state.product_name} updated successfully!`
              );
              this.setState({
                product_name: "",
                product_id: "",
                product_description: "",
                product_category: "",
                product_subcategory: "",
                product_quantity: "",
                product_images: [],
                product_shipping: "",
                product_video: "",
                step: 1,
                editId: "",
                modal: false,
                shortDesc: false,
                short1: "",
                short2: "",
                short3: "",
                short4: "",
                short5: "",
                short6: "",
                variations: false,
                variationsArray: [],
                showcase: "",
                showcaseImage: "",
                youtube: "",
                youtubeImage: "",
              });
              // if (this.state.removedImages.length > 0) {
              //   this.state.removedImages.forEach((image) => {
              //     firebase.storage().refFromURL(image.image).delete();
              //   });
              //   this.setState({
              //     removedImages: [],
              //   });
              // }
            })
            .catch(() => {
              toaster.notify("Something went Wrong, Please try again!");
              this.setState({
                uploading: false,
              });
            });
        })
        .catch((err) => {
          console.log(err.message);
          toaster.notify("Something went wrong, Please try again!");
          this.setState({
            uploading: false,
          });
        });
    } else {
      if (this.state.product_category.length === 0) {
        toaster.notify("Please select a Category!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 1,
        });
      } else if (this.state.product_subcategory.length === 0) {
        toaster.notify("Please select a Sub-Category!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 1,
        });
      } else if (this.state.product_name.length === 0) {
        toaster.notify("Please enter a Product Name!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 2,
        });
      } else if (this.state.product_id.length === 0) {
        toaster.notify("Please enter Product ID!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 2,
        });
      } else if (this.state.product_description.length === 0) {
        toaster.notify("Please enter a Description!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 2,
        });
      } else if (this.state.variationsArray.length === 0) {
        toaster.notify("Please enter Variations!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 3,
        });
      } else if (this.state.product_shipping.length === 0) {
        toaster.notify("Please enter Shipping  Charge!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 2,
        });
      } else {
        toaster.notify("Please select some Images!", {
          duration: 2000,
        });
        this.setState({
          uploading: false,
          step: 4,
        });
      }
    }
  };

  handleDelete = () => {
    this.setState({
      uploading: true,
    });
    firebase
      .firestore()
      .collection("products")
      .doc(this.state.deleteId)
      .delete()
      .then(() => {
        firebase
          .firestore()
          .collection("settings")
          .get()
          .then((snap) => {
            snap.forEach((doc) => {
              var bestSeller = doc.data().bestsellerSlider;
              var offerSeller = doc.data().offersSlider;

              bestSeller.products = bestSeller.products.filter(
                (product) => product !== this.state.deleteId
              );
              offerSeller.products = offerSeller.products.filter(
                (product) => product !== this.state.deleteId
              );

              firebase
                .firestore()
                .collection("settings")
                .doc(doc.id)
                .update({
                  bestsellerSlider: bestSeller,
                  offersSlider: offerSeller,
                })
                .catch((err) => {
                  console.log(err.message);
                });
            });
          });
        // const storage = firebase
        //   .storage()
        //   .ref(`/products/${this.state.deleteId}`);
        // storage.listAll().then((res) => {
        //   res.items.forEach((item) => item.delete());
        // });
        this.init();
      });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleImagePicker = (e) => {
    var arr = e.target.files[0];
    if (arr && arr.size < 350000)
      this.setState({
        product_images: [...this.state.product_images, arr],
        imgErr: "",
      });
    else {
      this.setState({
        imgErr: "Image Size greater than 350kb are not accepted",
      });
      setTimeout(() => {
        this.setState({
          imgErr: "",
        });
      }, 4000);
    }
  };

  handleImage = (e) => {
    var arr = e.target.files[0];
    if (arr && arr.size < 350000)
      this.setState({
        [e.target.id]: arr,
        imgErr: "",
      });
    else {
      this.setState({
        imgErr: "Image Size greater than 350kb are not accepted",
      });
      setTimeout(() => {
        this.setState({
          imgErr: "",
        });
      }, 4000);
    }
  };

  handleVideoPicker = (e) => {
    var arr = e.target.files[0];
    if (arr.size < 2097152) {
      this.setState({
        product_video: arr,
        imgErr: "",
      });
    } else {
      this.setState({
        imgErr: "Video Size greater than 2.0MB are not accepted",
      });
      setTimeout(() => {
        this.setState({
          imgErr: "",
        });
      }, 4000);
    }
  };

  removeImage = (index) => {
    var images = this.state.product_images;
    var removedImage = images.splice(index, 1);
    this.setState({
      product_images: images,
      removedImages: [...this.state.removedImages, removedImage[0]],
    });
  };

  render() {
    const columns = [
      {
        Header: "Product Details",
        Cell: (props) => {
          return (
            <div style={{ display: "flex" }}>
              <img
                src={
                  props.row.original.images[0] &&
                  props.row.original.images[0].image
                }
                alt=""
              />
              <div className="table-box">
                <p className="upper">{props.row.original.title}</p>
                <p className="lower">{props.row.original.productId}</p>
              </div>
            </div>
          );
        },
        filter: "fuzzyText",
        sortable: true,
      },
      {
        Header: "Listing Price",
        Cell: (props) => (
          <div className="table-box">
            <p className="upper">
              {props.row.original.variations &&
                props.row.original.variations[0]?.listing}
            </p>
          </div>
        ),
        filter: "fuzzyText",
      },
      {
        Header: "Usual Price",
        Cell: (props) => (
          <div className="table-box">
            <p className="upper">
              {props.row.original.variations &&
                props.row.original.variations[0]?.usual}
            </p>
          </div>
        ),
        filter: "fuzzyText",
      },
      {
        Header: "Stock",
        Cell: (props) => (
          <div className="table-box">
            <p className="upper">{props.row.original.quantity}</p>
          </div>
        ),
        filter: "fuzzyText",
      },
      {
        Header: "Category",
        Cell: (props) => (
          <div className="table-box">
            <p className="upper">{props.row.original.category}</p>
          </div>
        ),
        filter: "fuzzyText",
      },
      {
        Header: "Sub Category",
        Cell: (props) => (
          <div className="table-box">
            <p className="upper">{props.row.original.subcategory}</p>
          </div>
        ),
        filter: "fuzzyText",
      },
      {
        Header: "Actions",
        Cell: (props) => (
          <div className="actions">
            <Button
              varinat="text"
              onClick={() => {
                this.setState({
                  edit: true,
                  modal: true,
                  editId: props.row.original.id,
                  product_name: props.row.original.title,
                  product_id: props.row.original.productId,
                  product_description: props.row.original.description,
                  // product_cp: props.row.original.cp,
                  // product_sp: props.row.original.sp,
                  product_category: props.row.original.category,
                  product_subcategory: props.row.original.subcategory,
                  product_shipping: props.row.original.shipping,
                  product_quantity: props.row.original.quantity,
                  product_images: props.row.original.images,
                  product_video: props.row.original.video || "",
                  shortDesc: props.row.original.shortDescription.length > 0,
                  short1:
                    props.row.original.shortDescription.length > 0
                      ? props.row.original.shortDescription[0] || ""
                      : "",
                  short2:
                    props.row.original.shortDescription.length > 0
                      ? props.row.original.shortDescription[1] || ""
                      : "",
                  short3:
                    props.row.original.shortDescription.length > 0
                      ? props.row.original.shortDescription[2] || ""
                      : "",
                  short4:
                    props.row.original.shortDescription.length > 0
                      ? props.row.original.shortDescription[3] || ""
                      : "",
                  short5:
                    props.row.original.shortDescription.length > 0
                      ? props.row.original.shortDescription[4] || ""
                      : "",
                  short6:
                    props.row.original.shortDescription.length > 0
                      ? props.row.original.shortDescription[5] || ""
                      : "",
                  variations: props.row.original.variations?.length > 0,
                  variationsArray:
                    props.row.original.variations?.length > 0
                      ? props.row.original.variations
                      : [],
                  variationName:
                    props.row.original.variationName &&
                    props.row.original.variationName,
                  showcase: props.row.original.showcase?.link,
                  showcaseImage: props.row.original.showcase?.image,
                  youtube: props.row.original.youtube?.link,
                  youtubeImage: props.row.original.youtube?.image,
                  editRatings: props.row.original.ratings,
                });
              }}
            >
              <i className="fas fa-pen"></i>
            </Button>
            <Button
              varinat="text"
              onClick={() =>
                this.setState({
                  deleteId: props.row.original.id,
                })
              }
            >
              <i className="fas fa-trash-alt"></i>
            </Button>
          </div>
        ),
      },
    ];

    return (
      <div className="section">
        {this.state.loading ? (
          <Loader />
        ) : (
          <>
            <div className="title">
              <div className="left">
                <Button
                  variant="contained"
                  className="back-btn"
                  onClick={this.props.back}
                >
                  <i className="fas fa-arrow-left"></i>
                </Button>
                <img src={box} alt="" />
                <h4>Add New Product</h4>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  this.setState({
                    modal: true,
                  })
                }
              >
                <i className="fas fa-plus-circle"></i>Add
              </Button>
            </div>

            <div className="table">
              <Table columns={columns} data={this.state.products} />
            </div>
          </>
        )}
        <Modal
          open={this.state.modal}
          onClose={() =>
            this.setState({
              product_name: "",
              product_id: "",
              product_description: "",
              product_cp: "",
              product_sp: "",
              product_category: "",
              product_subcategory: "",
              product_quantity: "",
              product_images: [],
              shortDesc: false,
              short1: "",
              short2: "",
              short3: "",
              short4: "",
              short5: "",
              short6: "",
              variations: false,
              variationsArray: [],
              step: 1,
              modal: this.state.uploading ? true : false,
              editId: "",
              variationName: "",
              showcase: "",
              showcaseImage: "",
              youtube: "",
              youtubeImage: "",
            })
          }
        >
          <div className="modal">
            <div className="head">
              <Box
                position="relative"
                display="inline-flex"
                style={{ marginBottom: 5 }}
              >
                <CircularProgress
                  variant="determinate"
                  value={20 * this.state.step}
                  style={{ color: "#00BB7B" }}
                />
                <Box
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  position="relative"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography
                    variant="caption"
                    style={{
                      marginBottom: "10%",
                      marginRight: "320%",
                      fontWeight: "bold",
                    }}
                  >
                    {this.state.step}/5
                  </Typography>
                </Box>
              </Box>
              <h4>
                {this.state.editId.length > 0
                  ? "Edit Product"
                  : "Add New Product"}
              </h4>
              <i
                className="fas fa-times"
                onClick={() =>
                  this.setState({
                    product_name: "",
                    product_id: "",
                    product_description: "",
                    product_cp: "",
                    product_sp: "",
                    product_category: "",
                    product_subcategory: "",
                    product_shipping: "",
                    product_quantity: "",
                    product_images: [],
                    shortDesc: false,
                    short1: "",
                    short2: "",
                    short3: "",
                    short4: "",
                    short5: "",
                    short6: "",
                    variations: false,
                    variationsArray: [],
                    step: 1,
                    modal: this.state.uploading ? true : false,
                    editId: "",
                    variationName: "",
                    showcase: "",
                    showcaseImage: "",
                    youtube: "",
                    youtubeImage: "",
                  })
                }
              ></i>
            </div>
            <div className="body">
              {this.state.step === 1 ? (
                <>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    size="small"
                    className="select"
                  >
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={this.state.product_category}
                      onChange={this.handleChange}
                      name="product_category"
                      label="Category"
                    >
                      {this.state.categories.map((category, index) => (
                        <MenuItem value={category.name} key={index}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {this.state.product_category.length > 0 ? (
                    <FormControl variant="outlined" fullWidth size="small">
                      <InputLabel>Sub-Category</InputLabel>
                      <Select
                        value={this.state.product_subcategory}
                        onChange={this.handleChange}
                        name="product_subcategory"
                        label="Sub-Category"
                      >
                        {this.state.categories.map((category) =>
                          category.name === this.state.product_category
                            ? category.subcategories.map((sub, index) => (
                                <MenuItem value={sub.name} key={index}>
                                  {sub.name}
                                </MenuItem>
                              ))
                            : null
                        )}
                      </Select>
                    </FormControl>
                  ) : null}
                </>
              ) : null}
              {this.state.step === 2 ? (
                <>
                  <Grid container spacing={3}>
                    <Grid
                      container
                      item
                      spacing={3}
                      m={12}
                      lg={12}
                      s={12}
                      xs={12}
                      className="no-padding-right"
                    >
                      <Grid
                        item
                        m={6}
                        lg={6}
                        s={6}
                        className="no-padding-right"
                      >
                        <TextField
                          variant="outlined"
                          size="small"
                          label="Product Name"
                          value={this.state.product_name}
                          onChange={this.handleChange}
                          name="product_name"
                          fullWidth
                          className="input"
                        />
                      </Grid>
                      <Grid
                        item
                        m={6}
                        lg={6}
                        s={6}
                        className="no-padding-right"
                      >
                        <TextField
                          variant="outlined"
                          size="small"
                          label="Product Id"
                          value={this.state.product_id}
                          onChange={this.handleChange}
                          name="product_id"
                          fullWidth
                          className="input"
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      item
                      spacing={3}
                      m={12}
                      lg={12}
                      s={12}
                      xs={12}
                      className="no-padding-right"
                    >
                      {/* <Grid
                        item
                        m={4}
                        lg={4}
                        s={4}
                        className="no-padding-right"
                      >
                        <TextField
                          variant="outlined"
                          size="small"
                          label="Usual Price"
                          type="number"
                          fullWidth
                          value={this.state.product_cp}
                          onChange={this.handleChange}
                          name="product_cp"
                          inputMode="numeric"
                          className="input"
                        />
                      </Grid>
                      <Grid
                        item
                        m={4}
                        lg={4}
                        s={4}
                        className="no-padding-right"
                      >
                        <TextField
                          variant="outlined"
                          size="small"
                          label="Listing Price"
                          type="number"
                          fullWidth
                          value={this.state.product_sp}
                          onChange={this.handleChange}
                          name="product_sp"
                          inputMode="numeric"
                          className="input"
                        />
                      </Grid> */}
                      <Grid
                        item
                        m={12}
                        lg={12}
                        s={12}
                        className="no-padding-right"
                      >
                        <TextField
                          variant="outlined"
                          size="small"
                          label="Product Stock"
                          type="number"
                          value={this.state.product_quantity}
                          onChange={this.handleChange}
                          name="product_quantity"
                          fullWidth
                          inputMode="numeric"
                          className="input"
                        />
                      </Grid>
                    </Grid>

                    <Grid item m={12} lg={12} s={12} xs={12}>
                      <TextField
                        variant="outlined"
                        size="small"
                        label="Product Description"
                        fullWidth
                        value={this.state.product_description}
                        onChange={this.handleChange}
                        name="product_description"
                        className="input textarea"
                        multiline
                      />
                    </Grid>
                    <Grid item m={12} lg={12} s={12} xs={12}>
                      <TextField
                        variant="outlined"
                        size="small"
                        label="Shipping Charge"
                        type="number"
                        fullWidth
                        value={this.state.product_shipping}
                        onChange={this.handleChange}
                        name="product_shipping"
                        className="input"
                      />
                    </Grid>
                  </Grid>
                </>
              ) : null}
              {this.state.step === 3 ? (
                <div>
                  <label
                    style={{
                      marginBottom: 20,
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "bold",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="shortDesc"
                      checked={this.state.shorDesc}
                      onChange={(e) =>
                        this.setState({ shortDesc: e.target.checked })
                      }
                      style={{ marginRight: 10, marginTop: 4 }}
                    />
                    Short Description
                  </label>
                  {this.state.shortDesc && (
                    <>
                      <TextField
                        variant="outlined"
                        label="Short description 1"
                        size="small"
                        name="short1"
                        value={this.state.short1}
                        onChange={this.handleChange}
                        fullWidth
                        style={{ marginBottom: 15 }}
                      />
                      <TextField
                        variant="outlined"
                        label="Short description 2"
                        size="small"
                        name="short2"
                        value={this.state.short2}
                        onChange={this.handleChange}
                        fullWidth
                        style={{ marginBottom: 15 }}
                      />
                      <TextField
                        variant="outlined"
                        label="Short description 3"
                        size="small"
                        name="short3"
                        value={this.state.short3}
                        onChange={this.handleChange}
                        fullWidth
                        style={{ marginBottom: 15 }}
                      />
                      <TextField
                        variant="outlined"
                        label="Short description 4"
                        size="small"
                        name="short4"
                        value={this.state.short4}
                        onChange={this.handleChange}
                        fullWidth
                        style={{ marginBottom: 15 }}
                      />
                      <TextField
                        variant="outlined"
                        label="Short description 5"
                        size="small"
                        name="short5"
                        value={this.state.short5}
                        onChange={this.handleChange}
                        fullWidth
                        style={{ marginBottom: 15 }}
                      />
                      <TextField
                        variant="outlined"
                        label="Short description 6"
                        size="small"
                        name="short6"
                        value={this.state.short6}
                        onChange={this.handleChange}
                        fullWidth
                        style={{ marginBottom: 15 }}
                      />
                    </>
                  )}
                  <label
                    style={{
                      marginBottom: 20,
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Variations
                  </label>
                  <div>
                    <div>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={this.state.variationName}
                        fullWidth
                        label="Variation Name"
                        name="variationName"
                        onChange={this.handleChange}
                        style={{ marginBottom: 10 }}
                      />
                      <div style={{ display: "flex" }}>
                        {this.state.variationsArray.map((item, index) => (
                          <span key={index} className="variation">
                            {item.variation}
                            <span
                              className="cross"
                              onClick={() => {
                                var arr = this.state.variationsArray;
                                arr.splice(index, 1);
                                this.setState({
                                  variationsArray: arr,
                                });
                              }}
                            >
                              <i className="fas fa-times"></i>
                            </span>
                          </span>
                        ))}
                        {this.state.variationsArray.length <= 7 && (
                          <span
                            className="adder"
                            onClick={() => this.setState({ adder: true })}
                          >
                            <i className="fas fa-plus"></i>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {this.state.step === 4 ? (
                <div className="lastStep">
                  <div className="images">
                    {this.state.product_images.length > 0 &&
                      this.state.product_images.map((image, index) => (
                        <div className="image" key={index}>
                          <img
                            src={
                              image.image
                                ? image.image
                                : URL.createObjectURL(image)
                            }
                            alt=""
                          />
                          <span onClick={() => this.removeImage(index)}>
                            <i className="fas fa-times"></i>
                          </span>
                        </div>
                      ))}
                    {this.state.product_images.length < 5 ? (
                      <label htmlFor="image-picker" className="picker">
                        <i className="fas fa-plus"></i>
                        <input
                          type="file"
                          id="image-picker"
                          onChange={this.handleImagePicker}
                          accept="image/*"
                        />
                      </label>
                    ) : null}
                    {this.state.product_video.name ||
                    this.state.product_video.length > 0 ? (
                      <div className="image" style={{ marginBottom: 0 }}>
                        <video
                          src={
                            this.state.product_video.name
                              ? URL.createObjectURL(this.state.product_video)
                              : this.state.product_video
                          }
                          type="video/mp4"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        ></video>
                        <span
                          onClick={() =>
                            this.setState({
                              product_video: "",
                            })
                          }
                        >
                          <i className="fas fa-times"></i>
                        </span>
                      </div>
                    ) : (
                      <label htmlFor="video-picker" className="picker">
                        <i className="fas fa-video"></i>
                        <input
                          type="file"
                          id="video-picker"
                          onChange={this.handleVideoPicker}
                          accept="video/*"
                        />
                      </label>
                    )}
                  </div>
                  <p className="imgErr">{this.state.imgErr}</p>
                </div>
              ) : null}
              {this.state.step === 5 ? (
                <div className="showcase-section">
                  <div className="showcase">
                    <h3>Showcase</h3>
                    <label className="pix" htmlFor="showcaseImage">
                      <input
                        type="file"
                        id="showcaseImage"
                        onChange={this.handleImage}
                        accept="image/*"
                      />
                      {this.state.showcaseImage ? (
                        this.state.showcaseImage.name ? (
                          <img
                            src={URL.createObjectURL(this.state.showcaseImage)}
                            alt=""
                          />
                        ) : (
                          <img src={this.state.showcaseImage} alt="" />
                        )
                      ) : (
                        <i className="fas fa-plus"></i>
                      )}
                    </label>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      label="Showcase Link"
                      name="showcase"
                      value={this.state.showcase}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="youtube">
                    <h3>Youtube</h3>
                    <label className="pix" htmlFor="youtubeImage">
                      <input
                        type="file"
                        id="youtubeImage"
                        onChange={this.handleImage}
                        accept="image/*"
                      />
                      {this.state.youtubeImage ? (
                        this.state.youtubeImage.name ? (
                          <img
                            src={URL.createObjectURL(this.state.youtubeImage)}
                            alt=""
                          />
                        ) : (
                          <img src={this.state.youtubeImage} alt="" />
                        )
                      ) : (
                        <i className="fas fa-plus"></i>
                      )}
                    </label>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      label="Youtube Link"
                      name="youtube"
                      value={this.state.youtube}
                      onChange={this.handleChange}
                    />
                  </div>
                  <p className="imgErr">{this.state.imgErr}</p>
                </div>
              ) : null}
            </div>
            <div className="footer">
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  this.state.step === 1
                    ? this.setState({
                        modal: false,
                        product_name: "",
                        product_id: "",
                        product_description: "",
                        product_cp: "",
                        product_sp: "",
                        product_category: "",
                        product_subcategory: "",
                        product_shipping: "",
                        product_quantity: "",
                        product_images: [],
                        short1: "",
                        short2: "",
                        short3: "",
                        short4: "",
                        short5: "",
                        short6: "",
                        step: 1,
                        editId: "",
                        variationName: "",
                        variation: false,
                        variationsArray: [],
                        showcase: "",
                        showcaseImage: "",
                        youtube: "",
                        youtubeImage: "",
                      })
                    : this.state.step === 2
                    ? this.setState({
                        step: 1,
                      })
                    : this.state.step === 3
                    ? this.setState({
                        step: 2,
                      })
                    : this.state.step === 4
                    ? this.setState({
                        step: 3,
                      })
                    : this.setState({
                        step: 4,
                      })
                }
                disabled={this.state.uploading}
              >
                {this.state.step === 1 ? "Cancel" : "Go Back"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  this.state.step === 1
                    ? this.setState({
                        step: 2,
                      })
                    : this.state.step === 2
                    ? this.setState({
                        step: 3,
                      })
                    : this.state.step === 3
                    ? this.setState({
                        step: 4,
                      })
                    : this.state.step === 4
                    ? this.setState({
                        step: 5,
                      })
                    : this.state.editId.length > 0
                    ? this.editProduct()
                    : this.addProduct()
                }
                disabled={this.state.uploading}
              >
                {this.state.step === 5 ? "Upload" : "Next"}
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          open={this.state.deleteId.length > 0}
          onClose={() => this.setState({ deleteId: "" })}
        >
          <div className="modal category">
            <div className="head">
              <h4>Are You Sure?</h4>
              <i
                className="fas fa-times"
                onClick={() =>
                  this.setState({
                    deleteId: "",
                  })
                }
              ></i>
            </div>
            <div className="body">
              <p>Are you sure, you want to delete this item?</p>
            </div>
            <div className="footer">
              <Button
                variant="text"
                color="primary"
                onClick={() =>
                  this.setState({
                    deleteId: "",
                  })
                }
                disabled={this.state.uploading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleDelete}
                disabled={this.state.uploading}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          open={this.state.adder}
          onClose={() => this.setState({ adder: false })}
        >
          <div
            style={{
              padding: "30px 20px 20px",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              width: 200,
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <i
              className="fas fa-times"
              style={{
                position: "absolute",
                top: 5,
                right: 8,
                cursor: "pointer",
              }}
              onClick={() => this.setState({ adder: false })}
            ></i>
            <TextField
              variant="outlined"
              size="small"
              name="adderInput"
              label="Enter Variation"
              value={this.state.adderInput}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              variant="outlined"
              size="small"
              type="number"
              name="listing"
              label="Enter Listing Price"
              value={this.state.listing}
              onChange={this.handleChange}
              fullWidth
              style={{ margin: "10px 0" }}
            />
            <TextField
              variant="outlined"
              size="small"
              type="number"
              name="usual"
              label="Enter Usual Price"
              value={this.state.usual}
              onChange={this.handleChange}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (
                  this.state.adderInput.length > 0 &&
                  parseInt(this.state.usual) > 0 &&
                  parseInt(this.state.listing) > 0
                ) {
                  this.setState({
                    variationsArray: [
                      ...this.state.variationsArray,
                      {
                        variation: this.state.adderInput,
                        usual: parseInt(this.state.usual),
                        listing: parseInt(this.state.listing),
                      },
                    ],
                    adder: false,
                    adderInput: "",
                    usual: "",
                    listing: "",
                  });
                } else {
                  toaster.notify("Please fill in all fields to add!!");
                }
              }}
              style={{ marginTop: 15, marginLeft: "auto" }}
            >
              Add
            </Button>
          </div>
        </Modal>
        <Backdrop className="backdrop" open={this.state.uploading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }
}
