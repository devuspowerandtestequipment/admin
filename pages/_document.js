import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        {/* <script charset="UTF-8" src="//web.webpushs.com/js/push/56d759751217b0463ab7e6f40f52c6ef_1.js" async></script> */}

        <Head />
        {/* <script
        id="script"
        dangerouslySetInnerHTML={{
            __html: `
            var s = document.createElement("script")
                s.src = "https://notix.io/ent/current/enot.min.js"
                s.onload = function (sdk) {
                    sdk.startInstall({
            "appId": "10058bbcd6419c8643c520d7d8f6304",
            "loadSettings": true
            })
                }
                document.head.append(s)
                `,
        }}
        ></script> */}


        
        <body>
          <Main />
          <NextScript />
          
        </body>


      

      </Html>
    )
  }
}

export default MyDocument