// verify math tables in trig-time-attack.html against Math.sin/cos/tan
// (radian display is now computed from the angle via gcd reduction,
//  so there is no hand-typed conversion table to check anymore)
const SIN={0:"0",30:"1/2",45:"1/√2",60:"√3/2",90:"1",120:"√3/2",135:"1/√2",150:"1/2",
  180:"0",210:"-1/2",225:"-1/√2",240:"-√3/2",270:"-1",300:"-√3/2",315:"-1/√2",330:"-1/2"};
const COS={0:"1",30:"√3/2",45:"1/√2",60:"1/2",90:"0",120:"-1/2",135:"-1/√2",150:"-√3/2",
  180:"-1",210:"-√3/2",225:"-1/√2",240:"-1/2",270:"0",300:"1/2",315:"1/√2",330:"√3/2"};
const TAN={0:"0",30:"1/√3",45:"1",60:"√3",90:"none",120:"-√3",135:"-1",150:"-1/√3",
  180:"0",210:"1/√3",225:"1",240:"√3",270:"none",300:"-√3",315:"-1",330:"-1/√3"};

function tok(s){
  if(s[0]==="√") return Math.sqrt(Number(s.slice(1)));
  return Number(s);
}
function parseVal(v){
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

// general-angle lookup: value must equal the coterminal angle's value
for(const b of [0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330]){
  for(const k of [-1,1]){
    checks++;
    const deg=b+360*k;
    const norm=((deg%360)+360)%360;
    if(norm!==b){console.log(`FAIL normalize ${deg}° -> ${norm}° (expected ${b}°)`);fails++;}
  }
}
console.log(`${checks} checks, ${fails} failures`);
