import React, { useState } from "react";
import { connect } from "react-redux";
import { IKContext, IKUpload } from "imagekitio-react";
import { message, Spin } from "antd";

export const ImageUplaod = (props) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [randnum,setRandNum] = useState(Math.floor(Math.random(1111,9999)*4563))

  const handleImageChangeClick = () => {
    setUploading(true);

  };

  const handleImageChangeError = () => {
    setLoading(false);
    setUploading(false);
    message.warning('Failed');
  }


  const handleImageChange = e => {
    console.log(e)
  }

  return (
    <div className="field">
      <center>
        {loading ? (
          <Spin size="large" style={{ marginTop: "30px" }} />
        ) : (
          <>
            {uploading ? (
              <h5
                style={{
                  margin: 0,
                  marginTop: "15%",
                  msTransform: "translateY(-50%)",
                  transform: "translateY(-50%)",
                }}
              >
                  <Spin /> &nbsp;
                Uploading...
              </h5>
            ) : (
              <>
                <label for={randnum}>
                  <img
                    src="https://ik.imagekit.io/nextjsecommerce/OTHER_IMAGES/noimage?tr=w-150,h-150"
                    alt="productimage"
                    style={{border:'1px solid #cccccc'}}
                  />
                  <h5 style={{ marginTop: "-30px" }}>{props.title}</h5>
                </label>

                <div className="ui input">
                  <IKContext
                    publicKey={process.env.imagekitPublicKey}
                    urlEndpoint={process.env.imagekitUrlEndpoint}
                    authenticationEndpoint={process.env.backendURL+'/imagekitauth'}
                  >
                    <IKUpload
                      id={randnum}
                      useUniqueFileName={true}
                      folder={"/productimages"}
                      onChange={handleImageChangeClick}
                      onError={handleImageChangeError}
                      onSuccess={handleImageChange}
                      multiple={false}
                      accept="image/png, image/gif, image/jpeg"
                      hidden
                    />
                  </IKContext>
                </div>
              </>
            )}
          </>
        )}
      </center>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ImageUplaod);
