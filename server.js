var http = require('http');
var server = http.createServer(requestHandler); 
server.listen(process.env.PORT, process.env.IP, startHandler);

function startHandler()
{
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
}

function requestHandler(req, res) 
{
  try
  {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    

    var result = {};
    if (query['cmd'] == 'CalcCharge')
    {
      result = serviceCharge(query);
    }
    else if (query['cmd'] == undefined)
    {
      throw Error("A command must be specified");
    } 
    else
    {
      throw Error("Invalid command: " + query['cmd']);
    }
 
    res.write(JSON.stringify(result));
    res.end('');
  }
  catch (e)
  {
    var error = {'error' : e.message};
    res.write(JSON.stringify(error));
    res.end('');
  }
}

function serviceCharge(query)
{
   if(isNaN(query['savingsBal'])||!typeof(query['savingsBal'] == 'number'))
      throw Error("Invalid value for savingsBal");
   if(isNaN(query['checkBal'])||!typeof(query['checkBal'] == 'number'))
      throw Error("Invalid value for checkBal"); 
   if(isNaN(query['checks'])||!typeof(query['checks'] == 'number')||parseInt(query['checks']) < 0)
      throw Error("Invalid value for checks");      

    var charge = 0.00;
    var parsedCheck = parseInt(query['checkBal']);
    var parsedSav = parseInt(query['savingsBal']);
    var parsedCnt = parseInt(query['checks']);
    if(parsedCheck < 1000 && parsedSav < 1500)
        for(var i =1;i <= parsedCnt;i++ )
        {
            charge += .15;
        }
    
    var result = {'charge' : charge}; 
    return result;
}
