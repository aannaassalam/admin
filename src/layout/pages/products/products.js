import React, { Component } from "react";
import "./products.css";
import firebase from "firebase";
import CategoryCard from "../../components/category-card/category-card";
import Section from "./section/section";

export default class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      tab: 0,
      categoryName: "",
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection("settings")
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          this.setState({
            categories: doc.data().categories,
          });
        });
      });
  }

  render() {
    return (
      <div className="products">
        {this.state.tab === 0 ? (
          <div className="card-container">
            {this.state.categories.length > 0 ? (
              this.state.categories.map((category, index) => (
                <CategoryCard
                  img={category.image}
                  name={category.name}
                  key={index}
                  click={() =>
                    this.setState({
                      tab: 1,
                      categoryName: category.name,
                    })
                  }
                  product
                />
              ))
            ) : (
              <h3 style={{ width: "100%", textAlign: "center" }}>
                Add Categories inorder to add products!!
              </h3>
            )}
          </div>
        ) : (
          <Section
            categoryName={this.state.categoryName}
            back={() =>
              this.setState({
                tab: 0,
              })
            }
          />
        )}
      </div>
    );
  }
}
