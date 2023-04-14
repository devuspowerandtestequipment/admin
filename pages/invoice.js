import React from 'react'
import { connect } from 'react-redux'
import Head from 'next/head'

export const invoice = (props) => {
  return (
    <>
    <Head>
        <title>My page title</title>
        <link rel="stylesheet" href="https://angfuzsoft.com/html/invce/demo/assets/css/app.min.css" />
        <link rel="stylesheet" href="https://angfuzsoft.com/html/invce/demo/assets/css/style.css" />
    </Head>
    
    <div className="tm_container">
  <div className="tm_invoice_wrap">
    <div className="tm_invoice tm_style2" id="tm_download_section">
      <div className="tm_invoice_in">
        <div className="tm_invoice_head tm_top_head tm_mb20">
          <div className="tm_invoice_left">
            <div className="tm_logo"><img src="assets/img/logo.svg" alt="Logo" /></div>
          </div>
          <div className="tm_invoice_right">
            <div className="tm_grid_row tm_col_3">
              <div>
                <b className="tm_primary_color">Email</b> <br />
                support@gmail.com <br />
                career@gmail.com
              </div>
              <div>
                <b className="tm_primary_color">Phone</b> <br />
                +99-131-124-567 <br />
                Monday to Friday
              </div>
              <div>
                <b className="tm_primary_color">Address</b> <br />
                9 Paul Street, London <br />
                England EC2A 4NE
              </div>
            </div>
          </div>
        </div>
        <div className="tm_invoice_info tm_mb10">
          <div className="tm_invoice_info_left">
            <p className="tm_mb2"><b>Invoice To:</b></p>
            <p>
              <b className="tm_f16 tm_primary_color">Lowell H. Dominguez</b> <br />
              84 Spilman Street, London <br />United Kingdom. <br />
              lowell@gmail.com <br />
              +99-327-123-987
            </p>
          </div>
          <div className="tm_invoice_info_right">
            <div className="tm_ternary_color tm_f50 tm_text_uppercase tm_text_center tm_invoice_title tm_mb15 tm_mobile_hide">Invoice</div>
            <div className="tm_grid_row tm_col_3 tm_invoice_info_in tm_accent_bg">
              <div>
                <span className="tm_white_color_60">Grand Total:</span> <br />
                <b className="tm_f16 tm_white_color">$1732</b>
              </div>
              <div>
                <span className="tm_white_color_60">Invoice Date:</span> <br />
                <b className="tm_f16 tm_white_color">10 March 2022</b>
              </div>
              <div>
                <span className="tm_white_color_60">Invoice No:</span> <br />
                <b className="tm_f16 tm_white_color">#LL93784</b>
              </div>
            </div>
          </div>
        </div>
        <div className="tm_table tm_style1">
          <div className="tm_round_border">
            <div className="tm_table_responsive">
              <table>
                <thead>
                  <tr>
                    <th className="tm_width_7 tm_semi_bold tm_accent_color">Item</th>
                    <th className="tm_width_2 tm_semi_bold tm_accent_color">Price</th>
                    <th className="tm_width_1 tm_semi_bold tm_accent_color">Qty</th>
                    <th className="tm_width_2 tm_semi_bold tm_accent_color tm_text_right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="tm_gray_bg">
                    <td className="tm_width_7">
                      <p className="tm_m0 tm_f16 tm_primary_color">Website Design</p>
                      Six web page designs and three times revision
                    </td>
                    <td className="tm_width_2">$350</td>
                    <td className="tm_width_1">1</td>
                    <td className="tm_width_2 tm_text_right">$350</td>
                  </tr>
                  <tr>
                    <td className="tm_width_7">
                      <p className="tm_m0 tm_f16 tm_primary_color">Web Development</p>
                      Convert pixel-perfect frontend and make it dynamic
                    </td>
                    <td className="tm_width_2">$600</td>
                    <td className="tm_width_1">1</td>
                    <td className="tm_width_2 tm_text_right">$600</td>
                  </tr>
                  <tr className="tm_gray_bg">
                    <td className="tm_width_7">
                      <p className="tm_m0 tm_f16 tm_primary_color">App Development</p>
                      Android &amp; Ios Application Development
                    </td>
                    <td className="tm_width_2">$200</td>
                    <td className="tm_width_1">2</td>
                    <td className="tm_width_2 tm_text_right">$400</td>
                  </tr>
                  <tr>
                    <td className="tm_width_7">
                      <p className="tm_m0 tm_f16 tm_primary_color">Digital Marketing</p>
                      Facebook, Youtube and Google Marketing
                    </td>
                    <td className="tm_width_2">$100</td>
                    <td className="tm_width_1">3</td>
                    <td className="tm_width_2 tm_text_right">$300</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="tm_invoice_footer tm_mb15 tm_m0_md">
            <div className="tm_left_footer">
              <div className="tm_card_note tm_ternary_bg tm_white_color"><b>Payment info: </b>Credit Card - 236***********928</div>
              <p className="tm_mb2"><b className="tm_primary_color">Important Note:</b></p>
              <p className="tm_m0">Delivery dates are not guaranteed and Seller has <br />no liability for damages that may be incurred <br />due to any delay.</p>
            </div>
            <div className="tm_right_footer">
              <table className="tm_mb15">
                <tbody>
                  <tr>
                    <td className="tm_width_3 tm_primary_color tm_border_none tm_bold">Subtoal</td>
                    <td className="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_bold">$1650</td>
                  </tr>
                  <tr>
                    <td className="tm_width_3 tm_danger_color tm_border_none tm_pt0">Discount 10%</td>
                    <td className="tm_width_3 tm_danger_color tm_text_right tm_border_none tm_pt0">+$164</td>
                  </tr>
                  <tr>
                    <td className="tm_width_3 tm_primary_color tm_border_none tm_pt0">Tax 5%</td>
                    <td className="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_pt0">+$82</td>
                  </tr>
                  <tr>
                    <td className="tm_width_3 tm_border_top_0 tm_bold tm_f16 tm_white_color tm_accent_bg tm_radius_6_0_0_6">Grand Total	</td>
                    <td className="tm_width_3 tm_border_top_0 tm_bold tm_f16 tm_primary_color tm_text_right tm_white_color tm_accent_bg tm_radius_0_6_6_0">$1732</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="tm_invoice_footer tm_type1">
            <div className="tm_left_footer" />
            <div className="tm_right_footer">
              <div className="tm_sign tm_text_center">
                <img src="assets/img/sign.svg" alt="Sign" />
                <p className="tm_m0 tm_ternary_color">Jhon Donate</p>
                <p className="tm_m0 tm_f16 tm_primary_color">Accounts Manager</p>
              </div>
            </div>
          </div>
        </div>
        <div className="tm_note tm_font_style_normal tm_text_center">
          <hr className="tm_mb15" />
          <p className="tm_mb2"><b className="tm_primary_color">Terms &amp; Conditions:</b></p>
          <p className="tm_m0">All claims relating to quantity or shipping errors shall be waived by Buyer unless made in writing to <br />Seller within thirty (30) days after delivery of goods to the address stated.</p>
        </div>{/* .tm_note */}
      </div>
    </div>
  </div>
</div>

    </>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(invoice)