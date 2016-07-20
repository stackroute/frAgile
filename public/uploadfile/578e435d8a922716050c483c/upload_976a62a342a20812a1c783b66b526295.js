//var stdin=process.openStdin();

var arr=[{a:[{d:'d'},{r:'b'}]},
{b:[{l:'a'},{r:'c'},{d:'e'}]},
{c:[{l:'b'},{d:'f'}]},
{d:[{r:'e'},{d:'g'},{u:'a'}]},
{e:[{u:'b'},{d:'h'},{r:'f'},{l:'d'}]},
{f:[{u:'c'},{l:'e'},{d:'i'}]},
{g:[{u:'d'},{r:'h'}]},
{h:[{u:'e'},{d:'j'},{r:'i'},{l:'g'}]},
{i:[{l:'h'},{u:'f'}]},
{j:[{u:'h'}]}];
var arrIndex=['a','b','c','d','e','f','g','h','i','j'];

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk) { start(chunk) });

function start(chunk){

      var chunks = chunk.toString().split('\n');
var number=parseInt(chunks);

var count=0;
for(var i=0;i<10;i++)
{

var n=number;
while(n>0)
{
  var index=0;
  var calculate=function(letter,end,e,index)
  {
    if(end-1==0)
      {
        count++;
        return 0;
      }
      else {
        var dir=arr[e][letter];
        var hold=end;
        for(var j=index;j<dir.length;j++)
        {
          var key=Object.keys(dir[j])[0]
          letter=dir[j][key];
          e=arrIndex.indexOf(letter);
          end=hold-1;
          calculate(letter,end,e,j);
        }
      }
  }
  calculate(arrIndex[i],n,i,index);
  n=n-1;
}
if(i==9)
console.log(count);
}
}
