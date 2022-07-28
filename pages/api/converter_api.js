var html_to_pdf = require('html-pdf-node');
var pdf = require('html-pdf');

export async function htmltoPdf(givenData)
{
    try {
        const {image, data} = givenData;
        let options = { /* format: 'A4' */ };
        let file = `<!DOCTYPE html>
        <html>
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
        .card {
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
          transition: 0.3s;
          width: 40%;
          border-radius: 5px;
        }
        
        .card:hover {
          box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        }
        
        img {
          border-radius: 5px 5px 0 0;
        }
        
        .container {
          padding: 2px 16px;
        }
        </style>
        </head>
        <body>
        
        <div class="card">
          <img src="${image}" alt="Avatar" style="width:100%">
          <div class="container">
                <table>
                    <tr><td><h4><b>${data.name}</b></h4> </td></tr>
                    <tr><td><h4><b>${data.dob}</b></h4> </td></tr>
                    <tr><td><h4><b>${data.gender}</b></h4> </td></tr>
                </table>
          </div>
        </div>
        
        </body>
        </html> `;
        const pdfBuffer = await getBufferData(file); 
        console.log('pdfBuffer:', pdfBuffer);
       /*  const pdfBuffer = await html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
            console.log("PDF Buffer:-", pdfBuffer);
            return pdfBuffer;
        });*/
        let basedata = pdfBuffer.toString('base64');
        return { status:"success", base64: basedata};
    } catch (error) {
        return{  status:"error", message: error.message ? error.message : error };
    }
}

export async function getBufferData(file) {
  return  new Promise((resolve, reject) => {
      pdf.create(file).toBuffer(function(err, buffer){
        console.log('buffer:', buffer);
        resolve(buffer);
      });
   })
}