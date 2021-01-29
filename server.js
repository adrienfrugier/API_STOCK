const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const cheerio = require('cheerio');
const fetch = require('cross-fetch');

const URL = "https://www.topachat.com/pages/produits_cat_est_micro_puis_rubrique_est_wgfx_pcie_puis_f_est_58-11575,11445,11446%7Cp-149700_234999.html";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.listen(4000, () => {
  console.log('Authentication service started on port 4000');
});

app.get('/stock', async (req, res) => {

    const response = await fetch(URL, {
        headers: {
          Accept: 'text/html',
          "Content-Type": "application/html"
        }
    });

    if (response.status != 200) {
        throw new Error("Bad response from server");
    }

    const data = await response.text();

    let $ = cheerio.load(data); 
    const arr = [];

    $('div.display > section').children().each(function(index){
        const stock = $(this).find('section').attr('class');
        const name = $(this).find('div.libelle>a>h3').text();
        const price = $(this).find('div.price>a>div.prodF>div.prod_px_euro').attr('content');

        if(stock === 'en-rupture') {
        }else{            
            const obj = { 
                name : name, 
                price : price,
                stock : stock,
            }; 
        arr.push(obj); 
        }
    });

    res.json(arr);
});