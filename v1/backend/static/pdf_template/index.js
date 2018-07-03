var fs = require('fs');
var pdf = require('html-pdf');
var options = { format: 'A4' };

module.exports = (req, res) => {
  inv_no = req.params.inv_id
  var html = fs.readFileSync('./pdf/inv_template.html', 'utf8');
  pdf.create(html, options).toFile('./static/pdf/'+inv_no+'.pdf', (err, res) => {if(err) console.log(err)});
  return res.send({success: true, path: '/pdf/'+inv_no+'.pdf'});
}
