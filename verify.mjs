import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {types,statuses,total,select,countBy,ranking} from './dist/model.mjs';
const data=JSON.parse(readFileSync(new URL('./dist/data.json',import.meta.url),'utf8'));
assert.equal(total(data.groups),51);
assert.deepEqual(countBy(data.groups,'vinculo',types).map(x=>x.n),[42,3,4,2]);
assert.deepEqual(countBy(data.groups,'study',statuses).map(x=>x.n),[9,42,0]);
assert.deepEqual(countBy(data.groups,'dep',statuses).map(x=>x.n),[34,12,5]);
assert.equal(total(select(data.groups,{vinculo:'Estagiário',study:'Sim',dep:'Sim'})),2);
assert.equal(total(select(data.groups,{vinculo:'Comissionado',study:'Sim'})),0);
assert.deepEqual(ranking(select(data.groups,{study:'Não'}),'coll',true),[]);
assert.equal(ranking(data.groups,'coll',true).find(r=>r.label==='Estácio').n,3);
assert.equal(ranking(data.groups,'coll',true).find(r=>r.label==='UECE').n,4);
assert.equal(ranking(data.groups,'coll',false).find(r=>r.label==='Unifor').n,16);
assert.equal(ranking(data.groups,'dep',true).length,26);
assert.equal(ranking(data.groups,'dep',true).find(r=>r.label==='Ari de Sá').n,5);
assert.equal(ranking(data.groups,'dep',true).find(r=>r.label==='Farias Brito').n,4);
assert(!ranking(data.groups,'dep',false).some(r=>r.label==='Creche municipalizada'));
assert.equal(data.groups.filter(g=>g.dep==='Sim').reduce((s,g)=>s+g.depUnidentified,0),2);
assert.equal(ranking(data.groups,'coll',false).find(r=>r.label==='CHISTUS (nome a confirmar)').n,1);
assert.equal(data.meta.responses-data.meta.excluded,data.meta.people);
let combinations=0;
for(const vinculo of ['',...types])for(const study of ['',...statuses])for(const dep of ['',...statuses]){
  const pool=select(data.groups,{vinculo,study,dep}),n=total(pool);
  for(const [key,values] of [['vinculo',types],['study',statuses],['dep',statuses]])assert.equal(countBy(pool,key,values).reduce((s,r)=>s+r.n,0),n);
  for(const target of ['coll','dep'])for(const yes of [true,false]){
    const rows=ranking(pool,target,yes),denominator=total(yes?pool.filter(g=>g[target==='coll'?'study':'dep']==='Sim'):pool);
    assert(rows.every(r=>Number.isInteger(r.n)&&r.n>0&&r.n<=denominator));
  }
  combinations++;
}
const json=JSON.stringify(data);
assert(!/@|telefone|email|e-mail|Nome completo|Carimbo|8598|hotmail|gmail/i.test(json),'Public data must not contain contact fields or identifiers');
assert(data.groups.every(g=>Object.keys(g).every(k=>['vinculo','study','dep','n','collInstitutions','depInstitutions','collBlank','depBlank','collUnidentified','depUnidentified'].includes(k))));
for(const file of readdirSync(new URL('./dist/',import.meta.url)))assert(!/xlsx|csv|raw|source/i.test(file));
console.log(`PASS: 51 unique collaborators; vínculo/study/dependent totals reconcile; ${combinations} filter combinations reconcile; institution totals and public data privacy checks pass.`);
