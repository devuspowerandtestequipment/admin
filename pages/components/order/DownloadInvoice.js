import { Button, Tooltip } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { CloudDownloadOutlined } from '@ant-design/icons';

let pdf = {
    file: "",
    file_name: "Purchase Invoice"
}

export const DownloadInvoice = (props) => {
    
    

    function downloadPDF(pdf) {
        const pdfLink = `data:application/pdf;base64,${props.invoice_pdf}`;
        const anchorElement = document.createElement('a');
        const fileName = `INVOICE_${props.order_id}.pdf`;
        anchorElement.href = pdfLink;
        anchorElement.download = fileName;
        anchorElement.click();
    }



  return (
    <Tooltip title="Download invoice">
    <Button type='primary' icon={<CloudDownloadOutlined />} onClick={()=>downloadPDF()} > Invoice</Button>
    </Tooltip>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadInvoice)