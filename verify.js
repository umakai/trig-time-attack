// verify math tables in trig-time-attack.html against Math.sin/cos/tan
const SIN={0:"0",30:"1/2",45:"1/√2",60:"√3/2",90:"1",120:"√3/2",135:"1/√2",150:"1/2",
  180:"0",210:"-1/2",225:"-1/√2",240:"-√3/2",270:"-1",300:"-√3/2",315:"-1/√2",330:"-1/2"};
const COS={0:"1",30:"√3/2",45:"1/√2",60:"1/2",90:"0",120:"-1/2",135:"-1/√2",150:"-√3/2",
  180:"-1",210:"-√3/2",225:"-1/√2",240:"-1/2",270:"0",300:"1/2",315:"1/√2",330:"√3/2"};
const TAN={0:"0",30:"1/√3",45:"1",60:"√3",90:"none",120:"-√3",135:"-1",150:"-1/√3",
  180:"0",210:"1/√3",225:"1",240:"√3",270:"none",300:"-√3",315:"-1",330:"-1/√3"};
const RADF={0:[0,1],30:[1,6],45:[1,4],60:[1,3],90:[1,2],120:[2,3],135:[3,4],150:[5,6],
  180:[1,1],210:[7,6],225:[5,4],240:[4,3],270:[3,2],300:[5,3],315:[7,4],330:[11,6]};

function tok(s){ // "√3" -> sqrt(3), "2" -> 2
  if(s[0]==="√") return Math.sqrt(Number(s.slice(1)));
  return Number(s);
}
function parseVal(v){ // "-√3/2" -> number, "none" -> null
  if(v==="none") return null;
  let sign=1, s=v;
  if(s[0]==="-"){sign=-1;s=s.slice(1);}
  if(s.includes("/")){const[a,b]=s.split("/");return sign*tok(a)/tok(b);}
  return sign*tok(s);
}

const EPS=1e-12;
let fails=0, checks=0;
for(const [name,table,fn] of [["sin",SIN,Math.sin],["cos",COS,Math.cos],["tan",TAN,Math.tan]]){
  for(const deg of Object.keys(table)){
    checks++;
    const th=deg*Math.PI/180;
    const expectUndef = name==="tan" && Math.abs(Math.cos(th))<EPS;
    const got=parseVal(table[deg]);
    if(expectUndef){
      if(got!==null){console.log(`FAIL ${name} ${deg}°: should be undefined, table says ${table[deg]}`);fails++;}
      continue;
    }
    if(got===null){console.log(`FAIL ${name} ${deg}°: table says undefined, actual ${fn(th)}`);fails++;continue;}
    if(Math.abs(got-fn(th))>1e-9){
      console.log(`FAIL ${name} ${deg}°: table=${table[deg]} (${got}), actual=${fn(th)}`);fails++;
    }
  }
}
// verify radian fractions: (n/d)*180 must equal deg
for(const deg of Object.keys(RADF)){
  checks++;
  const [n,d]=RADF[deg];
  if(Math.abs(n/d*180-deg)>EPS && !(deg==="0"&&n===0)){
    console.log(`FAIL RADF ${deg}°: ${n}π/${d} = ${n/d*180}°`);fails++;
  }
}
console.log(`${checks} checks, ${fails} failures`);
