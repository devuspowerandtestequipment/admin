import React, { Component } from "react";
import { connect } from "react-redux";
import Body from "../components/Body";
import {
  Button,
  Checkbox,
  Form,
  FormGroup,
  Input,
  Radio,
  Select,
  TextArea,
} from "semantic-ui-react";
import { Layout, Breadcrumb } from "antd";
import ImageUplaod from "../components/products/ImageUplaod";
const { Content } = Layout;

export class create extends Component {
  render() {
    return (
      <Body>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>Products</Breadcrumb.Item>
            <Breadcrumb.Item>Create</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24 }}>
            <Form>
              <div>
                <h4>Basic Information</h4>
                <Form.Input fluid label="Name" placeholder="Product Name" />
                <Form.Field
                  fluid
                  label="Descripion"
                  control="textarea"
                  rows="3"
                />

                <Form.Group widths="equal">
                  <Form.Input fluid label="Stock" placeholder="Product Name" />
                  <Form.Input fluid label="SKU" placeholder="Product Name" />
                  <Form.Field label="Return Available?" control="select">
                    <option value="Simple">Simple</option>
                    <option value="Variable">Variable</option>
                  </Form.Field>
                  <Form.Field label="Warranty Available?" control="select">
                    <option value="Simple">Simple</option>
                    <option value="Variable">Variable</option>
                  </Form.Field>
                </Form.Group>

                <Form.Group widths="equal">
                  <Form.Field label="Brand" control="select">
                    <option value="Simple">Simple</option>
                    <option value="Variable">Variable</option>
                  </Form.Field>
                  <Form.Field label="Category" control="select">
                    <option value="Simple">Simple</option>
                    <option value="Variable">Variable</option>
                  </Form.Field>
                  <Form.Field label="Sub Category" control="select">
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Form.Field>
                  <Form.Field label="Child Category" control="select">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Field>
                </Form.Group>

                <Form.Group widths="equal">
                  <Form.Field label="Type" control="select">
                    <option value="Simple">Simple</option>
                    <option value="Variable">Variable</option>
                  </Form.Field>
                  <Form.Field label="Status" control="select">
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Form.Field>
                  <Form.Field label="Featured" control="select">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Field>
                  <Form.Field label="Tax" control="select">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Field>
                </Form.Group>
              </div>

              <br />
              <br />
              <div>
                <h4>Config</h4>
                <FormGroup widths="equal">
                  <Form.Input fluid label="L x Black" placeholder="Name" />
                  <Form.Input fluid label="L x Black" placeholder="Main Price" />
                  <Form.Input fluid label="L x Black" placeholder="Offer Price" />
                  <Form.Input fluid label="S x Black" placeholder="Stock" />
                  <Form.Field label="Status" control="select">
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Form.Field>
                </FormGroup>

                <FormGroup widths="equal">
                  <Form.Input fluid label="L x Black" placeholder="Name" />
                  <Form.Input fluid label="L x Black" placeholder="Main Price" />
                  <Form.Input fluid label="L x Black" placeholder="Offer Price" />
                  <Form.Input fluid label="S x Black" placeholder="Stock" />
                  <Form.Field label="Status" control="select">
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Form.Field>
                </FormGroup>

                <FormGroup widths="equal">
                  <Form.Input fluid label="L x Black" placeholder="Name" />
                  <Form.Input fluid label="L x Black" placeholder="Main Price" />
                  <Form.Input fluid label="L x Black" placeholder="Offer Price" />
                  <Form.Input fluid label="S x Black" placeholder="Stock" />
                  <Form.Field label="Status" control="select">
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Form.Field>
                </FormGroup>

                <FormGroup widths="equal">
                  <Form.Input fluid label="L x Black" placeholder="Name" />
                  <Form.Input fluid label="L x Black" placeholder="Main Price" />
                  <Form.Input fluid label="L x Black" placeholder="Offer Price" />
                  <Form.Input fluid label="S x Black" placeholder="Stock" />
                  <Form.Field label="Status" control="select">
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Form.Field>
                </FormGroup>
              </div>

              <br />
              <br />
              <div>
                <h4>Price</h4>
                <FormGroup widths="equal">
                  <Form.Input fluid label="Price" placeholder="Product Price" />
                  <Form.Input
                    fluid
                    label="Offer Price"
                    placeholder="Product Price"
                  />
                </FormGroup>
              </div>
              <br />
              <br />
              <div>
                <h4>Advance Information</h4>
                <FormGroup widths="equal">
                  <Form.Input
                    fluid
                    label="Minimum Order"
                    placeholder="Product Name"
                  />
                  <Form.Input
                    fluid
                    label="Maximum Order"
                    placeholder="Product Name"
                  />
                </FormGroup>
              </div>

              <br />
              <br />
              <div>
                <h4>Images/Videos</h4>

                <Form.Input
                  fluid
                  label="YouTube URL"
                  placeholder="Product Name"
                />

                <FormGroup widths="equal">
                  <ImageUplaod title="Profile Image" />
                  <ImageUplaod title="Image 1" />
                  <ImageUplaod title="Image 2" />
                  <ImageUplaod title="Image 3" />
                </FormGroup>
              </div>
              <br />
              <br />
              <div>
                <h4>SEO Information</h4>
                <Form.Input fluid label="URL" placeholder="Product Name" />
                <Form.Input
                  fluid
                  label="Meta Title"
                  placeholder="Product Name"
                />
                <Form.Field
                  fluid
                  label="Meta Descripion"
                  control="textarea"
                  rows="3"
                />
              </div>
            </Form>
          </div>
        </Content>
      </Body>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(create);
